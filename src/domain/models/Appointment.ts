import type { Contact } from "./Contact";
import type { Agent } from "./Agent";

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
    id: string;
    contact: Contact;
    address: string;
    agents: Agent[];
    appointmentDate: Date;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export const createAppointment = (data: Partial<Appointment>): Appointment => ({
    id: data.id || "",
    contact: data.contact || {} as Contact,
    address: data.address || "",
    agents: data.agents || [],
    appointmentDate: data.appointmentDate || new Date(),
    status: data.status || "upcoming",
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
});

export const getAppointmentStatus = (
    appointment: Appointment,
): AppointmentStatus => {
    if (appointment.status === "cancelled") {
        return "cancelled";
    }
    const now = new Date();
    return appointment.appointmentDate < now ? "completed" : "upcoming";
};
