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
      :total-count="filteredAppointments.length"
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
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import type { State } from "../../store";
import AppointmentList from "../../components/appointments/AppointmentList.vue";
import AppointmentFilters from "../../components/appointments/AppointmentFilters.vue";
import AppointmentPagination from "../../components/appointments/AppointmentPagination.vue";
import CreateAppointmentModal from "../../components/appointments/CreateAppointmentModal.vue";
import EditAppointmentModal from "../../components/appointments/EditAppointmentModal.vue";
import type { Appointment } from "../../domain/models/Appointment";

const store = useStore<State>();

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
const currentPage = computed(() => store.state.currentPage);
const filteredAppointments = computed(() => store.getters.filteredAppointments);
const paginatedAppointments = computed(
  () => store.getters.paginatedAppointments
);
const totalPages = computed(() => store.getters.totalPages);

const updateStatus = (status: State["filters"]["status"]) => {
  store.commit("SET_FILTER_STATUS", status);
};

const toggleAgent = (agentId: string) => {
  store.commit("TOGGLE_AGENT_FILTER", agentId);
};

const updateSearch = (query: string) => {
  store.commit("SET_SEARCH_QUERY", query);
};

const updateDateRange = (range: { start: Date | null; end: Date | null }) => {
  store.commit("SET_DATE_RANGE", range);
};

const updatePage = (page: number) => {
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

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>
