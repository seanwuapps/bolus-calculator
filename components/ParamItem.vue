<template>
  <li class="param">
    <span class="label">
      <span class="label-text">{{ label }}</span>
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
    <div class="meta">
      <time>
        <strong>Time:</strong>
        {{ timeStart }} -
        {{ timeEnd }}
      </time>
      <p v-if="description">{{ description }}</p>
    </div>
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
  },
  timeEnd: {
    type: String,
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
  display: grid;
  grid-template-columns: auto;
  grid-template-areas:
    "value"
    "label"
    "meta";
  .label {
    grid-area: label;
    .label-text {
      font-weight: 700;
      font-size: 0.8em;
    }
  }
  .value {
    grid-area: value;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2em;
    color: var(--go-color-success-600);
  }
  .meta {
    grid-area: meta;
    font-size: 0.8em;
  }
}
</style>
