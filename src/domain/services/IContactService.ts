import type { Contact } from "../../domain/models/Contact";

export abstract class IContactService {
    abstract getAll(): Promise<Contact[]>;
    abstract getById(id: string): Promise<Contact | null>;
    abstract create(contact: Partial<Contact>): Promise<Contact>;
    abstract update(id: string, contact: Partial<Contact>): Promise<Contact>;
    abstract delete(id: string): Promise<boolean>;
    abstract search(query: string): Promise<Contact[]>;
}
