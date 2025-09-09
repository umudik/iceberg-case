import { IAgentService } from "../../domain/services/IAgentService";
import type { Agent } from "../../domain/models/Agent";
import { AirtableSDKService } from "../api/airtable-sdk.service";

export class AgentService extends IAgentService {
    private airtableService: AirtableSDKService;

    constructor() {
        super();
        this.airtableService = new AirtableSDKService();
    }

    async getAll(): Promise<Agent[]> {
        return this.airtableService.getAgents();
    }

    async getById(id: string): Promise<Agent | null> {
        const agents = await this.airtableService.getAgents();
        const agent = agents.find((a) => a.id === id);
        return agent || null;
    }

}
