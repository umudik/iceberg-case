<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Create Appointment</span>
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
            <v-col cols="6">
              <v-text-field
                v-model="appointmentDate"
                label="Appointment Date"
                type="date"
                variant="outlined"
                density="compact"
                :rules="[rules.required, rules.futureDate]"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="appointmentTime"
                label="Appointment Time"
                type="time"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!valid" @click="save">
          Create Appointment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Contact } from "../../domain/models/Contact";
import type { Agent } from "../../domain/models/Agent";
import type { Appointment } from "../../domain/models/Appointment";

interface Props {
  modelValue: boolean;
  contacts: Contact[];
  agents: Agent[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [appointment: Partial<Appointment>];
}>();

const dialog = ref(props.modelValue);
const form = ref();
const valid = ref(false);

const formData = ref({
  contact: null as Contact | null,
  address: "",
  agents: [] as Agent[],
});

const appointmentDate = ref("");
const appointmentTime = ref("");

const rules = {
  required: (v: any) => !!v || "This field is required",
  requiredArray: (v: any[]) => v.length > 0 || "At least one agent is required",
  futureDate: (v: string) => {
    if (!v) return true;
    const date = new Date(v);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today || "Date must be today or in the future";
  },
};

const close = () => {
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    contact: null,
    address: "",
    agents: [],
  };
  appointmentDate.value = "";
  appointmentTime.value = "";
  form.value?.reset();
};

const save = async () => {
  if (!form.value?.validate()) return;

  if (!formData.value.contact) return;

  const dateTime = new Date(
    `${appointmentDate.value}T${appointmentTime.value}`
  );

  const appointment: Partial<Appointment> = {
    contact: formData.value.contact,
    address: formData.value.address,
    agents: formData.value.agents,
    appointmentDate: dateTime,
    status: "upcoming",
  };

  emit("save", appointment);
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
</script>
