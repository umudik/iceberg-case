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

    static filterAppointments(
        appointments: Appointment[],
        filters: {
            status?: "all" | AppointmentStatus;
            selectedAgents?: string[];
            searchQuery?: string;
            dateRange?: {
                start: Date | null;
                end: Date | null;
            };
        }
    ): Appointment[] {
        let filtered = [...appointments];

        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter(appointment => {
                const appointmentStatus = this.getStatus(appointment);
                return appointmentStatus === filters.status;
            });
        }

        if (filters.selectedAgents && filters.selectedAgents.length > 0) {
            filtered = filtered.filter(appointment =>
                appointment.agents.some(agent =>
                    filters.selectedAgents!.includes(agent.id)
                )
            );
        }

        if (filters.searchQuery && filters.searchQuery.trim()) {
            const searchTerm = filters.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(appointment => {
                const address = appointment.address?.toLowerCase() || "";
                const contactName = `${appointment.contact.firstName} ${appointment.contact.lastName}`.toLowerCase();
                const contactEmail = appointment.contact.email?.toLowerCase() || "";
                const contactPhone = appointment.contact.phone?.toLowerCase() || "";

                return address.includes(searchTerm) ||
                       contactName.includes(searchTerm) ||
                       contactEmail.includes(searchTerm) ||
                       contactPhone.includes(searchTerm);
            });
        }

        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            
            if (start) {
                const startDate = new Date(start);
                startDate.setHours(0, 0, 0, 0);
                filtered = filtered.filter(appointment => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    appointmentDate.setHours(0, 0, 0, 0);
                    return appointmentDate >= startDate;
                });
            }

            if (end) {
                const endDate = new Date(end);
                endDate.setHours(23, 59, 59, 999);
                filtered = filtered.filter(appointment => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    return appointmentDate <= endDate;
                });
            }
        }

        return filtered.sort((a, b) => 
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
    }

    static paginateAppointments(
        appointments: Appointment[],
        currentPage: number,
        itemsPerPage: number
    ): {
        appointments: Appointment[];
        totalPages: number;
        totalCount: number;
        hasMore: boolean;
    } {
        const totalCount = appointments.length;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedAppointments = appointments.slice(startIndex, endIndex);

        return {
            appointments: paginatedAppointments,
            totalPages,
            totalCount,
            hasMore: currentPage < totalPages
        };
    }
}
