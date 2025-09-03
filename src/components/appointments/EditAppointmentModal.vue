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

        <div class="text-h6 mb-3">Related Appointments</div>
        <v-list v-if="relatedAppointments.length > 0" density="compact">
          <v-list-item
            v-for="related in relatedAppointments"
            :key="related.id"
            class="px-0"
          >
            <v-list-item-title>
              {{ formatDate(related.appointmentDate) }} - {{ related.address }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip size="x-small" :color="getStatusColor(related)">
                {{ getStatusLabel(related) }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-alert v-else type="info" variant="tonal" density="compact">
          No other appointments for this contact
        </v-alert>
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
import { getAppointmentStatus } from "../../domain/models/Appointment";

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

const getStatusLabel = (appointment: Appointment): string => {
  const status = getAppointmentStatus(appointment);
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusColor = (appointment: Appointment): string => {
  const status = getAppointmentStatus(appointment);
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
