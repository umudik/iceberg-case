import type { Appointment, AppointmentStatus } from "../models/Appointment";

export class AppointmentUseCases {
    static getStatus(appointment: Appointment): AppointmentStatus {
        if (appointment.status === "cancelled") {
            return "cancelled";
        }
        const now = new Date();
        return appointment.appointmentDate < now ? "completed" : "upcoming";
    }

    static getDaysUntil(appointment: Appointment): number {
        const now = new Date();
        const appointmentDate = new Date(appointment.appointmentDate);
        const diffTime = appointmentDate.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static getStatusLabel(appointment: Appointment): string {
        const status = this.getStatus(appointment);

        if (status === "upcoming") {
            const daysUntil = this.getDaysUntil(appointment);

            if (daysUntil === 0) {
                return "Upcoming Today";
            } else if (daysUntil === 1) {
                return "Upcoming Tomorrow";
            } else if (daysUntil > 0) {
                return `Upcoming ${daysUntil} days`;
            }
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    static getStatusColor(appointment: Appointment): string {
        const status = this.getStatus(appointment);
        switch (status) {
            case "upcoming":
                return "green";
            case "completed":
                return "grey";
            case "cancelled":
                return "pink";
            default:
                return "grey";
        }
    }

    static getStatusIcon(appointment: Appointment): string {
        const status = this.getStatus(appointment);
        switch (status) {
            case "upcoming":
                return "mdi-clock-outline";
            case "completed":
                return "mdi-check-circle-outline";
            case "cancelled":
                return "mdi-close-circle-outline";
            default:
                return "mdi-help-circle-outline";
        }
    }
}
