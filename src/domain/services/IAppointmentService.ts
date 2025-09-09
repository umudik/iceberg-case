import type { Appointment } from "../../domain/models/Appointment";
import type { DateRange } from "../../domain/value-objects/DateRange";

export abstract class IAppointmentService {
    abstract getAll(): Promise<Appointment[]>;
    abstract getById(id: string): Promise<Appointment | null>;
    abstract create(appointment: Partial<Appointment>): Promise<Appointment>;
    abstract update(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment>;
    abstract getByContactId(contactId: string): Promise<Appointment[]>;
}
