import { IAppointmentService } from "../../domain/services/IAppointmentService";
import type { Appointment } from "../../domain/models/Appointment";
import { AirtableSDKService } from "../api/airtable-sdk.service";
import store from "../../store";

export class AppointmentService extends IAppointmentService {
    private airtableService: AirtableSDKService;

    constructor() {
        super();
        this.airtableService = new AirtableSDKService();
    }

    async getAll(): Promise<Appointment[]> {
        return this.airtableService.getAllAppointments();
    }


    async getById(id: string): Promise<Appointment | null> {
        const appointments = store.state.appointments;
        return appointments.find((a) => a.id === id) || null;
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

    async getByContactId(contactId: string): Promise<Appointment[]> {
        const appointments = store.state.appointments;
        return appointments.filter((a) => a.contact?.id === contactId);
    }
}
