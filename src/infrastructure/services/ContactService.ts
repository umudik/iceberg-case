import { IContactService } from "../../domain/services/IContactService";
import type { Contact } from "../../domain/models/Contact";
import { createContact } from "../../domain/models/Contact";

export class ContactService extends IContactService {
    private contacts: Contact[] = [
        createContact({
            id: "1",
            firstName: "Emma",
            lastName: "Smith",
            email: "emma@example.com",
            phone: "+44 7710 981654",
        }),
        createContact({
            id: "2",
            firstName: "Emily",
            lastName: "Johnson",
            email: "emily.johnson@example.com",
            phone: "+44 7912 345678",
        }),
        createContact({
            id: "3",
            firstName: "David",
            lastName: "Smith",
            email: "david.smith@example.com",
            phone: "+44 7520 981654",
        }),
        createContact({
            id: "4",
            firstName: "Sarah",
            lastName: "Brown",
            email: "sarah.brown@example.com",
            phone: "+44 7768 123456",
        }),
        createContact({
            id: "5",
            firstName: "Jennifer",
            lastName: "Martinez",
            email: "jennifer.martinez@example.com",
            phone: "+44 7889 012345",
        }),
        createContact({
            id: "6",
            firstName: "Elizabeth",
            lastName: "Johnson",
            email: "elizabeth.johnson@example.com",
            phone: "+44 7878 987654",
        }),
    ];

    async getAll(): Promise<Contact[]> {
        return Promise.resolve([...this.contacts]);
    }

    async getById(id: string): Promise<Contact | null> {
        const contact = this.contacts.find((c) => c.id === id);
        return Promise.resolve(contact || null);
    }

    async create(contact: Partial<Contact>): Promise<Contact | null> {
        const newContact = createContact({
            ...contact,
            id: String(this.contacts.length + 1),
        });
        this.contacts.push(newContact);
        return Promise.resolve(newContact);
    }

    async update(
        id: string,
        contact: Partial<Contact>,
    ): Promise<Contact | null> {
        const index = this.contacts.findIndex((c) => c.id === id);
        if (index === -1) return Promise.resolve(null);

        this.contacts[index] = createContact({
            ...this.contacts[index],
            ...contact,
            id,
        });
        return Promise.resolve(this.contacts[index]);
    }

    async delete(id: string): Promise<boolean> {
        const index = this.contacts.findIndex((c) => c.id === id);
        if (index === -1) return Promise.resolve(false);

        this.contacts.splice(index, 1);
        return Promise.resolve(true);
    }

    async search(query: string): Promise<Contact[]> {
        const lowerQuery = query.toLowerCase();
        return Promise.resolve(
            this.contacts.filter((c) =>
                c.firstName.toLowerCase().includes(lowerQuery) ||
                c.lastName.toLowerCase().includes(lowerQuery) ||
                c.email.toLowerCase().includes(lowerQuery) ||
                c.phone.includes(query)
            ),
        );
    }
}
