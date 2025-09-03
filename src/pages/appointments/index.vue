<template>
  <v-container class="py-6">
    <AppointmentFilters
      :filters="filters"
      :agents="agents"
      @update:status="updateStatus"
      @toggle:agent="toggleAgent"
      @update:search="updateSearch"
      @update:dateRange="updateDateRange"
    />

    <AppointmentList
      :appointments="paginatedAppointments"
      :total-count="totalCount"
      :loading="loading"
      @create-appointment="showCreateModal = true"
      @edit-appointment="editAppointment"
    />

    <AppointmentPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:page="updatePage"
    />

    <CreateAppointmentModal
      v-model="showCreateModal"
      :contacts="contacts"
      :agents="agents"
      @save="createAppointment"
    />

    <EditAppointmentModal
      v-model="showEditModal"
      :appointment="selectedAppointment"
      :contacts="contacts"
      :agents="agents"
      :related-appointments="relatedAppointments"
      @save="updateAppointment"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "AppointmentsPage",
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import type { State } from "../../store";
import { AgentService } from "../../infrastructure/services/AgentService";
import { ContactService } from "../../infrastructure/services/ContactService";
import type { Appointment } from "../../domain/models/Appointment";

const store = useStore<State>();
const route = useRoute();
const router = useRouter();
const agentService = new AgentService();
const contactService = new ContactService();

const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedAppointment = ref<Appointment | null>(null);
const relatedAppointments = ref<Appointment[]>([]);

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

const filters = computed(() => store.state.filters);
const agents = computed(() => store.state.agents);
const contacts = computed(() => store.state.contacts);
const loading = computed(() => store.state.loading);

const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (value: number) => {
    router.push({
      query: {
        ...route.query,
        page: value > 1 ? value.toString() : undefined,
      },
    });
  },
});

const statusFilter = computed({
  get: () => (route.query.status as string) || "all",
  set: (value: string) => {
    router.push({
      query: {
        ...route.query,
        status: value !== "all" ? value : undefined,
        page: undefined,
      },
    });
  },
});

const dateRangeFilter = computed({
  get: () => ({
    start: route.query.startDate
      ? new Date(route.query.startDate as string)
      : null,
    end: route.query.endDate ? new Date(route.query.endDate as string) : null,
  }),
  set: (value: { start: Date | null; end: Date | null }) => {
    router.push({
      query: {
        ...route.query,
        startDate: value.start?.toISOString().split("T")[0] || undefined,
        endDate: value.end?.toISOString().split("T")[0] || undefined,
        page: undefined,
      },
    });
  },
});

const searchFilter = computed({
  get: () => (route.query.search as string) || "",
  set: (value: string) => {
    router.push({
      query: {
        ...route.query,
        search: value || undefined,
        page: undefined,
      },
    });
  },
});

const selectedAgentsFilter = computed({
  get: () => {
    const agents = route.query.agents;
    if (!agents) return [];
    const agentArray = Array.isArray(agents) ? agents : [agents];
    return agentArray.filter((a): a is string => a !== null);
  },
  set: (value: string[]) => {
    router.push({
      query: {
        ...route.query,
        agents: value.length > 0 ? value : undefined,
        page: undefined,
      },
    });
  },
});

const filteredAppointments = computed(() => store.getters.filteredAppointments);
const paginatedAppointments = computed(
  () => store.getters.paginatedAppointments
);

const totalPages = computed(() => store.getters.totalPages);
const totalCount = computed(() => store.state.totalCount || 0);

const updateStatus = (status: State["filters"]["status"]) => {
  statusFilter.value = status;
  store.commit("SET_FILTER_STATUS", status);
  fetchFilteredData();
};

const toggleAgent = (agentId: string) => {
  const current = selectedAgentsFilter.value;
  const index = current.indexOf(agentId);
  if (index > -1) {
    selectedAgentsFilter.value = current.filter((id) => id !== agentId);
  } else {
    selectedAgentsFilter.value = [...current, agentId];
  }
  store.commit("TOGGLE_AGENT_FILTER", agentId);
  fetchFilteredData();
};

const updateSearch = (query: string) => {
  searchFilter.value = query;
  store.commit("SET_SEARCH_QUERY", query);

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchFilteredData();
  }, 500);
};

let searchTimeout: any;

const updateDateRange = (range: { start: Date | null; end: Date | null }) => {
  dateRangeFilter.value = range;
  store.commit("SET_DATE_RANGE", range);
  fetchFilteredData();
};

const updatePage = (page: number) => {
  currentPage.value = page;
  store.commit("SET_CURRENT_PAGE", page);
};

const editAppointment = async (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  relatedAppointments.value = store.getters
    .getAppointmentsByContact(appointment.contact.id)
    .filter((a: Appointment) => a.id !== appointment.id);
  showEditModal.value = true;
};

const createAppointment = async (appointment: Partial<Appointment>) => {
  const result = await store.dispatch("createAppointment", appointment);
  if (result) {
    showSnackbar("Appointment created successfully", "success");
  } else {
    showSnackbar("Failed to create appointment", "error");
  }
};

const updateAppointment = async (
  id: string,
  appointment: Partial<Appointment>
) => {
  const result = await store.dispatch("updateAppointment", { id, appointment });
  if (result) {
    showSnackbar("Appointment updated successfully", "success");
  } else {
    showSnackbar("Failed to update appointment", "error");
  }
};

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color };
};

const fetchFilteredData = async () => {
  await store.dispatch("fetchPaginatedAppointments", {
    page: currentPage.value,
    status: statusFilter.value,
    startDate: dateRangeFilter.value.start,
    endDate: dateRangeFilter.value.end,
    searchQuery: searchFilter.value,
  });
};

onMounted(async () => {
  try {
    const [agents, contacts] = await Promise.all([
      agentService.getAll(),
      contactService.getAll(),
    ]);
    store.commit("SET_AGENTS", agents);
    store.commit("SET_CONTACTS", contacts);

    if (route.query.status) {
      store.commit("SET_FILTER_STATUS", route.query.status);
    }
    if (route.query.search) {
      store.commit("SET_SEARCH_QUERY", route.query.search);
    }
    if (route.query.agents) {
      const agentIds = Array.isArray(route.query.agents)
        ? route.query.agents
        : [route.query.agents];
      agentIds
        .filter((id): id is string => id !== null)
        .forEach((id: string) => {
          store.commit("TOGGLE_AGENT_FILTER", id);
        });
    }
    if (route.query.startDate || route.query.endDate) {
      store.commit("SET_DATE_RANGE", {
        start: route.query.startDate
          ? new Date(route.query.startDate as string)
          : null,
        end: route.query.endDate
          ? new Date(route.query.endDate as string)
          : null,
      });
    }
    if (route.query.page) {
      store.commit("SET_CURRENT_PAGE", Number(route.query.page));
    }

    await fetchFilteredData();
  } catch (error) {
    console.error("Failed to load initial data:", error);
    showSnackbar("Failed to load appointments", "error");
  }
});

watch(
  () => route.query,
  async () => {
    await fetchFilteredData();
  },
  { deep: true }
);
</script>
