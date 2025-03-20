import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import mysql from 'mysql2/promise';
import type {
    Context,
    APIGatewayProxyStructuredResultV2,
    SQSEvent,
    Handler,
} from "aws-lambda";
import { RDS_MYSQL_CONECTION } from '../utils/env';
import { IAppointment } from '../interfaces/appointment';

export const handler: Handler = async (
    _event: SQSEvent,
    _context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {

    const connection = await mysql.createConnection(
        `mysql://${RDS_MYSQL_CONECTION.USER}:${RDS_MYSQL_CONECTION.PASSWORD}@${RDS_MYSQL_CONECTION.HOST}:${RDS_MYSQL_CONECTION.PORT}/${RDS_MYSQL_CONECTION.DB}`
    );

    let scheduleId = '';
    for (const message of _event.Records) {
        const appointment: IAppointment = JSON.parse(`${message}`) as IAppointment;
        const sql = 'INSERT INTO `appointment`(`insuredId`, `scheduleId`, `countryISO`) VALUES (?, ?, ?)';
        const values = [appointment.insuredId, appointment.scheduleId, appointment.countryISO];

        const [result, fields] = await connection.execute(sql, values);
    }

    const client = new EventBridgeClient({});

    const response = await client.send(
        new PutEventsCommand({
            Entries: [
                {
                    Detail: JSON.stringify({ scheduleId }),
                    DetailType: 'greeting',
                    Resources: [],
                    Source: 'eventbridge.integration.test',
                },
            ],
        }),
    );

    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true
        })
    };
};