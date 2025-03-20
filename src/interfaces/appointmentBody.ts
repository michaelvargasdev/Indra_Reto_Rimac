import { ISchedule } from "./schedule";

export interface IAppointmentBody {
    insuredId: string,
    schedule: ISchedule,
    countryISO: string
}
