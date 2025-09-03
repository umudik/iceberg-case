import type { Contact } from "@/domain/models/Contact";
import type { Agent } from "@/domain/models/Agent";
import type { Appointment } from "@/domain/models/Appointment";
import { createContact } from "@/domain/models/Contact";
import { createAgent } from "@/domain/models/Agent";
import { createAppointment } from "@/domain/models/Appointment";

export class MockService {
    // Helper arrays for generating random data
    private firstNames = [
        "John",
        "Jane",
        "Bob",
        "Alice",
        "Charlie",
        "Emma",
        "Oliver",
        "Sophia",
        "William",
        "Isabella",
        "James",
        "Mia",
        "Benjamin",
        "Charlotte",
        "Lucas",
        "Amelia",
        "Henry",
        "Harper",
        "Alexander",
        "Evelyn",
    ];
    private lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
    ];
    private streetNames = [
        "Main St",
        "Oak Ave",
        "Pine Rd",
        "Elm St",
        "Maple Dr",
        "Cedar Ln",
        "Birch Blvd",
        "Spruce St",
        "Willow Way",
        "Ash Ave",
        "Poplar Pl",
        "Sycamore St",
        "Park Ave",
        "Broadway",
        "5th Ave",
        "Madison Ave",
        "Lexington Ave",
        "Columbus Ave",
        "Amsterdam Ave",
        "West End Ave",
    ];
    private cities = [
        "New York",
        "Brooklyn",
        "Queens",
        "Bronx",
        "Staten Island",
        "Manhattan",
        "Long Island",
        "Yonkers",
        "White Plains",
        "New Rochelle",
    ];

    private contacts: Contact[] = [
        createContact({
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1234567890",
        }),
        createContact({
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "+1234567891",
        }),
        createContact({
            id: "3",
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com",
            phone: "+1234567892",
        }),
        createContact({
            id: "4",
            firstName: "Alice",
            lastName: "Williams",
            email: "alice.williams@example.com",
            phone: "+1234567893",
        }),
        createContact({
            id: "5",
            firstName: "Charlie",
            lastName: "Brown",
            email: "charlie.brown@example.com",
            phone: "+1234567894",
        }),
    ];

    private agents: Agent[] = [
        createAgent({
            id: "1",
            name: "Agent Smith",
            email: "smith@agency.com",
            phone: "+1234567895",
            themeColor: "#3F51B5",
        }),
        createAgent({
            id: "2",
            name: "Agent Johnson",
            email: "johnson@agency.com",
            phone: "+1234567896",
            themeColor: "#4CAF50",
        }),
        createAgent({
            id: "3",
            name: "Agent Williams",
            email: "williams@agency.com",
            phone: "+1234567897",
            themeColor: "#FF9800",
        }),
        createAgent({
            id: "4",
            name: "Agent Brown",
            email: "brown@agency.com",
            phone: "+1234567898",
            themeColor: "#9C27B0",
        }),
    ];

    private appointments: Appointment[] = [
        createAppointment({
            id: "1",
            contact: this.contacts[0],
            address: "123 Main St, New York, NY 10001",
            agents: [this.agents[0], this.agents[1]],
            appointmentDate: new Date(Date.now() + 86400000 * 2),
            status: "upcoming",
        }),
        createAppointment({
            id: "2",
            contact: this.contacts[1],
            address: "456 Oak Ave, Brooklyn, NY 11201",
            agents: [this.agents[1]],
            appointmentDate: new Date(Date.now() - 86400000 * 5),
            status: "completed",
        }),
        createAppointment({
            id: "3",
            contact: this.contacts[2],
            address: "789 Pine Rd, Queens, NY 11101",
            agents: [this.agents[2], this.agents[3]],
            appointmentDate: new Date(Date.now() + 86400000 * 7),
            status: "upcoming",
        }),
        createAppointment({
            id: "4",
            contact: this.contacts[0],
            address: "321 Elm St, Bronx, NY 10451",
            agents: [this.agents[0]],
            appointmentDate: new Date(Date.now() + 86400000 * 10),
            status: "cancelled",
        }),
        createAppointment({
            id: "5",
            contact: this.contacts[3],
            address: "654 Maple Dr, Staten Island, NY 10301",
            agents: [this.agents[3]],
            appointmentDate: new Date(Date.now() - 86400000 * 2),
            status: "completed",
        }),
        createAppointment({
            id: "6",
            contact: this.contacts[4],
            address: "987 Cedar Ln, Manhattan, NY 10002",
            agents: [this.agents[1], this.agents[2]],
            appointmentDate: new Date(Date.now() + 86400000 * 5),
            status: "upcoming",
        }),
        createAppointment({
            id: "7",
            contact: this.contacts[1],
            address: "147 Birch Blvd, Brooklyn, NY 11202",
            agents: [this.agents[0]],
            appointmentDate: new Date(Date.now() - 86400000 * 10),
            status: "completed",
        }),
        createAppointment({
            id: "8",
            contact: this.contacts[2],
            address: "258 Spruce St, Queens, NY 11102",
            agents: [this.agents[2]],
            appointmentDate: new Date(Date.now() + 86400000 * 15),
            status: "upcoming",
        }),
        createAppointment({
            id: "9",
            contact: this.contacts[3],
            address: "369 Willow Way, Bronx, NY 10452",
            agents: [this.agents[3], this.agents[0]],
            appointmentDate: new Date(Date.now() - 86400000 * 7),
            status: "cancelled",
        }),
        createAppointment({
            id: "10",
            contact: this.contacts[4],
            address: "741 Ash Ave, Staten Island, NY 10302",
            agents: [this.agents[1]],
            appointmentDate: new Date(Date.now() + 86400000 * 3),
            status: "upcoming",
        }),
        createAppointment({
            id: "11",
            contact: this.contacts[0],
            address: "852 Poplar Pl, Manhattan, NY 10003",
            agents: [this.agents[2], this.agents[3]],
            appointmentDate: new Date(Date.now() - 86400000 * 15),
            status: "completed",
        }),
        createAppointment({
            id: "12",
            contact: this.contacts[1],
            address: "963 Sycamore St, Brooklyn, NY 11203",
            agents: [this.agents[0]],
            appointmentDate: new Date(Date.now() + 86400000 * 20),
            status: "upcoming",
        }),
    ];

    constructor() {
        // Generate additional random appointments
        this.generateRandomAppointments();
    }

    private generateRandomAppointments(): void {
        // Keep existing appointments and add random ones
        const existingCount = this.appointments.length;
        const targetCount = 100;

        for (let i = existingCount + 1; i <= targetCount; i++) {
            // Generate random contact
            const firstName = this.firstNames[
                Math.floor(Math.random() * this.firstNames.length)
            ];
            const lastName = this.lastNames[
                Math.floor(Math.random() * this.lastNames.length)
            ];
            const randomContact = createContact({
                id: `contact-${i}`,
                firstName,
                lastName,
                email:
                    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                phone: `+1${
                    Math.floor(Math.random() * 9000000000 + 1000000000)
                }`,
            });

            // Generate random address
            const streetNumber = Math.floor(Math.random() * 9999) + 1;
            const streetName = this.streetNames[
                Math.floor(Math.random() * this.streetNames.length)
            ];
            const city =
                this.cities[Math.floor(Math.random() * this.cities.length)];
            const zipCode = Math.floor(Math.random() * 90000) + 10000;
            const address =
                `${streetNumber} ${streetName}, ${city}, NY ${zipCode}`;

            // Select random agents (1-3 agents)
            const agentCount = Math.floor(Math.random() * 3) + 1;
            const selectedAgents: Agent[] = [];
            const agentIndices = new Set<number>();
            while (
                agentIndices.size < agentCount &&
                agentIndices.size < this.agents.length
            ) {
                agentIndices.add(
                    Math.floor(Math.random() * this.agents.length),
                );
            }
            agentIndices.forEach((index) =>
                selectedAgents.push(this.agents[index])
            );

            // Generate random date (between -30 and +30 days from now)
            const daysOffset = Math.floor(Math.random() * 61) - 30;
            const appointmentDate = new Date(
                Date.now() + (86400000 * daysOffset),
            );

            // Determine status based on date
            let status: "upcoming" | "completed" | "cancelled";
            if (daysOffset > 0) {
                // Future appointments: 80% upcoming, 20% cancelled
                status = Math.random() < 0.8 ? "upcoming" : "cancelled";
            } else {
                // Past appointments: 70% completed, 30% cancelled
                status = Math.random() < 0.7 ? "completed" : "cancelled";
            }

            const appointment = createAppointment({
                id: String(i),
                contact: randomContact,
                address,
                agents: selectedAgents,
                appointmentDate,
                status,
            });

            this.appointments.push(appointment);
        }
    }

    async getContacts(): Promise<Contact[]> {
        return Promise.resolve([...this.contacts]);
    }

    async getAgents(): Promise<Agent[]> {
        return Promise.resolve([...this.agents]);
    }

    async getAppointments(): Promise<Appointment[]> {
        return Promise.resolve([...this.appointments]);
    }

    async createAppointment(
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        const newAppointment = createAppointment({
            ...appointment,
            id: String(this.appointments.length + 1),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        this.appointments.push(newAppointment);
        return Promise.resolve(newAppointment);
    }

    async updateAppointment(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        const index = this.appointments.findIndex((a) => a.id === id);
        if (index === -1) return Promise.resolve(null);

        this.appointments[index] = {
            ...this.appointments[index],
            ...appointment,
            updatedAt: new Date(),
        };
        return Promise.resolve(this.appointments[index]);
    }

    async getRelatedAppointments(contactId: string): Promise<Appointment[]> {
        return Promise.resolve(
            this.appointments.filter((a) => a.contact.id === contactId),
        );
    }
}
