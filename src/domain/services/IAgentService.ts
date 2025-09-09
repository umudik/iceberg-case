import type { Agent } from "../../domain/models/Agent";

export abstract class IAgentService {
    abstract getAll(): Promise<Agent[]>;
    abstract getById(id: string): Promise<Agent | null>;
}
