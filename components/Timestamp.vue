<template>
  <p class="mb-2">
    Data last synced at
    <strong>
      {{ formattedTs }}
    </strong>
  </p>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

const props = defineProps({
  ts: {
    type: Object as PropType<Date | null>,
    default: null,
  },
});

const formattedTs = computed(() => {
  if (!props.ts) {
    return "N/A";
  }
  return dayjs(props.ts).format("hh:mm A, MMMM DD");
});
</script>
