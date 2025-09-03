import Airtable from "airtable";
import type { FieldSet, Record } from "airtable";
import { API_CONFIG } from "./config";
import type { Contact } from "@/domain/models/Contact";
import type { Agent } from "@/domain/models/Agent";
import type { Appointment } from "@/domain/models/Appointment";
import { createContact } from "@/domain/models/Contact";
import { createAgent } from "@/domain/models/Agent";
import { createAppointment } from "@/domain/models/Appointment";

let base: ReturnType<typeof Airtable.base> | null = null;

const initializeAirtable = () => {
    if (!API_CONFIG.AIRTABLE_API_KEY) {
        console.error("AIRTABLE_API_KEY is not set in .env file!");
        return null;
    }

    if (!API_CONFIG.AIRTABLE_BASE_ID) {
        console.error("AIRTABLE_BASE_ID is not set in .env file!");
        return null;
    }

    if (!base) {
        Airtable.configure({
            apiKey: API_CONFIG.AIRTABLE_API_KEY,
        });
        base = Airtable.base(API_CONFIG.AIRTABLE_BASE_ID);
    }
    return base;
};

export class AirtableSDKService {
    private base: ReturnType<typeof Airtable.base> | null;

    constructor() {
        this.base = initializeAirtable();
    }

    async getContacts(): Promise<Contact[]> {
        if (!this.base) return [];

        try {
            const records: Contact[] = [];
            await this.base(API_CONFIG.AIRTABLE_CONTACTS_TABLE)
                .select()
                .eachPage((pageRecords, fetchNextPage) => {
                    pageRecords.forEach((record) => {
                        records.push(
                            createContact({
                                id: record.id,
                                firstName: record.get("firstName") as string ||
                                    "",
                                lastName: record.get("lastName") as string ||
                                    "",
                                email: record.get("email") as string || "",
                                phone: record.get("phone") as string || "",
                            }),
                        );
                    });
                    fetchNextPage();
                });
            console.log(`Fetched ${records.length} contacts`);
            return records;
        } catch (error: any) {
            console.error("Error fetching contacts:", error.message);
            return [];
        }
    }

    async getAgents(): Promise<Agent[]> {
        if (!this.base) return [];

        try {
            const records: Agent[] = [];
            await this.base(API_CONFIG.AIRTABLE_AGENTS_TABLE)
                .select()
                .eachPage((pageRecords, fetchNextPage) => {
                    pageRecords.forEach((record) => {
                        records.push(
                            createAgent({
                                id: record.id,
                                name: record.get("name") as string || "",
                                email: record.get("email") as string || "",
                                phone: record.get("phone") as string || "",
                                themeColor:
                                    record.get("themeColor") as string ||
                                    "#000000",
                            }),
                        );
                    });
                    fetchNextPage();
                });
            console.log(`Fetched ${records.length} agents`);
            return records;
        } catch (error: any) {
            console.error("Error fetching agents:", error.message);
            return [];
        }
    }

    async getAppointments(options?: {
        pageSize?: number;
        page?: number;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        searchQuery?: string;
        agentIds?: string[];
        sort?: { field: string; direction: "asc" | "desc" }[];
    }): Promise<{
        appointments: Appointment[];
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
        totalCount: number;
    }> {
        console.log(
            "🔍 AirtableSDKService.getAppointments called with:",
            options,
        );

        if (!this.base) {
            console.error("❌ Airtable base not initialized!");
            return {
                appointments: [],
                hasMore: false,
                totalPages: 0,
                currentPage: 1,
                totalCount: 0,
            };
        }

        try {
            console.log("📞 Fetching contacts and agents...");
            const [contacts, agents] = await Promise.all([
                this.getContacts(),
                this.getAgents(),
            ]);
            console.log(
                `✅ Fetched ${contacts.length} contacts, ${agents.length} agents`,
            );

            const appointments: Appointment[] = [];
            const pageSize = options?.pageSize || 10;
            const currentPage = options?.page || 1;

            const filters: string[] = [];

            if (options?.status && options.status !== "all") {
                filters.push(`{status} = '${options.status}'`);
                console.log(`🔍 Added status filter: ${options.status}`);
            } else {
                console.log(`🔍 No status filter (status: ${options?.status})`);
            }

            if (options?.startDate) {
                const startDateStr =
                    options.startDate.toISOString().split("T")[0];
                filters.push(`{date} >= '${startDateStr}'`);
            }

            if (options?.endDate) {
                const endDateStr = options.endDate.toISOString().split("T")[0];
                filters.push(`{date} <= '${endDateStr}'`);
            }

            const filterFormula = filters.length > 0
                ? `AND(${filters.join(", ")})`
                : "";

            console.log("🔧 Filter formula:", filterFormula || "No filters");

            const sort = options?.sort ||
                [{ field: "date", direction: "desc" as const }];

            let totalFilteredRecords = 0;
            const allRecords: any[] = [];

            console.log("📋 Fetching appointments from Airtable...");
            await this.base(API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE)
                .select({
                    ...(filterFormula && { filterByFormula: filterFormula }),
                    sort,
                    pageSize: 100, // Get records in batches
                })
                .eachPage((records, fetchNextPage) => {
                    console.log(
                        `📄 Fetched page with ${records.length} records`,
                    );
                    allRecords.push(...records);
                    totalFilteredRecords = allRecords.length;

                    fetchNextPage();
                });

            const totalPages = Math.ceil(totalFilteredRecords / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const pageRecords = allRecords.slice(startIndex, endIndex);

            console.log(
                `📊 Filtered records: ${totalFilteredRecords}, Page ${currentPage}/${totalPages}`,
            );
            console.log(
                `📋 Processing ${pageRecords.length} records for current page`,
            );

            pageRecords.forEach((record, index) => {
                console.log(
                    `🔄 Processing record ${index + 1}/${pageRecords.length}:`,
                    record.id,
                );
                const contactIds = record.get("contact") as
                    | string[]
                    | undefined;
                const agentIds = record.get("agents") as
                    | string[]
                    | undefined;
                const appointmentDate = record.get("date") as
                    | string
                    | undefined;

                const matchedContact = contactIds?.[0]
                    ? contacts.find((c) => c.id === contactIds[0])
                    : null;

                const matchedAgents = agentIds
                    ? agents.filter((a) => agentIds.includes(a.id))
                    : [];

                const appointment = createAppointment({
                    id: record.id,
                    contact: matchedContact || createContact({
                        id: contactIds?.[0] || "",
                        firstName: "Unknown",
                        lastName: "Contact",
                        email: "",
                        phone: "",
                    }),
                    address: record.get("address") as string || "",
                    agents: matchedAgents,
                    appointmentDate: appointmentDate
                        ? new Date(appointmentDate)
                        : new Date(),
                    status: (record.get("status") as
                        | "upcoming"
                        | "completed"
                        | "cancelled") || "upcoming",
                    createdAt: new Date(
                        record.get("Created At") as string ||
                            record._rawJson.createdTime,
                    ),
                    updatedAt: new Date(
                        record.get("Updated At") as string ||
                            record._rawJson.createdTime,
                    ),
                });

                console.log(
                    `✅ Created appointment:`,
                    appointment.id,
                    appointment.contact.fullName,
                    `Status: ${appointment.status}`,
                    `Date: ${appointment.appointmentDate}`,
                );
                appointments.push(appointment);
            });

            console.log(
                `Fetched ${appointments.length} of ${totalFilteredRecords} filtered appointments (page ${currentPage} of ${totalPages})`,
            );

            const hasMore = currentPage < totalPages;

            return {
                appointments,
                totalPages,
                currentPage,
                hasMore,
                totalCount: totalFilteredRecords,
            };
        } catch (error: any) {
            console.error("Error fetching appointments:", error.message);
            return {
                appointments: [],
                hasMore: false,
                totalPages: 0,
                currentPage: 1,
                totalCount: 0,
            };
        }
    }

    async getAllAppointments(): Promise<Appointment[]> {
        const allAppointments: Appointment[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const result = await this.getAppointments({
                pageSize: 100,
                page,
            });
            allAppointments.push(...result.appointments);
            hasMore = result.hasMore;
            page++;
        }

        return allAppointments;
    }

    async createAppointment(
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        if (!this.base) return null;

        try {
            const record = await this.base(
                API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE,
            ).create({
                contact: appointment.contact?.id
                    ? [appointment.contact.id]
                    : [],
                address: appointment.address || "",
                agents: appointment.agents?.map((a) => a.id) || [],
                date:
                    appointment.appointmentDate?.toISOString().split("T")[0] ||
                    new Date().toISOString().split("T")[0],
                status: appointment.status || "upcoming",
            });

            return createAppointment({
                id: record.id,
                ...appointment,
                createdAt: new Date(record._rawJson.createdTime),
                updatedAt: new Date(record._rawJson.createdTime),
            });
        } catch (error: any) {
            console.error("Error creating appointment:", error.message);
            return null;
        }
    }

    async updateAppointment(
        id: string,
        appointment: Partial<Appointment>,
    ): Promise<Appointment | null> {
        if (!this.base) return null;

        try {
            const updates: any = {};
            if (appointment.contact) {
                updates.contact = [appointment.contact.id];
            }
            if (appointment.address !== undefined) {
                updates.address = appointment.address;
            }
            if (appointment.agents) {
                updates.agents = appointment.agents.map((a) => a.id);
            }
            if (appointment.appointmentDate) {
                updates.date = appointment.appointmentDate
                    .toISOString().split("T")[0];
            }
            if (appointment.status) {
                updates.status = appointment.status;
            }

            const record = await this.base(
                API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE,
            ).update(id, updates);

            return createAppointment({
                ...appointment,
                id: record.id,
                createdAt: new Date(record._rawJson.createdTime),
                updatedAt: new Date(updates["Updated At"]),
            });
        } catch (error: any) {
            console.error("Error updating appointment:", error.message);
            return null;
        }
    }

    async deleteAppointment(id: string): Promise<boolean> {
        if (!this.base) return false;

        try {
            await this.base(API_CONFIG.AIRTABLE_APPOINTMENTS_TABLE).destroy(
                id,
            );
            return true;
        } catch (error: any) {
            console.error("Error deleting appointment:", error.message);
            return false;
        }
    }
}
