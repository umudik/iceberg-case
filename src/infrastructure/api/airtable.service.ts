import axios from "axios";
import { API_CONFIG, getAirtableHeaders } from "./config";
import type { Contact } from "@/domain/models/Contact";
import type { Agent } from "@/domain/models/Agent";
import type { Appointment } from "@/domain/models/Appointment";
import { createContact } from "@/domain/models/Contact";
import { createAgent } from "@/domain/models/Agent";
import { createAppointment } from "@/domain/models/Appointment";

const api = axios.create({
    baseURL: `${API_CONFIG.AIRTABLE_BASE_URL}/${API_CONFIG.AIRTABLE_BASE_ID}`,
    headers: getAirtableHeaders(),
});

export class AirtableService {
    async getContacts(): Promise<Contact[]> {
        try {
            const response = await api.get(
                `/${API_CONFIG.AIRTABLE_CONTACTS_TABLE}`,
            );
            return response.data.records.map((record: any) =>
                createContact({
                    id: record.id,
                    firstName: record.fields.firstName,
                    lastName: record.fields.lastName,
                    email: record.fields.email,
                    phone: record.fields.phone,
                })
            );
        } catch (error) {
            console.error("Error fetching contacts:", error);
            return [];
        }
    }

    async getAgents(): Promise<Agent[]> {
        try {
            const response = await api.get(
                `/${API_CONFIG.AIRTABLE_AGENTS_TABLE}`,
            );
            return response.data.records.map((record: any) =>
                createAgent({
                    id: record.id,
                    name: record.fields.name,
                    email: record.fields.email,
                    phone: record.fields.phone,
                    themeColor: record.fields.themeColor,
                })
            );
        } catch (error) {
            console.error("Error fetching agents:", error);
            return [];
        }
    }

    async getAppointments(): Promise<Appointment[]> {
        try {
            const response = await api.get(
                `/${API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE}`,
            );
            const contacts = await this.getContacts();
            const agents = await this.getAgents();

            return response.data.records.map((record: any) => {
                const contactId = record.fields.contactId?.[0];
                const agentIds = record.fields.agentIds || [];

                return createAppointment({
                    id: record.id,
                    contact: contacts.find((c) => c.id === contactId) ||
                        createContact({}),
                    address: record.fields.address,
                    agents: agents.filter((a) => agentIds.includes(a.id)),
                    appointmentDate: new Date(record.fields.appointmentDate),
                    status: record.fields.status,
                    createdAt: new Date(record.createdTime),
                    updatedAt: new Date(
                        record.fields.updatedAt || record.createdTime,
                    ),
                });
            });
        } catch (error) {
            console.error("Error fetching appointments:", error);
            return [];
        }
    }

    async createAppointment(
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        try {
            const response = await api.post(
                `/${API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE}`,
                {
                    fields: {
                        contactId: [appointment.contact?.id],
                        address: appointment.address,
                        agentIds: appointment.agents?.map((a) => a.id),
                        appointmentDate: appointment.appointmentDate
                            ?.toISOString(),
                        status: appointment.status || "upcoming",
                    },
                },
            );

            return createAppointment({
                id: response.data.id,
                ...appointment,
            });
        } catch (error) {
            console.error("Error creating appointment:", error);
            return null;
        }
    }

    async updateAppointment(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        try {
            const response = await api.patch(
                `/${API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE}/${id}`,
                {
                    fields: {
                        contactId: appointment.contact
                            ? [appointment.contact.id]
                            : undefined,
                        address: appointment.address,
                        agentIds: appointment.agents?.map((a) => a.id),
                        appointmentDate: appointment.appointmentDate
                            ?.toISOString(),
                        status: appointment.status,
                    },
                },
            );

            return createAppointment({
                id: response.data.id,
                ...appointment,
            });
        } catch (error) {
            console.error("Error updating appointment:", error);
            return null;
        }
    }
}
