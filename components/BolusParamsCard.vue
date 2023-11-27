<template>
  <GoCardRow :cols-tablet="1" :cols-desktop="1" :cols-large="1">
    <GoCard
      heading="Current Bolus Parameters"
      sub-heading="Bolus settings applicable currently"
    >
      <dl class="params" v-if="!!activeParams">
        <dt>
          <span>Target BG</span>
        </dt>
        <dd>
          <div>
            <GoButton
              compact
              round
              icon
              @click="setParamOverride('targetBG', -0.1)"
              aria-label="Decrease 0.1"
            >
              <GoIcon name="remove" decorative></GoIcon>
            </GoButton>
            <span>
              <strong>{{ activeParams.targetBG?.value }}</strong> mmol/L
            </span>
            <GoButton
              compact
              round
              icon
              @click="setParamOverride('targetBG', 0.1)"
              aria-label="Increase 0.1"
            >
              <GoIcon name="add" decorative></GoIcon>
            </GoButton>
          </div>
          <time>
            {{ activeParams.targetBG?.start }} -
            {{ activeParams.targetBG?.end }}
          </time>
        </dd>
        <dt>
          <span> Insulin Carb Ratio (ICR) </span>
          <div style="font-weight: normal">
            Affects "meal" bolus calculation, higher = less insulin
          </div>
        </dt>
        <dd>
          <div>
            <GoButton
              compact
              round
              icon
              @click="setParamOverride('icr', -1, 0)"
              aria-label="Decrease 1g"
            >
              <GoIcon name="remove" decorative></GoIcon>
            </GoButton>
            <span>
              1u for <strong>{{ activeParams.icr?.value }}g</strong>
            </span>
            <GoButton
              compact
              round
              icon
              @click="setParamOverride('icr', 1, 0)"
              aria-label="Increase 1g"
            >
              <GoIcon name="add" decorative></GoIcon>
            </GoButton>
          </div>
          <time>
            {{ activeParams.icr?.start }} - {{ activeParams.icr?.end }}
          </time>
        </dd>
        <dt>
          <span> Insulin Sensitivity Factor (ISF) </span>
          <div style="font-weight: normal">
            Affects "correction" bolus calculation, higher = less insulin
          </div>
        </dt>
        <dd>
          <div>
            <GoButton
              compact
              round
              icon
              @click="setParamOverride('isf', -0.1)"
              aria-label="Decrease 0.1"
            >
              <GoIcon name="remove" decorative></GoIcon>
            </GoButton>
            <span>
              1u for <strong>{{ activeParams.isf?.value }}</strong> mmol/L
            </span>
            <GoButton
              compact
              round
              icon
              @click="setParamOverride('isf', 0.1)"
              aria-label="Increase 0.1"
            >
              <GoIcon name="add" decorative></GoIcon>
            </GoButton>
          </div>
          <time>
            {{ activeParams.isf?.start }} - {{ activeParams.isf?.end }}
          </time>
        </dd>
      </dl>
      <div slot="footer">
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
          >
            <GoIcon name="tune" />
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
      if (this.bolusStore.paramOverrides) {
        return {
          ...this.bolusStore.currentParams,
          ...this.bolusStore.paramOverrides,
        };
      }
      return this.bolusStore.currentParams;
    },
    hasDiff() {
      const { targetBG, icr, isf } = this.activeParams;
      const { currentParams } = this.bolusStore;

      return (
        Number(targetBG?.value) !== Number(currentParams.targetBG?.value) ||
        Number(icr?.value) !== Number(currentParams.icr?.value) ||
        Number(isf?.value) !== Number(currentParams.isf?.value)
      );
    },
  },
  async mounted() {
    const settings = await this.settingsStore.loadSettings();
    if (!settings) {
      this.settingsStore.initialiseSettings();
      (this.$refs.settingsDialog as any).$el.open();
    }

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
