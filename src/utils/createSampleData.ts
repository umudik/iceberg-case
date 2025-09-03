import { AirtableSDKService } from "@/infrastructure/api/airtable-sdk.service";
import { createContact } from "@/domain/models/Contact";
import { createAgent } from "@/domain/models/Agent";

export async function createSampleData() {
    const service = new AirtableSDKService();

    // Check if we already have data
    const existingContacts = await service.getContacts();
    if (existingContacts.length > 0) {
        console.log("Sample data already exists");
        return;
    }

    console.log("Creating sample data in Airtable...");

    // Sample contacts
    const sampleContacts = [
        {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "+1234567890",
        },
        {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            phone: "+1234567891",
        },
        {
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob@example.com",
            phone: "+1234567892",
        },
    ];

    // Sample agents (already have 5)
    const agents = await service.getAgents();
    console.log(`Found ${agents.length} agents`);

    // Create sample appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const sampleAppointments = [
        {
            contact: createContact(sampleContacts[0]),
            address: "123 Main St, New York, NY 10001",
            agents: agents.slice(0, 1),
            appointmentDate: today,
            status: "upcoming" as const,
        },
        {
            contact: createContact(sampleContacts[1]),
            address: "456 Oak Ave, Los Angeles, CA 90001",
            agents: agents.slice(1, 2),
            appointmentDate: tomorrow,
            status: "upcoming" as const,
        },
        {
            contact: createContact(sampleContacts[2]),
            address: "789 Pine Rd, Chicago, IL 60601",
            agents: agents.slice(2, 3),
            appointmentDate: nextWeek,
            status: "completed" as const,
        },
    ];

    // Create appointments
    for (const appointment of sampleAppointments) {
        try {
            const created = await service.createAppointment(appointment);
            if (created) {
                console.log(
                    `Created appointment for ${appointment.contact?.firstName}`,
                );
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
        }
    }

    console.log("Sample data creation completed!");
}
