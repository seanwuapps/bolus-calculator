<template>
  <!-- ICR -->
  <section>
    <GoHeadingRow heading="Insulin Carbohydrate Ratio" heading-tag="h4" />
    <GoCardRow
      :cols-tablet="1"
      :cols-desktop="3"
      :cols-large="3"
      class="mb-2"
      :key="`icr-${icrs.length}`"
    >
      <GoCard v-for="(icr, i) in icrs" :key="i">
        <GoInput type="time" label="Start time" v-model="icr.start"></GoInput>
        <GoInput type="time" label="End time" v-model="icr.end"></GoInput>
        <GoInput
          label="Insulin to Carbohydrate Ratio (ICR)"
          type="number"
          v-model="icr.value"
          step="0.1"
          inputmode="decimal"
        >
          <div slot="prefix">1 unit for</div>

          <div slot="suffix">g</div>
        </GoInput>
        <div class="text-end">
          <GoButton
            variant="critical"
            outline
            round
            @click="params.icrs?.splice(i, 1)"
            icon
            aria-label="Delete"
          >
            <GoIcon name="delete" decorative></GoIcon>
          </GoButton>
        </div>
      </GoCard>
      <GoCard>
        <GoButton variant="success" block="all" @click="addNew('icrs')">
          <GoIcon name="add"></GoIcon>
          Add Timeslot
        </GoButton>
      </GoCard>
    </GoCardRow>
  </section>
  <!-- ISF -->
  <section>
    <GoHeadingRow heading="Insulin Sensitivity Factor" heading-tag="h4" />
    <GoCardRow
      :cols-tablet="1"
      :cols-desktop="3"
      :cols-large="3"
      class="mb-2"
      :key="`isf-${isfs.length}`"
    >
      <GoCard v-for="(isf, i) in isfs">
        <GoInput type="time" label="Start time" v-model="isf.start"></GoInput>
        <GoInput type="time" label="End time" v-model="isf.end"></GoInput>
        <GoInput
          label="Insulin Sensitivity Factor (ISF)"
          type="number"
          step="0.1"
          inputmode="decimal"
          v-model="isf.value"
        >
          <div slot="prefix">1 unit for</div>
          <div slot="suffix">mmol/L</div>
        </GoInput>
        <GoButton
          variant="critical"
          outline
          round
          @click="params.isfs?.splice(i, 1)"
          icon
          aria-label="Delete"
        >
          <GoIcon name="delete" decorative></GoIcon>
        </GoButton>
      </GoCard>
      <GoCard>
        <GoButton variant="success" block="all" @click="addNew('isfs')">
          <GoIcon name="add"></GoIcon>
          Add Timeslot
        </GoButton>
      </GoCard>
    </GoCardRow>
  </section>

  <!-- Target BG -->
  <section>
    <GoHeadingRow heading="Target Glocose Level" heading-tag="h4" />
    <GoCardRow
      :cols-tablet="1"
      :cols-desktop="3"
      :cols-large="3"
      class="mb-2"
      :key="`tbg-${targetBGs.length}`"
    >
      <GoCard v-for="(tbg, i) in targetBGs">
        <GoInput type="time" label="Start time" v-model="tbg.start"></GoInput>
        <GoInput type="time" label="End time" v-model="tbg.end"></GoInput>
        <GoInput
          label="Target Glocose Level"
          type="number"
          v-model="tbg.value"
          step="0.1"
          inputmode="decimal"
        >
          <div slot="suffix">mmol/L</div>
        </GoInput>
        <GoButton
          variant="critical"
          outline
          round
          @click="params.targetBGs?.splice(i, 1)"
          icon
          aria-label="Delete"
        >
          <GoIcon name="delete" decorative></GoIcon>
        </GoButton>
      </GoCard>
      <GoCard>
        <GoButton variant="success" block="all" @click="addNew('targetBGs')">
          <GoIcon name="add"></GoIcon>
          Add Timeslot
        </GoButton>
      </GoCard>
    </GoCardRow>
  </section>

  <hr />
  <GoButtonGroup>
    <GoButton variant="primary" @click="save"> Save </GoButton>
    <GoButton variant="text" flat @click="$emit('close')"> Close </GoButton>
  </GoButtonGroup>
</template>

<script setup lang="ts">
import {
  GoInput,
  GoButton,
  GoIcon,
  GoHeadingRow,
  GoButtonGroup,
  GoCard,
  GoCardRow,
} from "@go-ui/vue";
import { useBolusStore } from "~/stores/bolus.store";

const emit = defineEmits(["close"]);
const bolusStore = useBolusStore();

const { params } = storeToRefs(bolusStore);

const targetBGs = computed(() => params.value?.targetBGs || []);
const icrs = computed(() => params.value?.icrs || []);
const isfs = computed(() => params.value?.isfs || []);

const addNew = (type: "targetBGs" | "icrs" | "isfs") => {
  console.log(params.value);
  if (!params.value) {
    return;
  }
  params.value[type] = [
    ...(params.value[type] || []),
    {
      start: "00:00",
      end: "00:00",
      value: "",
    },
  ];
};

const save = () => {
  bolusStore.saveParams(params.value);
  emit("close");
};
</script>

<style>
.ml-auto {
  margin-left: auto;
}
</style>
