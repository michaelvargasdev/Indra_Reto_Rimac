export {
    SNS_SCHEDULE_ARN_PE: process.env.SNS_SCHEDULE_ARN_PE,
    SNS_SCHEDULE_ARN_CL: process.env.SNS_SCHEDULE_ARN_CL,
    SQS_SCHEDULE_PE: process.env.SQS_SCHEDULE_PE,
    SQS_SCHEDULE_CL: process.env.SQS_SCHEDULE_CL,
    DDB_APPOINTMENT: process.env.DDB_APPOINTMENT,
    DDB_SCHEDULE: process.env.DDB_SCHEDULE,
    RDS_MYSQL_CONECTION: JSON.parse(`${process.env.RDS_MYSQL_CONECTION}`)
}
