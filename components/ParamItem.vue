<template>
  <li class="param">
    <span class="label">
      <span class="label-text">{{ label }}</span>
      <time>
        <strong>Time:</strong>
        {{ timeStart }} -
        {{ timeEnd }}
      </time>
      <p v-if="description">{{ description }}</p>
    </span>
    <span class="value">
      <template v-if="editable">
        <GoButton
          compact
          round
          icon
          @click="decrease"
          :aria-label="decreaseLabel"
        >
          <GoIcon name="remove" decorative></GoIcon>
        </GoButton>
        <span>
          <strong>{{ value }}</strong>
        </span>
        <GoButton
          compact
          round
          icon
          @click="increase"
          :aria-label="increaseLabel"
        >
          <GoIcon name="add" decorative></GoIcon>
        </GoButton>
      </template>
      <template v-else>
        <span>
          <strong>{{ value }}</strong>
        </span>
      </template>
    </span>
  </li>
</template>

<script setup>
import { GoButton, GoIcon } from "@go-ui/vue";

defineProps({
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    required: true,
  },
  timeStart: {
    type: String,
    required: true,
  },
  timeEnd: {
    type: String,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  decreaseLabel: {
    type: String,
    default: "Decrease 0.1",
  },
  increaseLabel: {
    type: String,
    default: "Increase 0.1",
  },
});

const emit = defineEmits(["decrease", "increase"]);

const increase = () => {
  emit("increase");
};

const decrease = () => {
  emit("decrease");
};
</script>

<style lang="scss">
li.param {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .label {
    .label-text {
      font-size: 1.2em;
      font-weight: 700;
    }
    p {
      margin: 0;
      font-size: 0.85em;
      color: var(--go-color-neutral-800);
    }
    time {
      display: block;
      font-weight: 400;
      font-size: 0.85em;
    }
  }
  .value {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2em;
    color: var(--go-color-success-600);
  }
}
</style>
