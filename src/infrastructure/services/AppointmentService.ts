import { IAppointmentService } from "../../application/services/IAppointmentService";
import type { Appointment } from "../../domain/models/Appointment";
import type { DateRange } from "../../domain/value-objects/DateRange";
import { AirtableSDKService } from "../api/airtable-sdk.service";

export class AppointmentService extends IAppointmentService {
    private airtableService: AirtableSDKService;

    constructor() {
        super();
        this.airtableService = new AirtableSDKService();
    }

    async getAll(): Promise<Appointment[]> {
        return this.airtableService.getAllAppointments();
    }

    async getPaginated(options?: {
        pageSize?: number;
        page?: number;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        searchQuery?: string;
        agentIds?: string[];
        sort?: { field: string; direction: "asc" | "desc" }[];
    }) {
        return this.airtableService.getAppointments(options);
    }

    async getById(id: string): Promise<Appointment | null> {
        const appointments = await this.airtableService.getAllAppointments();
        const appointment = appointments.find((a) => a.id === id);
        return appointment || null;
    }

    async create(appointment: Partial<Appointment>): Promise<Appointment> {
        const result = await this.airtableService.createAppointment(
            appointment,
        );
        if (!result) {
            throw new Error("Failed to create appointment");
        }
        return result;
    }

    async update(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment> {
        const result = await this.airtableService.updateAppointment(
            id,
            appointment,
        );
        if (!result) {
            throw new Error("Failed to update appointment");
        }
        return result;
    }

    async delete(id: string): Promise<boolean> {
        return false;
    }

    async getByContactId(contactId: string): Promise<Appointment[]> {
        const appointments = await this.airtableService.getAllAppointments();
        return appointments.filter((a) => a.contact?.id === contactId);
    }

    async getByAgentId(agentId: string): Promise<Appointment[]> {
        const appointments = await this.airtableService.getAllAppointments();
        return appointments.filter((a) =>
            a.agents.some((agent) => agent.id === agentId)
        );
    }

    async getByDateRange(dateRange: DateRange): Promise<Appointment[]> {
        const appointments = await this.airtableService.getAllAppointments();
        return appointments.filter((a) =>
            dateRange.contains(a.appointmentDate)
        );
    }
}
