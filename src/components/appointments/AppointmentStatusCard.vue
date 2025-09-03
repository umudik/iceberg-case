<template>
  <v-sheet
    color="pink-lighten-5"
    rounded="lg"
    class="pa-2 d-inline-flex align-center ga-2"
  >
    <v-chip
      :color="statusColor"
      size="small"
      variant="outlined"
      class="flex-shrink-0"
    >
      {{ statusLabel }}
    </v-chip>
    <div class="d-flex align-center flex-shrink-0">
      <v-icon size="x-small" class="mr-1" color="pink-darken-4">
        mdi-clock-outline
      </v-icon>
      <span class="text-caption text-pink-darken-4 text-nowrap">
        {{ formattedDate }}
      </span>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import type { Appointment } from "../../domain/models/Appointment";
import { AppointmentUseCases } from "../../domain/use-cases/AppointmentUseCases";

interface Props {
  appointment: Appointment;
  dateFormat?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dateFormat: "dd/MM/yyyy HH:mm",
});

const statusLabel = computed(() => {
  return AppointmentUseCases.getStatusLabel(props.appointment);
});

const statusColor = computed(() => {
  return AppointmentUseCases.getStatusColor(props.appointment);
});

const formattedDate = computed(() => {
  return format(new Date(props.appointment.appointmentDate), props.dateFormat);
});
</script>
