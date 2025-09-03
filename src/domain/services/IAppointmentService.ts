import type { Appointment } from "../../domain/models/Appointment";
import type { DateRange } from "../../domain/value-objects/DateRange";

export abstract class IAppointmentService {
    abstract getAll(): Promise<Appointment[]>;
    abstract getPaginated(options?: {
        pageSize?: number;
        page?: number;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        searchQuery?: string;
        agentIds?: string[];
        sort?: { field: string; direction: "asc" | "desc" }[];
    }): Promise<{
        appointments: Appointment[];
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
        totalCount: number;
    }>;
    abstract getById(id: string): Promise<Appointment | null>;
    abstract create(appointment: Partial<Appointment>): Promise<Appointment>;
    abstract update(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment>;
    abstract delete(id: string): Promise<boolean>;
    abstract getByContactId(contactId: string): Promise<Appointment[]>;
    abstract getByAgentId(agentId: string): Promise<Appointment[]>;
    abstract getByDateRange(dateRange: DateRange): Promise<Appointment[]>;
}
