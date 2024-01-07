<template>
  <p class="mb-2">
    Data last synced at
    <strong>
      {{ formattedTs || "N/A" }}
    </strong>
  </p>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

const { ts } = defineProps({
  ts: {
    type: Object as PropType<Date | null>,
    default: null,
  },
});

const formattedTs = computed(() => {
  return dayjs(ts).format("HH:mm, MMM DD");
});
</script>
