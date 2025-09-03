import type { Contact } from "../models/Contact";

export abstract class IContactService {
    abstract getAll(): Promise<Contact[]>;
    abstract getById(id: string): Promise<Contact | null>;
    abstract create(contact: Partial<Contact>): Promise<Contact | null>;
    abstract update(
        id: string,
        contact: Partial<Contact>,
    ): Promise<Contact | null>;
    abstract delete(id: string): Promise<boolean>;
    abstract search(query: string): Promise<Contact[]>;
}
