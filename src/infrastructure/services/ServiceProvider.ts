import { IContactService } from "../../domain/services/IContactService";
import { IAgentService } from "../../domain/services/IAgentService";
import { IAppointmentService } from "../../domain/services/IAppointmentService";
import { ContactService } from "./ContactService";
import { AgentService } from "./AgentService";
import { AppointmentService } from "./AppointmentService";

export class ServiceProvider {
    private static instance: ServiceProvider;

    private contactService: IContactService;
    private agentService: IAgentService;
    private appointmentService: IAppointmentService;

    private constructor() {
        this.contactService = new ContactService();
        this.agentService = new AgentService();
        this.appointmentService = new AppointmentService();
    }

    public static getInstance(): ServiceProvider {
        if (!ServiceProvider.instance) {
            ServiceProvider.instance = new ServiceProvider();
        }
        return ServiceProvider.instance;
    }

    public getContactService(): IContactService {
        return this.contactService;
    }

    public getAgentService(): IAgentService {
        return this.agentService;
    }

    public getAppointmentService(): IAppointmentService {
        return this.appointmentService;
    }
}
