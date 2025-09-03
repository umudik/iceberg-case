import { IContactService } from "../../domain/services/IContactService";
import type { Contact } from "../../domain/models/Contact";
import { AirtableSDKService } from "../api/airtable-sdk.service";

export class ContactService extends IContactService {
    private airtableService: AirtableSDKService;

    constructor() {
        super();
        this.airtableService = new AirtableSDKService();
    }

    async getAll(): Promise<Contact[]> {
        return this.airtableService.getContacts();
    }

    async getById(id: string): Promise<Contact | null> {
        const contacts = await this.airtableService.getContacts();
        const contact = contacts.find((c) => c.id === id);
        return contact || null;
    }

    async create(contact: Partial<Contact>): Promise<Contact> {
        throw new Error("Not implemented");
    }

    async update(id: string, contact: Partial<Contact>): Promise<Contact> {
        throw new Error("Not implemented");
    }

    async delete(id: string): Promise<boolean> {
        return false;
    }

    async search(query: string): Promise<Contact[]> {
        const contacts = await this.airtableService.getContacts();
        const lowerQuery = query.toLowerCase();
        return contacts.filter(
            (c) =>
                c.firstName.toLowerCase().includes(lowerQuery) ||
                c.lastName.toLowerCase().includes(lowerQuery) ||
                c.email.toLowerCase().includes(lowerQuery) ||
                c.phone.includes(query),
        );
    }
}
