<template>
  <div class="container mt-4">
    <GoCardRow
      :cols-mobile="1"
      :cols-tablet="1"
      :cols-desktop="3"
      :cols-large="3"
    >
      <GoCard heading="Insulin on board" :key="refreshKey">
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
        <div class="text-center" v-if="totalAffectiveBolus">
          <GoProgress
            :value="bolusStore.currentInsulinOnBoard"
            :max="totalAffectiveBolus"
          />
        </div>

        <div class="text-center text-size-1" slot="footer">
          Insulin on board last until
          <div>
            <strong>{{ insulinLastTill }}</strong>
          </div>
        </div>
      </GoCard>

      <GoCard
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
          <GoButton block="all" @click="openSettingsDialog" variant="secondary">
            <GoIcon name="settings" decorative />
            <span>Settings</span>
          </GoButton>
        </div>
      </GoCard>
    </GoCardRow>

    <BolusParamsCard @open-params-dialog="$emit('open-params-dialog')" />

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
  data() {
    return {
      refreshKey: 0,
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
  async mounted() {
    const settings = await this.settingsStore.loadSettings();
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
