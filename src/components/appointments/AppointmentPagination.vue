<template>
  <v-card elevation="0" v-if="totalPages > 1" class="mt-4">
    <v-card-text class="d-flex justify-end align-center">
      <div class="text-caption text-grey mr-3">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="7"
        color="pink"
        rounded="0"
        density="compact"
        variant="flat"
        @update:model-value="updatePage"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:page": [page: number];
}>();

const page = ref(props.currentPage);

const updatePage = (newPage: number) => {
  emit("update:page", newPage);
};

watch(
  () => props.currentPage,
  (newPage) => {
    page.value = newPage;
  }
);
</script>
