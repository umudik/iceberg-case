<template>
  <div>
    <v-card elevation="0" rounded="lg" class="border">
      <v-card-title class="d-flex justify-space-between align-center pa-5 pb-4">
        <div>
          <h3 class="text-h6 font-weight-medium mb-1">Appointments</h3>
          <span class="text-body-2 text-grey"
            >{{ totalCount }} appointments found</span
          >
        </div>
        <v-btn
          color="pink"
          variant="flat"
          size="default"
          class="text-none"
          rounded="lg"
          elevation="2"
          @click="$emit('create-appointment')"
        >
          <v-icon start size="small">mdi-plus</v-icon>
          Create Appointment
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0">
        <div v-if="appointments.length > 0" class="pa-3 bg-grey-lighten-5">
          <v-card
            v-for="appointment in appointments"
            :key="appointment.id"
            @click="$emit('edit-appointment', appointment)"
            class="mb-3"
            hover
            elevation="1"
            rounded="lg"
          >
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-col cols="12" md="3" class="pa-2">
                  <div class="d-flex align-start ga-3">
                    <v-avatar
                      size="48"
                      :color="
                        getContactColor(appointment.contact.fullName || '')
                      "
                      elevation="2"
                    >
                      <span class="text-white font-weight-bold">
                        {{ getInitials(appointment.contact.fullName || "") }}
                      </span>
                    </v-avatar>
                    <div>
                      <div class="d-flex align-center mb-1">
                        <v-icon size="x-small" class="mr-2">mdi-account</v-icon>
                        <span class="font-weight-medium text-body-2">{{
                          appointment.contact.fullName
                        }}</span>
                      </div>
                      <div class="d-flex align-center mb-1">
                        <v-icon size="x-small" class="mr-2">mdi-phone</v-icon>
                        <span class="text-caption text-grey-darken-1">{{
                          appointment.contact.phone
                        }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="x-small" class="mr-2">mdi-email</v-icon>
                        <span class="text-caption text-grey-darken-1">{{
                          appointment.contact.email
                        }}</span>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="3" class="pa-2">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-home</v-icon>
                    <span class="text-body-2 text-grey-darken-2">{{
                      appointment.address
                    }}</span>
                  </div>
                </v-col>

                <v-col cols="12" md="3" class="pa-2">
                  <v-sheet
                    color="pink-lighten-5"
                    rounded="lg"
                    class="pa-2 d-flex align-center ga-2"
                  >
                    <v-chip
                      :color="getStatusColor(appointment)"
                      size="small"
                      variant="outlined"
                    >
                      {{ getStatusLabel(appointment) }}
                    </v-chip>
                    <div class="d-flex align-center">
                      <v-icon size="x-small" class="mr-1" color="pink-darken-4"
                        >mdi-clock-outline</v-icon
                      >
                      <span class="text-caption text-pink-darken-4">{{
                        formatDate(appointment.appointmentDate)
                      }}</span>
                    </div>
                  </v-sheet>
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                  class="pa-2 d-flex justify-center align-center"
                >
                  <div class="d-flex">
                    <v-tooltip
                      v-for="(agent, idx) in appointment.agents.slice(0, 3)"
                      :key="agent.id"
                      :text="agent.name"
                      location="top"
                    >
                      <template v-slot:activator="{ props }">
                        <v-avatar
                          v-bind="props"
                          size="32"
                          :color="getAgentColor(agent)"
                          :style="{
                            marginLeft: idx > 0 ? '-8px' : '0',
                            zIndex: 3 - idx,
                            border: '2px solid white',
                          }"
                          elevation="1"
                        >
                          <span
                            class="text-white font-weight-bold text-caption"
                          >
                            {{ getInitials(agent.name) }}
                          </span>
                        </v-avatar>
                      </template>
                    </v-tooltip>
                    <v-avatar
                      v-if="appointment.agents.length > 3"
                      size="32"
                      color="grey"
                      :style="{
                        marginLeft: '-8px',
                        border: '2px solid white',
                      }"
                      elevation="1"
                    >
                      <span class="text-white font-weight-bold text-caption">
                        +{{ appointment.agents.length - 3 }}
                      </span>
                    </v-avatar>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <v-alert v-else type="info" variant="tonal" class="ma-4">
          <v-icon start>mdi-calendar-blank</v-icon>
          No appointments found. Create your first appointment to get started.
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import type { Appointment } from "../../domain/models/Appointment";
import type { Agent } from "../../domain/models/Agent";
import { getAppointmentStatus } from "../../domain/models/Appointment";
import { generateColorFromString, getInitials } from "../../utils/colorUtils";

interface Props {
  appointments: Appointment[];
  totalCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  totalCount: 0,
});

defineEmits<{
  "create-appointment": [];
  "edit-appointment": [appointment: Appointment];
}>();

const formatDate = (date: Date): string => {
  return format(new Date(date), "dd/MM/yyyy HH:mm");
};

const getStatusLabel = (appointment: Appointment): string => {
  const status = getAppointmentStatus(appointment);

  if (status === "upcoming") {
    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    const diffTime = appointmentDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Upcoming Today";
    } else if (diffDays === 1) {
      return "Upcoming Tomorrow";
    } else if (diffDays > 0) {
      return `Upcoming ${diffDays} days`;
    }
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusColor = (appointment: Appointment): string => {
  const status = getAppointmentStatus(appointment);
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
};

const getStatusIcon = (appointment: Appointment): string => {
  const status = getAppointmentStatus(appointment);
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
};

const getContactColor = (name: string): string => {
  return generateColorFromString(name);
};

const getAgentColor = (agent: Agent): string => {
  return agent.themeColor && agent.themeColor !== "#000000"
    ? agent.themeColor
    : generateColorFromString(agent.name);
};
</script>