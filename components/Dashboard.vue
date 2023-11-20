<template>
  <div class="container mt-4">
    <GoCardRow :cols-tablet="2" :cols-desktop="3" :cols-large="3">
      <GoCard heading="Insulin on board">
        <div class="text-center">
          <strong class="text-size-5">
            {{ bolusStore.currentInsulinOnBoard }}
          </strong>
          <span class="text-size-3"> u</span>
          <p>
            Out of the {{ bolusStore.activeInsulinRecords.length }} boluses in
            the last {{ settings?.insulinDuration }} hours
          </p>
        </div>

        <div class="text-center" v-if="totalAffectiveBolus">
          <GoProgress
            :value="bolusStore.currentInsulinOnBoard"
            :max="totalAffectiveBolus"
          />
        </div>

        <div class="text-center" slot="footer">
          Insulin on board last until
          <div>
            <strong>{{ insulinLastTill }}</strong>
          </div>
        </div>
      </GoCard>

      <GoCard
        heading="Last Bolus"
        v-if="bolusStore.lastBolus"
        :sub-heading="bolusStore.lastBolusTimeDisplay"
      >
        <dl>
          <dt class="mr-2">Glucose</dt>
          <dd>{{ bolusStore.lastBolus.bg }} mmol/L</dd>
          <dt class="mr-2">Meal Carbs</dt>
          <dd>{{ bolusStore.lastBolus.carbs }} g</dd>
          <dt class="mr-2">Suggested Bolus</dt>
          <dd>{{ bolusStore.lastBolus.suggestedBolus }} u</dd>
          <dt class="mr-2">Actual Bolus</dt>
          <dd>
            <strong class="text-size-2"
              >{{ bolusStore.lastBolus.actualBolus }} u</strong
            >
          </dd>
        </dl>
      </GoCard>
      <GoCard heading="Settings">
        <dl v-if="!!settings">
          <dt class="mr-2">Min. glucose for calculation</dt>
          <dd>{{ settings.minBG }} mmol/L</dd>
          <dt class="mr-2">Max. bolus suggestion</dt>
          <dd>{{ settings.maxBolus }} mmol/L</dd>
          <dt class="mr-2">Insulin duration</dt>
          <dd>{{ settings.insulinDuration }} hours</dd>
        </dl>
        <p v-else>
          No settings found. Click the button below to configure them.
        </p>
        <div slot="footer">
          <GoButton
            block="all"
            @click="openSettingsDialog"
            round
            variant="secondary"
          >
            <GoIcon name="settings" decorative />
            <span>Settings</span>
          </GoButton>
        </div>
      </GoCard>
    </GoCardRow>

    <GoCardRow :cols-tablet="1" :cols-desktop="1" :cols-large="2">
      <GoCard
        heading="Current Bolus Parameters"
        sub-heading="Bolus settings applicable at the moment"
      >
        <pre>{{ activeParams }}</pre>
        <pre>{{ bolusStore.currentParams }}</pre>
        <pre>{{ bolusStore.paramOverrides }}</pre>
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
            <GoButton block="all" round variant="primary" v-if="hasDiff">
              <span>Quick save</span>
            </GoButton>
            <GoButton
              block="all"
              @click="$emit('open-params-dialog')"
              round
              variant="success"
            >
              <span>Change Parameters</span>
            </GoButton>
          </GoButtonGroup>
        </div>
      </GoCard>
    </GoCardRow>

    <GoDialog ref="settingsDialog" persistent heading="Settings">
      <SettingsForm @close="closeSettingsDialog" />
    </GoDialog>
  </div>
</template>

<script lang="ts">
import {
  GoCard,
  GoButton,
  GoCardRow,
  GoProgress,
  GoDialog,
  GoIcon,
  GoButtonGroup,
} from "@go-ui/vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "Dashboard",
  components: {
    GoCard,
    GoButton,
    GoCardRow,
    GoProgress,
    GoDialog,
    GoIcon,
    GoButtonGroup,
  },
  setup() {
    const settingsStore = useSettingsStore();
    const bolusStore = useBolusStore();
    return {
      bolusStore,
      settingsStore,
    };
  },
  computed: {
    insulinLastTill() {
      if (!this.bolusStore.lastBolus || !this.settingsStore.settings) {
        return null;
      }
      const { ts } = this.bolusStore.lastBolus;
      const { insulinDuration } = this.settingsStore.settings;
      return dayjs(ts)
        .add(Number(insulinDuration), "hours")
        .format("HH:mm, MMM DD");
    },
    settings() {
      return this.settingsStore.settings;
    },
    totalAffectiveBolus() {
      return this.bolusStore.activeInsulinRecords.reduce((accu, curr) => {
        return accu + Number(curr.actualBolus);
      }, 0);
    },

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
    const settings = await this.settingsStore.getSettings();
    if (!settings) {
      this.settingsStore.initialiseSettings();
      (this.$refs.settingsDialog as any).$el.open();
    }

    await this.bolusStore.loadBolusHistory();
  },
  methods: {
    openSettingsDialog() {
      (this.$refs.settingsDialog as any).$el.open();
    },
    closeSettingsDialog() {
      (this.$refs.settingsDialog as any).$el.close();
    },
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
  },
});
</script>

<style lang="scss">
dl {
  dt {
    font-weight: bold;
  }
  dd {
    margin: 0;
    margin-bottom: 1rem;
  }
  &.params {
    dd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row-reverse;
      > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      > time {
        font-size: 1.5rem;
      }
    }
  }
}
</style>
