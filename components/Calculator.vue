<template>
  <div>
    <pre>{{ settingsStore.settings }}</pre>
    <pre>{{ bolusStore.params }}</pre>
    <pre>{{ currentParams }}</pre>
    <GoInput
      class="mb-2"
      label="Current BG"
      hint="Current blood glucose level"
      required
      v-model="currentBG"
    >
      <div slot="suffix">mmol/L</div>
    </GoInput>

    <GoInput
      class="mb-2"
      label="Meal Carbs"
      hint="Carbohydrate intake"
      required
      v-model="currentCarbs"
      type="number"
    >
      <div slot="suffix">g</div>
    </GoInput>

    <hr />

    <GoButton
      variant="primary"
      :disabled="!canCalculate"
      type="button"
      @click="submit"
    >
      Calculate
    </GoButton>

    <GoDialog ref="bolusDialog" heading="Bolus suggestion" persistent>
      <div class="text-center">
        <p>Suggested bolus insulin</p>
        <div
          class="d-flex align-items-center justify-content-center"
          style="gap: 1rem"
          v-if="bolusStore.actualBolus"
        >
          <GoButton
            variant="success"
            icon
            @click="bolusStore.actualBolus--"
            aria-label="Decrease 1 unit"
          >
            <GoIcon name="remove" decorative></GoIcon>
          </GoButton>
          <span class="h1">
            {{ bolusStore.actualBolus }}
          </span>
          <GoButton
            variant="critical"
            icon
            @click="bolusStore.actualBolus++"
            aria-label="Increase 1 unit"
          >
            <GoIcon name="add" decorative></GoIcon>
          </GoButton>
        </div>

        <hr />
        <GoButtonGroup>
          <GoButton block="all" variant="primary" @click="confirmBolus"
            >Confirm</GoButton
          >
          <GoButton block="all" outline @click="closeBolusDialog"
            >Cancel</GoButton
          >
        </GoButtonGroup>
      </div>
    </GoDialog>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store";
import { useBolusStore } from "@/stores/bolus.store";
import { GoInput, GoButton, GoDialog, GoIcon, GoButtonGroup } from "@go-ui/vue";
import dayjs from "dayjs";

const settingsStore = useSettingsStore();
const bolusStore = useBolusStore();
const { settings } = storeToRefs(settingsStore);
const { params, currentBG, currentCarbs, lastBolus } = storeToRefs(bolusStore);

const isCurrentSetting = (
  item: { start: string; end: string; value: string },
  now: dayjs.Dayjs,
  currentDate: string
) => {
  const start = dayjs(`${currentDate} ${item.start}`);
  const end = dayjs(`${currentDate} ${item.end}`);
  return (
    start.isSame(now, "minute") || (start.isBefore(now) && end.isAfter(now))
  );
};

/**
 * get settings for the current time
 */
const currentParams = computed(() => {
  const now = dayjs();
  const currentDate = now.format("YYYY-MM-DD");
  // find the current targetBG
  const currentTargetBG = params.value?.targetBGs?.find((item) =>
    isCurrentSetting(item, now, currentDate)
  );
  const currentICR = params.value?.icrs?.find((item) =>
    isCurrentSetting(item, now, currentDate)
  );
  const currentISF = params.value?.isfs?.find((item) =>
    isCurrentSetting(item, now, currentDate)
  );
  return {
    targetBG: currentTargetBG?.value,
    icr: currentICR?.value,
    isf: currentISF?.value,
  };
});

const canCalculate = computed(() => {
  const { targetBG, icr, isf } = currentParams.value;
  return (
    !isNaN(Number(targetBG)) &&
    !isNaN(Number(icr)) &&
    !isNaN(Number(isf)) &&
    !isNaN(Number(currentBG.value)) &&
    !isNaN(Number(currentCarbs.value))
  );
});

const calculate = async () => {
  // correction bolus + meal bolus - insulin on board
  // TODO also include exercise factor

  const { targetBG, icr, isf } = currentParams.value;

  const correctionBolus =
    (Number(currentBG.value) - Number(targetBG)) / Number(isf);

  const mealBolus = Number(currentCarbs.value) / Number(icr);

  const sumBolus = correctionBolus + mealBolus;

  if (lastBolus.value) {
    // calculate insulin onboard
    const insulinOnBoard = await bolusStore.getInsulinOnBoard();

    return sumBolus - insulinOnBoard;
  }

  return sumBolus;
};

const bolusDialog = ref();

const submit = async () => {
  bolusStore.suggestedBolus = Math.round(await calculate());
  bolusStore.actualBolus = bolusStore.suggestedBolus;
  bolusDialog.value.$el.open();
};

const confirmBolus = async () => {
  // save bolus into history
  const { targetBG, icr, isf } = currentParams.value;
  await bolusStore.saveBolus(targetBG, icr, isf);

  closeBolusDialog();
};

const closeBolusDialog = () => {
  bolusDialog.value.$el.close();
};
</script>
