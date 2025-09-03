import { type ActionContext, createStore, Store } from "vuex";
import type { Contact } from "../domain/models/Contact";
import type { Agent } from "../domain/models/Agent";
import type {
    Appointment,
    AppointmentStatus,
} from "../domain/models/Appointment";
import { ServiceProvider } from "../infrastructure/services/ServiceProvider";
import { getAppointmentStatus } from "../domain/models/Appointment";

const serviceProvider = ServiceProvider.getInstance();
const contactService = serviceProvider.getContactService();
const agentService = serviceProvider.getAgentService();
const appointmentService = serviceProvider.getAppointmentService();

export interface FilterState {
    status: "all" | AppointmentStatus;
    selectedAgents: string[];
    searchQuery: string;
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
}

export interface State {
    appointments: Appointment[];
    agents: Agent[];
    contacts: Contact[];
    filters: FilterState;
    currentPage: number;
    itemsPerPage: number;
    loading: boolean;
    error: string | null;
}

const store: Store<State> = createStore<State>({
    state: (): State => ({
        appointments: [],
        agents: [],
        contacts: [],
        filters: {
            status: "all",
            selectedAgents: [],
            searchQuery: "",
            dateRange: {
                start: null,
                end: null,
            },
        },
        currentPage: 1,
        itemsPerPage: 12,
        loading: false,
        error: null,
    }),

    getters: {
        filteredAppointments: (state: State): Appointment[] => {
            let filtered = [...state.appointments];

            if (state.filters.status !== "all") {
                filtered = filtered.filter((appointment) => {
                    const actualStatus = getAppointmentStatus(appointment);
                    return actualStatus === state.filters.status;
                });
            }

            if (state.filters.selectedAgents.length > 0) {
                filtered = filtered.filter((appointment) =>
                    appointment.agents.some((agent: Agent) =>
                        state.filters.selectedAgents.includes(agent.id)
                    )
                );
            }

            if (state.filters.searchQuery) {
                const query = state.filters.searchQuery.toLowerCase();
                filtered = filtered.filter((appointment) =>
                    appointment.address.toLowerCase().includes(query) ||
                    appointment.contact.fullName?.toLowerCase().includes(
                        query,
                    ) ||
                    appointment.contact.email.toLowerCase().includes(query) ||
                    appointment.contact.phone.includes(query)
                );
            }

            if (state.filters.dateRange.start || state.filters.dateRange.end) {
                filtered = filtered.filter((appointment) => {
                    const appointmentDate = appointment.appointmentDate;
                    if (
                        state.filters.dateRange.start &&
                        appointmentDate < state.filters.dateRange.start
                    ) {
                        return false;
                    }
                    if (
                        state.filters.dateRange.end &&
                        appointmentDate > state.filters.dateRange.end
                    ) {
                        return false;
                    }
                    return true;
                });
            }

            filtered.sort((a, b) =>
                b.appointmentDate.getTime() - a.appointmentDate.getTime()
            );

            return filtered;
        },

        paginatedAppointments: (state: State, getters: any): Appointment[] => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            const end = start + state.itemsPerPage;
            return getters.filteredAppointments.slice(start, end);
        },

        totalPages: (state: State, getters: any): number => {
            return Math.ceil(
                getters.filteredAppointments.length / state.itemsPerPage,
            );
        },

        getAppointmentsByContact:
            (state: State) => (contactId: string): Appointment[] => {
                return state.appointments.filter((a: Appointment) =>
                    a.contact.id === contactId
                );
            },
    },

    mutations: {
        SET_APPOINTMENTS(state: State, appointments: Appointment[]) {
            state.appointments = appointments;
        },

        SET_AGENTS(state: State, agents: Agent[]) {
            state.agents = agents;
        },

        SET_CONTACTS(state: State, contacts: Contact[]) {
            state.contacts = contacts;
        },

        SET_FILTER_STATUS(state: State, status: "all" | AppointmentStatus) {
            state.filters.status = status;
            state.currentPage = 1;
        },

        TOGGLE_AGENT_FILTER(state: State, agentId: string) {
            const index = state.filters.selectedAgents.indexOf(agentId);
            if (index > -1) {
                state.filters.selectedAgents.splice(index, 1);
            } else {
                state.filters.selectedAgents.push(agentId);
            }
            state.currentPage = 1;
        },

        SET_SEARCH_QUERY(state: State, query: string) {
            state.filters.searchQuery = query;
            state.currentPage = 1;
        },

        SET_DATE_RANGE(
            state: State,
            { start, end }: { start: Date | null; end: Date | null },
        ) {
            state.filters.dateRange.start = start;
            state.filters.dateRange.end = end;
            state.currentPage = 1;
        },

        SET_CURRENT_PAGE(state: State, page: number) {
            state.currentPage = page;
        },

        SET_LOADING(state: State, loading: boolean) {
            state.loading = loading;
        },

        SET_ERROR(state: State, error: string | null) {
            state.error = error;
        },

        ADD_APPOINTMENT(state: State, appointment: Appointment) {
            state.appointments.push(appointment);
        },

        UPDATE_APPOINTMENT(state: State, appointment: Appointment) {
            const index = state.appointments.findIndex((a: Appointment) =>
                a.id === appointment.id
            );
            if (index > -1) {
                state.appointments.splice(index, 1, appointment);
            }
        },
    },

    actions: {
        async fetchAllData({ commit }: ActionContext<State, State>) {
            commit("SET_LOADING", true);
            try {
                const [appointments, agents, contacts] = await Promise.all([
                    appointmentService.getAll(),
                    agentService.getAll(),
                    contactService.getAll(),
                ]);
                commit("SET_APPOINTMENTS", appointments);
                commit("SET_AGENTS", agents);
                commit("SET_CONTACTS", contacts);
            } catch (error) {
                commit("SET_ERROR", "Failed to fetch data");
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createAppointment(
            { commit }: ActionContext<State, State>,
            appointment: Partial<Appointment>,
        ) {
            commit("SET_LOADING", true);
            try {
                const newAppointment = await appointmentService.create(
                    appointment,
                );
                if (newAppointment) {
                    commit("ADD_APPOINTMENT", newAppointment);
                }
                return newAppointment;
            } catch (error) {
                commit("SET_ERROR", "Failed to create appointment");
                return null;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async updateAppointment(
            { commit }: ActionContext<State, State>,
            { id, appointment }: {
                id: string;
                appointment: Partial<Appointment>;
            },
        ) {
            commit("SET_LOADING", true);
            try {
                const updatedAppointment = await appointmentService.update(
                    id,
                    appointment,
                );
                if (updatedAppointment) {
                    commit("UPDATE_APPOINTMENT", updatedAppointment);
                }
                return updatedAppointment;
            } catch (error) {
                commit("SET_ERROR", "Failed to update appointment");
                return null;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async getRelatedAppointments(
            { state }: ActionContext<State, State>,
            contactId: string,
        ) {
            const appointments = await appointmentService.getByContactId(
                contactId,
            );
            return appointments;
        },
    },
});

export default store;
