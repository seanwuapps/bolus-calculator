<template>
  <div v-if="settings">
    <div v-if="!showBolusResult">
      <GoInput
        class="mb-2"
        label="Current BG"
        hint="Current blood glucose level"
        required
        v-model="currentBG"
        :disabled="showBolusResult"
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
        :disabled="showBolusResult"
      >
        <div slot="suffix">g</div>
      </GoInput>

      <hr />

      <GoButtonGroup>
        <GoButton
          variant="primary"
          :disabled="!canCalculate"
          type="button"
          @click="submit"
        >
          Calculate
        </GoButton>

        <!-- cancel button emits close event -->
        <GoButton flat variant="text" type="button" @click="$emit('close')">
          Cancel
        </GoButton>
      </GoButtonGroup>
    </div>
    <div v-else>
      <div class="text-center">
        <div
          class="d-flex align-items-center justify-content-center"
          style="gap: 1rem"
          v-if="typeof actualBolus !== 'undefined'"
        >
          <GoButton
            variant="success"
            icon
            @click="actualBolus--"
            aria-label="Decrease 1 unit"
          >
            <GoIcon name="remove" decorative></GoIcon>
          </GoButton>
          <span class="h1" :class="isOverMaxSuggestion ? `text-red` : ''">
            {{ actualBolus }}<span class="text-size-2">u</span>
          </span>
          <GoButton
            variant="critical"
            icon
            @click="actualBolus++"
            aria-label="Increase 1 unit"
          >
            <GoIcon name="add" decorative></GoIcon>
          </GoButton>
        </div>

        <p class="text-red" v-if="isOverMaxSuggestion">
          Warning! This bolus is over the maximum suggested bolus of
          {{ settings.maxBolus }}u.
        </p>

        <GoAccordion>
          <GoAccordionItem
            :heading="`ℹ️ Suggested bolus: ${bolusStore.suggestedBolus}`"
          >
            <div class="my-2">
              <div>
                Correction bolus <strong>({{ correctionBolus }})</strong>
              </div>
              <div>
                + Meal bolus <strong>({{ mealBolus }})</strong>
              </div>
              <div>
                - Insulin On Board <strong>({{ insulinOnBoard }})</strong>
              </div>
              <hr />
              <div class="h6">
                = Suggested bolus
                <strong>({{ bolusStore.suggestedBolus }})</strong>
              </div>
            </div>
          </GoAccordionItem>
        </GoAccordion>
        <hr />
        <GoButtonGroup>
          <GoButton block="all" variant="primary" @click="confirmBolus">
            Confirm
          </GoButton>
          <GoButton block="all" outline @click="showBolusResult = false">
            Back
          </GoButton>
        </GoButtonGroup>
      </div>
    </div>
  </div>
  <div v-else>Settings not found.</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store";
import { useBolusStore } from "@/stores/bolus.store";
import {
  GoInput,
  GoButton,
  GoDialog,
  GoIcon,
  GoButtonGroup,
  GoTooltip,
  GoAccordion,
  GoAccordionItem,
} from "@go-ui/vue";
import dayjs from "dayjs";

const settingsStore = useSettingsStore();
const bolusStore = useBolusStore();
const { settings } = storeToRefs(settingsStore);
const { params, currentBG, currentCarbs, lastBolus, actualBolus } =
  storeToRefs(bolusStore);

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

const getCorrectionBolus = () => {
  const { targetBG, isf } = currentParams.value;
  const result = (Number(currentBG.value) - Number(targetBG)) / Number(isf);
  return Number(result.toFixed(2));
};

const getMealBolus = () => {
  const { icr } = currentParams.value;
  const result = Number(currentCarbs.value) / Number(icr);
  return Number(result.toFixed(2));
};

const insulinOnBoard = ref(0);
const correctionBolus = ref(0);
const mealBolus = ref(0);

const calculate = async () => {
  // correction bolus + meal bolus - insulin on board
  // TODO also include exercise factor
  correctionBolus.value = getCorrectionBolus();

  mealBolus.value = getMealBolus();

  const sumBolus = correctionBolus.value + mealBolus.value;

  if (lastBolus.value) {
    // calculate insulin onboard
    insulinOnBoard.value = Number(
      (await bolusStore.getInsulinOnBoard()).toFixed(2)
    );

    return sumBolus - insulinOnBoard.value;
  }

  return sumBolus;
};

const showBolusResult = ref(false);

const submit = async () => {
  let suggestion = Number((await calculate()).toFixed(2));
  if (suggestion < 0) {
    suggestion = 0;
  }
  bolusStore.suggestedBolus = suggestion;
  bolusStore.actualBolus = Math.round(suggestion);
  showBolusResult.value = true;
};

const emit = defineEmits(["close"]);

const confirmBolus = async () => {
  // save bolus into history
  const { targetBG, icr, isf } = currentParams.value;
  await bolusStore.saveBolus(targetBG, icr, isf);

  // reset display condition
  showBolusResult.value = false;

  // close dialog
  emit("close");
};

const isOverMaxSuggestion = computed(() => {
  if (!actualBolus.value || !settings.value?.maxBolus) {
    return false;
  }

  return actualBolus.value > Number(settings.value.maxBolus);
});
</script>

<style lang="scss">
.text-red {
  color: var(--go-color-critical-600);
}
</style>
