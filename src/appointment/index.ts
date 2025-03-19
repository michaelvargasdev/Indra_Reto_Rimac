
import type {
    Context,
    APIGatewayProxyStructuredResultV2,
    APIGatewayProxyEventV2,
    SQSEvent,
    Handler,
  } from "aws-lambda";
  
  export const handler: Handler = async (
    _event: any,
    _context: Context
  ): Promise<APIGatewayProxyStructuredResultV2> => {

    if (_event.body !== null) {
      const event: APIGatewayProxyEventV2 = _event as APIGatewayProxyEventV2;
      const { body } = event;

    } else {
      const event: SQSEvent = _event as SQSEvent;
      for (const message of event.Records)
      {
          
      }
    }

    return {
      statusCode: 200,.
      body: JSON.stringify({
        ok: true
      }),
    };
  };