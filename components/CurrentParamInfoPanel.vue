<template>
  <GoAccordion>
    <GoAccordionItem>
      <div slot="heading">
        <GoIcon name="info_outline" decorative />
        Current Parameters
      </div>
      <BolusParamsCard readonly />
    </GoAccordionItem>
  </GoAccordion>
</template>

<script setup lang="ts">
import { GoAccordion, GoAccordionItem, GoIcon } from "@go-ui/vue";
const isShowingCurrentParams = ref(false);
const { getCurrentParams } = useBolusStore();
</script>
