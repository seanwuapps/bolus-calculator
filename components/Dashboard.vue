<template>
  <ClientOnly>
    <div class="container mt-4">
      <GoCardRow
        :cols-mobile="1"
        :cols-tablet="1"
        :cols-desktop="3"
        :cols-large="3"
      >
        <GoCard border heading="Insulin on board">
          <div class="text-center">
            <strong class="text-size-5">
              {{ bolusStore.currentInsulinOnBoard }}
            </strong>
            <span class="text-size-3"> u</span>
            <p>
              Out of the {{ bolusStore.activeInsulinRecords.length }} bolus{{
                bolusStore.activeInsulinRecords.length === 1 ? "" : "es"
              }}
              in the last {{ settings?.insulinDuration }} hours
            </p>
          </div>
          <div class="text-center">
            <GoProgress
              :value="bolusStore.currentInsulinOnBoard"
              :max="totalAffectiveBolus"
            />
          </div>

          <div class="text-center" slot="footer">
            <div v-if="totalAffectiveBolus">
              Insulin on board last until
              <div class="text-size-1">
                <strong>{{ insulinLastTill }}</strong>
              </div>
            </div>

            <GoButtonGroup
              class="calculator-button-group"
              block="all"
              connected
            >
              <GoButton
                block="all"
                variant="secondary"
                outline
                round
                @click="refresh"
                :disabled="countDown < 4 || countDown > 28"
              >
                <GoIcon name="refresh" decorative slot="prefix"></GoIcon>
                <span>{{ countDown }}</span>
              </GoButton>

              <GoButton
                block="all"
                variant="primary"
                round
                @click="$emit('openCalculatorDialog')"
              >
                <GoIcon name="calculate" decorative slot="prefix"></GoIcon>
              </GoButton>
            </GoButtonGroup>
          </div>
        </GoCard>

        <GoCard
          border
          heading="Last Bolus"
          :sub-heading="bolusStore.lastBolusTimeDisplay"
        >
          <dl v-if="bolusStore.lastBolus">
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
          <p v-else>No bolus recorded.</p>
        </GoCard>
        <GoCard border heading="Settings">
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
              @click="$emit('open-settings')"
              variant="secondary"
              round
            >
              <GoIcon name="settings" decorative slot="prefix" />
              <span>Settings</span>
            </GoButton>
          </div>
        </GoCard>
      </GoCardRow>

      <BolusParamsCard @open-params-dialog="$emit('open-params-dialog')" />
    </div>
  </ClientOnly>
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
  emits: ["open-settings", "open-params-dialog", "openCalculatorDialog"],
  setup() {
    const settingsStore = useSettingsStore();
    const bolusStore = useBolusStore();

    return {
      bolusStore,
      settingsStore,
    };
  },
  data() {
    return {
      countDown: 30,
      countDownTimer: null as any,
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
  },
  mounted() {
    this.countDownTimer = setInterval(() => {
      this.countDown--;
    }, 1000);
    setInterval(() => {
      this.refresh();
    }, 30000);
  },
  methods: {
    async refresh() {
      //reset countdown
      this.countDown = 30;
      await this.bolusStore.loadBolusHistory();
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
}

ul.params {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}

.calculator-button-group {
  margin-top: 1rem;
  > * {
    flex: 1;
  }
}
</style>
