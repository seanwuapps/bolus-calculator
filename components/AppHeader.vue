<template>
  <GoHeaderBar>
    <div slot="actions">
      <GoButtonGroup>
        <GoButton
          @click="$emit('openCalculatorDialog')"
          variant="text"
          flat
          icon
          round
          aria-label="Open Bolus Calculator"
        >
          <GoIcon name="calculate" decorative />
        </GoButton>
        <GoButton
          variant="text"
          flat
          round
          icon
          aria-label="Settings"
          @click="$emit('openSettingsDialog')"
        >
          <GoIcon name="settings" decorative />
        </GoButton>

        <GoButton
          variant="text"
          flat
          round
          icon
          aria-label="Bolus paramters"
          @click="$emit('openBolusParamsDialog')"
        >
          <GoIcon name="tune" decorative />
        </GoButton>
        <GoButton
          id="dd-trigger"
          variant="text"
          flat
          aria-label="Bolus Parameters"
          icon
          round
        >
          <GoIcon name="person" decorative />
        </GoButton>
      </GoButtonGroup>

      <!-- <GoDropdownMenu id="dd" trigger-selector="#dd-trigger" width="12rem">
          <GoDropdownSeparator></GoDropdownSeparator>
          <GoDropdownItem>
            <GoIcon name="logout" decorative />
            Log out</GoDropdownItem
          >
        </GoDropdownMenu> -->
    </div>
  </GoHeaderBar>
</template>
<script lang="ts" setup>
import { GoButton, GoHeaderBar, GoIcon, GoButtonGroup } from "@go-ui/vue";
</script>
