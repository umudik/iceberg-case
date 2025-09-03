import { IAppointmentService } from "../../domain/services/IAppointmentService";
import type { Appointment } from "../../domain/models/Appointment";
import { createAppointment } from "../../domain/models/Appointment";
import { MockService } from "../api/mock.service";
import { MockServiceSingleton } from "../api/MockServiceSingleton";

export class AppointmentService extends IAppointmentService {
    private mockService: MockService;

    constructor() {
        super();
        this.mockService = MockServiceSingleton.getInstance();
    }

    async getAll(): Promise<Appointment[]> {
        return this.mockService.getAppointments();
    }

    async getById(id: string): Promise<Appointment | null> {
        const appointments = await this.mockService.getAppointments();
        const appointment = appointments.find((a) => a.id === id);
        return Promise.resolve(appointment || null);
    }

    async create(
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        return this.mockService.createAppointment(appointment);
    }

    async update(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        return this.mockService.updateAppointment(id, appointment);
    }

    async delete(id: string): Promise<boolean> {
        // MockService doesn't have delete, so we'll return false for now
        return Promise.resolve(false);
    }

    async getByContactId(contactId: string): Promise<Appointment[]> {
        return this.mockService.getRelatedAppointments(contactId);
    }

    async getByAgentId(agentId: string): Promise<Appointment[]> {
        const appointments = await this.mockService.getAppointments();
        return Promise.resolve(
            appointments.filter((a) =>
                a.agents.some((agent) => agent.id === agentId)
            ),
        );
    }

    async getByDateRange(
        startDate: Date,
        endDate: Date,
    ): Promise<Appointment[]> {
        const appointments = await this.mockService.getAppointments();
        return Promise.resolve(
            appointments.filter((a) =>
                a.appointmentDate >= startDate && a.appointmentDate <= endDate
            ),
        );
    }
}
