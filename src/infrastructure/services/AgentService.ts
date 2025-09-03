import { IAgentService } from "../../domain/services/IAgentService";
import type { Agent } from "../../domain/models/Agent";
import { createAgent } from "../../domain/models/Agent";
import { MockServiceSingleton } from "../api/MockServiceSingleton";

export class AgentService extends IAgentService {
    private mockService;

    constructor() {
        super();
        this.mockService = MockServiceSingleton.getInstance();
    }

    async getAll(): Promise<Agent[]> {
        return this.mockService.getAgents();
    }

    async getById(id: string): Promise<Agent | null> {
        const agents = await this.mockService.getAgents();
        const agent = agents.find((a) => a.id === id);
        return Promise.resolve(agent || null);
    }

    async create(agent: Partial<Agent>): Promise<Agent | null> {
        // Not implemented for mock service
        return Promise.resolve(null);
    }

    async update(id: string, agent: Partial<Agent>): Promise<Agent | null> {
        // Not implemented for mock service
        return Promise.resolve(null);
    }

    async delete(id: string): Promise<boolean> {
        // Not implemented for mock service
        return Promise.resolve(false);
    }
}
