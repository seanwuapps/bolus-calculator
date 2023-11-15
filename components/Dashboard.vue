<template>
  <div class="container mt-4">
    <GoCardRow :cols-tablet="2" :cols-desktop="3" :cols-large="3">
      <GoCard
        border
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
          <dd>{{ bolusStore.lastBolus.actualBolus }} u</dd>
        </dl>
      </GoCard>
      <GoCard border heading="Insulin on board">
        <div class="text-center">
          <strong class="text-size-5">
            {{ currentInsulinOnBoard }}
          </strong>
          <span class="text-size-3"> u</span>
        </div>

        <div class="text-center" slot="footer">
          Insulin on board last until <strong>{{ insulinLastTill }}</strong>
        </div>
      </GoCard>
    </GoCardRow>
  </div>
</template>

<script lang="ts">
import { GoCard, GoCardRow, GoProgress } from "@go-ui/vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "Dashboard",
  components: {
    GoCard,
    GoCardRow,
    GoProgress,
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
      currentInsulinOnBoard: 0,
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
  },
  async mounted() {
    await this.bolusStore.loadBolusHistory();
    this.currentInsulinOnBoard = await this.bolusStore.getInsulinOnBoard();

    setInterval(async () => {
      this.currentInsulinOnBoard = await this.bolusStore.getInsulinOnBoard();
    }, 5000);
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
</style>
