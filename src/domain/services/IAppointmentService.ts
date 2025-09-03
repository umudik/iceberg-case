import type { Appointment } from "../models/Appointment";

export abstract class IAppointmentService {
    abstract getAll(): Promise<Appointment[]>;
    abstract getById(id: string): Promise<Appointment | null>;
    abstract create(
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null>;
    abstract update(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null>;
    abstract delete(id: string): Promise<boolean>;
    abstract getByContactId(contactId: string): Promise<Appointment[]>;
    abstract getByAgentId(agentId: string): Promise<Appointment[]>;
    abstract getByDateRange(
        startDate: Date,
        endDate: Date,
    ): Promise<Appointment[]>;
}
