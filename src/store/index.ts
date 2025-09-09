import { type ActionContext, createStore, Store } from "vuex";
import type { Contact } from "../domain/models/Contact";
import type { Agent } from "../domain/models/Agent";
import type {
    Appointment,
    AppointmentStatus,
} from "../domain/models/Appointment";
import { ServiceContainer } from "../infrastructure/di/ServiceContainer";
import { AppointmentUseCases } from "../domain/use-cases/AppointmentUseCases";

const container = ServiceContainer.getInstance();
const contactService = container.getContactService();
const agentService = container.getAgentService();
const appointmentService = container.getAppointmentService();

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
    totalPages?: number;
    totalCount?: number;
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
        itemsPerPage: 10,
        totalPages: 0,
        totalCount: 0,
        loading: true,
        error: null,
    }),

    getters: {
        filteredAppointments: (state: State): Appointment[] => {
            return AppointmentUseCases.filterAppointments(state.appointments, {
                status: state.filters.status,
                selectedAgents: state.filters.selectedAgents,
                searchQuery: state.filters.searchQuery,
                dateRange: state.filters.dateRange
            });
        },

        paginatedAppointments: (state: State, getters: { filteredAppointments: Appointment[] }): Appointment[] => {
            const filtered = getters.filteredAppointments;
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            return filtered.slice(startIndex, endIndex);
        },

        totalPages: (state: State, getters: { filteredAppointments: Appointment[] }): number => {
            return Math.ceil(
                getters.filteredAppointments.length / state.itemsPerPage,
            );
        },

        totalCount: (state: State, getters: { filteredAppointments: Appointment[] }): number => {
            return getters.filteredAppointments.length;
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

        SET_TOTAL_PAGES(state: State, totalPages: number) {
            state.totalPages = totalPages;
        },

        SET_TOTAL_COUNT(state: State, totalCount: number) {
            state.totalCount = totalCount;
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

        async fetchPaginatedAppointments(
            { commit, state }: ActionContext<State, State>,
            filters: {
                page?: number;
                status?: string;
                startDate?: Date | null;
                endDate?: Date | null;
                searchQuery?: string;
                agentIds?: string[];
            },
        ) {
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
                commit("SET_CURRENT_PAGE", filters.page || 1);

                return {
                    appointments,
                    totalPages: 1,
                    currentPage: filters.page || 1,
                    hasMore: false,
                    totalCount: appointments.length
                };
            } catch (error) {
                console.error("Failed to fetch paginated data:", error);
                commit("SET_ERROR", "Failed to fetch data");
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createAppointment(
            { commit }: ActionContext<State, State>,
            appointment: Partial<Appointment>,
        ) {
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
            }
        },

        async updateAppointment(
            { commit }: ActionContext<State, State>,
            { id, appointment }: {
                id: string;
                appointment: Partial<Appointment>;
            },
        ) {
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
