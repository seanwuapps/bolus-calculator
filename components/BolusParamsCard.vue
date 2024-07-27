<template>
  <GoCardRow :cols-tablet="1" :cols-desktop="1" :cols-large="1">
    <GoCard
      border
      heading="Current Bolus Parameters"
      sub-heading="Bolus settings applicable currently"
    >
      <ul class="params" v-if="!!activeParams">
        <ParamItem
          label="Target BG"
          :value="`${activeParams.targetBG?.value} mmol/L`"
          :editable="!readonly"
          :timeStart="activeParams.targetBG?.start"
          :timeEnd="activeParams.targetBG?.end"
          @increase="setParamOverride('targetBG', 0.1)"
          @decrease="setParamOverride('targetBG', -0.1)"
        />
        <ParamItem
          v-if="activeParams.icr?.value"
          label="Insulin Carb Ratio (ICR)"
          description="Affects 'meal' bolus calculation, higher = less insulin"
          :value="`1u for ${activeParams.icr?.value}g`"
          :editable="!readonly"
          :timeStart="activeParams.icr?.start"
          :timeEnd="activeParams.icr?.end"
          @increase="setParamOverride('icr', 1, 0)"
          @decrease="setParamOverride('icr', -1, 0)"
        />
        <ParamItem
          v-if="activeParams.isf?.value"
          label="Insulin Sensitivity Factor (ISF)"
          description="Affects 'correction' bolus calculation, higher = less insulin"
          :value="`1u for ${activeParams.isf?.value} mmol/L`"
          :editable="!readonly"
          :timeStart="activeParams.isf?.start"
          :timeEnd="activeParams.isf?.end"
          @increase="setParamOverride('isf', 0.1)"
          @decrease="setParamOverride('isf', -0.1)"
        />
      </ul>
      <div slot="footer" v-if="!readonly">
        <GoButtonGroup>
          <GoButton
            block="tablet"
            variant="primary"
            v-if="hasDiff"
            @click="openQuickSaveDialog"
          >
            <span>Quick save</span>
          </GoButton>
          <GoButton
            block="tablet"
            @click="$emit('open-params-dialog')"
            variant="success"
            round
          >
            <GoIcon name="tune" decorative slot="prefix" />
            <span>Bolus Parameters</span>
          </GoButton>
        </GoButtonGroup>
      </div>
    </GoCard>
  </GoCardRow>
  <!-- quickSaveDialog -->
  <GoDialog ref="quickSaveDialog" heading="Quick save">
    <BolusParamsQuickSaveForm @close="closeQuickSaveDialog" />
  </GoDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  GoCard,
  GoButton,
  GoCardRow,
  GoProgress,
  GoDialog,
  GoIcon,
  GoButtonGroup,
} from "@go-ui/vue";

export default defineComponent({
  emits: ["open-params-dialog"],
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const settingsStore = useSettingsStore();
    const bolusStore = useBolusStore();
    return {
      bolusStore,
      settingsStore,
    };
  },
  components: {
    GoCard,
    GoButton,
    GoCardRow,
    GoProgress,
    GoDialog,
    GoIcon,
    GoButtonGroup,
  },
  computed: {
    activeParams() {
      const currentParams = this.bolusStore.getCurrentParams();
      if (this.bolusStore.paramOverrides) {
        return {
          ...currentParams,
          ...this.bolusStore.paramOverrides,
        };
      }
      return currentParams;
    },
    hasDiff() {
      const { targetBG, icr, isf } = this.activeParams;
      const currentParams = this.bolusStore.getCurrentParams();

      return (
        Number(targetBG?.value) !== Number(currentParams.targetBG?.value) ||
        Number(icr?.value) !== Number(currentParams.icr?.value) ||
        Number(isf?.value) !== Number(currentParams.isf?.value)
      );
    },
  },
  async mounted() {
    await this.bolusStore.loadBolusHistory();
  },
  methods: {
    setParamOverride(
      type: "targetBG" | "icr" | "isf",
      amount: number,
      decimals = 1
    ) {
      const currentValue = this.activeParams[type];

      if (!currentValue) {
        return;
      }

      const newValue = (Number(currentValue.value) + amount).toFixed(decimals);
      if (!this.bolusStore.paramOverrides) {
        this.bolusStore.paramOverrides = {
          [type]: {
            start: currentValue.start,
            end: currentValue.end,
            value: String(newValue),
          },
        };
        return;
      }

      this.bolusStore.paramOverrides[type] = {
        start: currentValue.start,
        end: currentValue.end,
        value: String(newValue),
      };
    },
    openQuickSaveDialog() {
      (this.$refs.quickSaveDialog as any).$el.open();
    },
    closeQuickSaveDialog() {
      (this.$refs.quickSaveDialog as any).$el.close();
    },
  },
});
</script>
