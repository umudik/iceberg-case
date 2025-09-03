<template>
  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card v-if="appointment">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Edit Appointment</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-autocomplete
            v-model="formData.contact"
            :items="contacts"
            :item-title="(item) => `${item.firstName} ${item.lastName}`"
            :item-value="(item) => item"
            label="Contact"
            placeholder="Search for a contact"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            return-object
            class="mb-4"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title
                  >{{ item.raw.firstName }}
                  {{ item.raw.lastName }}</v-list-item-title
                >
                <v-list-item-subtitle>{{
                  item.raw.email
                }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-textarea
            v-model="formData.address"
            label="Address"
            variant="outlined"
            density="compact"
            rows="2"
            :rules="[rules.required]"
            class="mb-4"
          />

          <v-select
            v-model="formData.agents"
            :items="agents"
            item-title="name"
            :item-value="(item) => item"
            label="Agents"
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            :rules="[rules.requiredArray]"
            return-object
            class="mb-4"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                v-bind="props"
                :color="item.raw.themeColor"
                text-color="white"
              />
            </template>
          </v-select>

          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="appointmentDate"
                label="Appointment Date"
                type="date"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="appointmentTime"
                label="Appointment Time"
                type="time"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-divider class="my-4" />

        <div class="mb-4">
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" class="mr-2">mdi-calendar-multiple</v-icon>
            <span class="text-h6">Related Appointments</span>
            <v-chip
              v-if="relatedAppointments.length > 0"
              size="small"
              class="ml-2"
              color="primary"
              variant="tonal"
            >
              {{ relatedAppointments.length }}
            </v-chip>
          </div>

          <v-row v-if="relatedAppointments.length > 0" class="mt-2">
            <v-col
              v-for="related in relatedAppointments"
              :key="related.id"
              cols="12"
            >
              <v-card
                variant="outlined"
                density="compact"
                class="related-appointment-card"
              >
                <v-card-text class="pa-3">
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-row no-gutters>
                        <v-col cols="12" class="mb-2">
                          <div class="d-flex align-center">
                            <v-icon
                              size="small"
                              class="mr-2 text-medium-emphasis"
                              >mdi-home-outline</v-icon
                            >
                            <span class="text-body-2 font-weight-medium">{{
                              related.address
                            }}</span>
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <v-sheet
                            color="pink-lighten-5"
                            rounded="lg"
                            class="pa-2 d-inline-flex align-center ga-2"
                          >
                            <v-chip
                              :color="getStatusColor(related)"
                              size="small"
                              variant="outlined"
                              class="flex-shrink-0"
                            >
                              {{ getStatusLabel(related) }}
                            </v-chip>
                            <div class="d-flex align-center flex-shrink-0">
                              <v-icon
                                size="x-small"
                                class="mr-1"
                                color="pink-darken-4"
                                >mdi-clock-outline</v-icon
                              >
                              <span
                                class="text-caption text-pink-darken-4 text-nowrap"
                                >{{ formatDate(related.appointmentDate) }}</span
                              >
                            </div>
                          </v-sheet>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="4" class="d-flex align-center justify-end">
                      <div
                        v-if="related.agents.length > 0"
                        class="d-flex align-center"
                      >
                        <v-avatar
                          v-for="agent in related.agents.slice(0, 2)"
                          :key="agent.id"
                          size="28"
                          :color="agent.themeColor"
                          class="mr-1"
                        >
                          <span class="text-caption font-weight-bold">{{
                            agent.name.charAt(0)
                          }}</span>
                        </v-avatar>
                        <span
                          v-if="related.agents.length > 2"
                          class="text-caption text-medium-emphasis ml-1"
                        >
                          +{{ related.agents.length - 2 }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-card v-else variant="tonal" color="info" density="compact">
            <v-card-text class="d-flex align-center pa-3">
              <v-icon class="mr-2">mdi-information</v-icon>
              <span class="text-body-2"
                >No other appointments for this contact</span
              >
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!valid" @click="save">
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { format } from "date-fns";
import type { Contact } from "../../domain/models/Contact";
import type { Agent } from "../../domain/models/Agent";
import type { Appointment } from "../../domain/models/Appointment";
import { AppointmentUseCases } from "../../domain/use-cases/AppointmentUseCases";

interface Props {
  modelValue: boolean;
  appointment: Appointment | null;
  contacts: Contact[];
  agents: Agent[];
  relatedAppointments: Appointment[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [id: string, appointment: Partial<Appointment>];
}>();

const dialog = ref(props.modelValue);
const form = ref();
const valid = ref(false);

const formData = ref({
  contact: null as Contact | null,
  address: "",
  agents: [] as Agent[],
  status: "upcoming" as Appointment["status"],
});

const appointmentDate = ref("");
const appointmentTime = ref("");

const statusOptions = computed(() => {
  if (!props.appointment) return [];

  const appointmentDateTime = new Date(
    `${appointmentDate.value}T${appointmentTime.value}`
  );
  const now = new Date();

  if (appointmentDateTime > now) {
    return ["upcoming", "cancelled"];
  } else {
    return ["completed", "cancelled"];
  }
});

const rules = {
  required: (v: any) => !!v || "This field is required",
  requiredArray: (v: any[]) => v.length > 0 || "At least one agent is required",
};

const formatDate = (date: Date): string => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const appointmentDate = new Date(date);
  const diffTime = Math.abs(appointmentDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (appointmentDate < now) {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } else {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    return `In ${Math.floor(diffDays / 30)} months`;
  }
};

const getStatusLabel = (appointment: Appointment): string => {
  const status = AppointmentUseCases.getStatus(appointment);
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusColor = (appointment: Appointment): string => {
  const status = AppointmentUseCases.getStatus(appointment);
  switch (status) {
    case "upcoming":
      return "success";
    case "completed":
      return "info";
    case "cancelled":
      return "error";
    default:
      return "grey";
  }
};

const close = () => {
  dialog.value = false;
};

const save = async () => {
  if (!form.value?.validate()) return;
  if (!props.appointment || !formData.value.contact) return;

  const dateTime = new Date(
    `${appointmentDate.value}T${appointmentTime.value}`
  );

  const updatedAppointment: Partial<Appointment> = {
    contact: formData.value.contact,
    address: formData.value.address,
    agents: formData.value.agents,
    appointmentDate: dateTime,
    status: formData.value.status,
  };

  emit("save", props.appointment.id, updatedAppointment);
  close();
};

watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
  }
);

watch(dialog, (newVal) => {
  emit("update:modelValue", newVal);
});

watch(
  () => props.appointment,
  (newAppointment) => {
    if (newAppointment) {
      formData.value = {
        contact: newAppointment.contact,
        address: newAppointment.address,
        agents: [...newAppointment.agents],
        status: newAppointment.status,
      };

      const date = new Date(newAppointment.appointmentDate);
      appointmentDate.value = format(date, "yyyy-MM-dd");
      appointmentTime.value = format(date, "HH:mm");
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.related-appointment-card {
  transition: all 0.2s ease;
  border-left-width: 3px !important;
}

.related-appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
