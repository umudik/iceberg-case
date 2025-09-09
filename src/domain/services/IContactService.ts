import type { Contact } from "../../domain/models/Contact";

export abstract class IContactService {
    abstract getAll(): Promise<Contact[]>;
    abstract getById(id: string): Promise<Contact | null>;
    abstract search(query: string): Promise<Contact[]>;
}
