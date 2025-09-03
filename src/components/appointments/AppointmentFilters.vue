<template>
  <v-card elevation="0" class="mb-4">
    <v-card-text class="pa-3">
      <!-- All Filters in One Row -->
      <v-row align="center" class="ma-0">
        <!-- Agent Filters -->
        <v-col cols="12" md="auto" v-if="agents.length > 0" class="pa-2">
          <div class="d-flex align-center ga-2">
            <v-item-group
              v-model="selectedAgentIndices"
              multiple
              class="d-flex ga-1"
            >
              <v-item
                v-for="agent in agents"
                :key="agent.id"
                :value="agent.id"
                v-slot="{ isSelected, toggle }"
              >
                <v-avatar
                  size="32"
                  :color="isSelected ? getAgentColor(agent) : 'transparent'"
                  @click="toggle"
                  class="agent-filter-avatar"
                  :style="{
                    border: isSelected
                      ? 'none'
                      : `1px solid ${getAgentColor(agent)}`,
                    cursor: 'pointer',
                  }"
                >
                  <span
                    :class="isSelected ? 'text-white' : ''"
                    :style="{
                      color: isSelected ? 'white' : getAgentColor(agent),
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }"
                  >
                    {{ getInitials(agent.name) }}
                  </span>
                  <v-tooltip activator="parent" location="bottom">
                    <div class="text-center">
                      <div class="font-weight-medium">{{ agent.name }}</div>
                      <div class="text-caption" v-if="isSelected">
                        Click to remove
                      </div>
                      <div class="text-caption" v-else>Click to filter</div>
                    </div>
                  </v-tooltip>
                </v-avatar>
              </v-item>
            </v-item-group>
          </div>
        </v-col>

        <!-- Status Filter -->
        <v-col cols="12" sm="6" md="2" class="pa-2">
          <v-select
            v-model="localFilters.status"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            label="Status"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="updateStatus"
          />
        </v-col>

        <!-- Date Filters -->
        <v-col cols="12" sm="6" md="2" class="pa-2">
          <v-text-field
            v-model="startDate"
            label="Start Date"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="updateDateRange"
          />
        </v-col>

        <v-col cols="12" sm="6" md="2" class="pa-2">
          <v-text-field
            v-model="endDate"
            label="End Date"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="updateDateRange"
          />
        </v-col>

        <!-- Spacer to push search to right -->
        <v-spacer class="d-none d-md-block" />

        <!-- Search Filter -->
        <v-col cols="12" sm="6" md="auto" class="pa-2">
          <v-text-field
            v-model="localFilters.searchQuery"
            label="Search"
            placeholder="Name, email, phone..."
            variant="outlined"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="mdi-magnify"
            style="min-width: 250px"
            @update:model-value="updateSearch"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Agent } from "../../domain/models/Agent";
import type { FilterState } from "../../store";
import {
  generateColorFromString,
  getInitials,
} from "../../presentation/utils/colorUtils";

interface Props {
  filters: FilterState;
  agents: Agent[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:status": [status: FilterState["status"]];
  "toggle:agent": [agentId: string];
  "update:search": [query: string];
  "update:dateRange": [range: { start: Date | null; end: Date | null }];
}>();

const localFilters = ref({ ...props.filters });
const startDate = ref<string>("");
const endDate = ref<string>("");

const selectedAgentIndices = computed({
  get: () => localFilters.value.selectedAgents,
  set: (value: string[]) => {
    const currentAgents = localFilters.value.selectedAgents;
    const addedAgents = value.filter((id) => !currentAgents.includes(id));
    const removedAgents = currentAgents.filter((id) => !value.includes(id));

    addedAgents.forEach((id) => emit("toggle:agent", id));
    removedAgents.forEach((id) => emit("toggle:agent", id));
  },
});

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const updateStatus = (status: FilterState["status"]) => {
  emit("update:status", status);
};

const updateSearch = (query: string) => {
  emit("update:search", query || "");
};

const updateDateRange = () => {
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;
  emit("update:dateRange", { start, end });
};

const getAgentColor = (agent: Agent): string => {
  return agent.themeColor && agent.themeColor !== "#000000"
    ? agent.themeColor
    : generateColorFromString(agent.name);
};

watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);
</script>

<style scoped>
.agent-filter-avatar {
  transition: all 0.2s ease;
}

.agent-filter-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
