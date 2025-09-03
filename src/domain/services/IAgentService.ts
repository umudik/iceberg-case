import type { Agent } from "../models/Agent";

export abstract class IAgentService {
    abstract getAll(): Promise<Agent[]>;
    abstract getById(id: string): Promise<Agent | null>;
    abstract create(agent: Partial<Agent>): Promise<Agent | null>;
    abstract update(id: string, agent: Partial<Agent>): Promise<Agent | null>;
    abstract delete(id: string): Promise<boolean>;
}
