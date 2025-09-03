import { IAppointmentService } from "../../domain/services/IAppointmentService";
import { IAgentService } from "../../domain/services/IAgentService";
import { IContactService } from "../../domain/services/IContactService";
import { AppointmentService } from "../services/AppointmentService";
import { AgentService } from "../services/AgentService";
import { ContactService } from "../services/ContactService";

export class ServiceContainer {
    private static instance: ServiceContainer;

    private appointmentService: IAppointmentService | null = null;
    private agentService: IAgentService | null = null;
    private contactService: IContactService | null = null;

    private constructor() {}

    public static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
    }

    public getAppointmentService(): IAppointmentService {
        if (!this.appointmentService) {
            this.appointmentService = new AppointmentService();
        }
        return this.appointmentService;
    }

    public getAgentService(): IAgentService {
        if (!this.agentService) {
            this.agentService = new AgentService();
        }
        return this.agentService;
    }

    public getContactService(): IContactService {
        if (!this.contactService) {
            this.contactService = new ContactService();
        }
        return this.contactService;
    }

    public setAppointmentService(service: IAppointmentService): void {
        this.appointmentService = service;
    }

    public setAgentService(service: IAgentService): void {
        this.agentService = service;
    }

    public setContactService(service: IContactService): void {
        this.contactService = service;
    }

    public reset(): void {
        this.appointmentService = null;
        this.agentService = null;
        this.contactService = null;
    }
}
