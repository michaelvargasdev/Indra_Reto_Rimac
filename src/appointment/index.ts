import { SNS, DynamoDB } from 'aws-sdk';
import type {
  Context,
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyEventV2,
  SQSEvent,
  Handler,
} from "aws-lambda";
import { SNS_SCHEDULE_ARN_PE, SNS_SCHEDULE_ARN_CL, DDB_APPOINTMENT, DDB_SCHEDULE } from '../utils/env';
import { COUNTRY_ISO, APPOINTMENT_STATE } from '../contants/constants';
import { ISchedule } from '../interfaces/schedule';
import { IAppointmentBody } from '../interfaces/appointmentBody';

export const handler: Handler = async (
  _event: any,
  _context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  const ddb = new DynamoDB({ apiVersion: "2012-08-10" });

  if (_event.body !== null) {
    const event: APIGatewayProxyEventV2 = _event as APIGatewayProxyEventV2;
    const body: IAppointmentBody = JSON.parse(`${event.body}`) as IAppointmentBody;
    // Publicar en topico SNS
    const snsPublisher: SNS = new SNS();
    var paramsPublisher = {
      Message: JSON.stringify(body),
      TopicArn: COUNTRY_ISO.PE === body.countryISO ? SNS_SCHEDULE_ARN_PE : SNS_SCHEDULE_ARN_CL,
    };
    console.log(paramsPublisher, 'paramsPublisher');
    const responseSns = await snsPublisher.publish(paramsPublisher).promise();
    console.log(responseSns, 'ResponseSns');
    responseSns.MessageId as string;
    // Insertar en DynamoDB
    const paramsAppointment = {
      TableName: DDB_APPOINTMENT,
      Item: {
        insuredId: { S: body.insuredId},
        scheduleId: { S: `${body.schedule.centerId}${body.schedule.specialtyId}${body.schedule.medicId}` },
        countryISO: { S: body.countryISO }
      },
    };
    
    (await ddb.putItem(paramsAppointment).promise()).$response.data

    const paramsSchedule = {
      TableName: DDB_SCHEDULE,
      Item: {
        scheduleId: { S: `${body.schedule.centerId}${body.schedule.specialtyId}${body.schedule.medicId}` },
        centerId: { N: `${body.schedule.centerId}` },
        specialtyId: { N: `${body.schedule.specialtyId}` },
        medicId: { N: `${body.schedule.medicId}` },
        date: { S: body.schedule.date },
        state: { S: APPOINTMENT_STATE.PENDING }
      },
    };
    
    (await ddb.putItem(paramsSchedule).promise()).$response.data

  } else {
    const event: SQSEvent = _event as SQSEvent;
    for (const message of event.Records) {
      const schedule: ISchedule = JSON.parse(`${message}`) as ISchedule;

      const paramsUpdate = {
        TableName: DDB_SCHEDULE,
        Key: {
          scheduleId: { S: schedule.scheduleId },
        },
        UpdateExpression: "set state = :state",
        ExpressionAttributeValues: {
          ":state": { S: APPOINTMENT_STATE.COMPLETED },
        },
        ReturnValues: "ALL_NEW",
      };
      (await ddb.updateItem(paramsUpdate).promise()).$response.data
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true
    })
  };
};