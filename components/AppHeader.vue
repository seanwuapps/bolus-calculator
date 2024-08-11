<template>
  <GoHeaderBar>
    <div slot="actions">
      <GoButtonGroup>
        <GoButton
          @click="$emit('openCalculatorDialog')"
          variant="primary"
          flat
          icon
          round
          aria-label="Open Bolus Calculator"
        >
          <GoIcon name="calculate" decorative />
        </GoButton>
        <GoButton
          variant="secondary"
          flat
          round
          icon
          aria-label="Settings"
          @click="$emit('openSettingsDialog')"
        >
          <GoIcon name="settings" decorative />
        </GoButton>

        <GoButton
          variant="success"
          flat
          round
          icon
          aria-label="Bolus paramters"
          @click="$emit('openBolusParamsDialog')"
        >
          <GoIcon name="tune" decorative />
        </GoButton>
        <GoButton
          v-if="user"
          id="dd-trigger"
          variant="secondary"
          flat
          aria-label="User menu"
          icon
          round
          outline-fill
        >
          <GoIcon name="person" decorative />
        </GoButton>
        <GoButton
          v-else
          variant="primary"
          flat
          aria-label="Log in"
          icon
          round
          outline-fill
          @click="openLoginModal"
        >
          <GoIcon name="login" decorative />
        </GoButton>
      </GoButtonGroup>

      <GoDropdownMenu
        v-if="user"
        id="dd"
        trigger-selector="#dd-trigger"
        width="20rem"
        persistent
      >
        <GoDropdownItem>
          <GoIcon name="person" class="mr-1" decorative /> {{ user.email }}
        </GoDropdownItem>
        <GoDropdownItem @click="openSyncDataDialog">
          <GoIcon name="backup" decorative /> Backup data
        </GoDropdownItem>
        <GoDropdownSeparator></GoDropdownSeparator>
        <GoDropdownItem @click="signout">
          <GoIcon name="logout" decorative />
          Log out</GoDropdownItem
        >
      </GoDropdownMenu>
    </div>
  </GoHeaderBar>
  <GoDialog ref="loginDialogRef" heading="Login">
    <LoginForm />
  </GoDialog>
  <GoDialog ref="dataSyncDialogRef" heading="Sync data">
    <SyncDataForm class="pt-2" />
  </GoDialog>
</template>
<script lang="ts" setup>
import {
  GoButton,
  GoHeaderBar,
  GoIcon,
  GoButtonGroup,
  GoDropdownMenu,
  GoDropdownSeparator,
  GoDropdownItem,
  GoDialog,
} from "@go-ui/vue";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const loginDialogRef = ref(null);
const dataSyncDialogRef = ref(null);

const openLoginModal = () => {
  (loginDialogRef.value as any).$el.open();
};

const openSyncDataDialog = () => {
  (dataSyncDialogRef.value as any).$el.open();
};

const signout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (e) {
    console.log(e);
  }
};

defineEmits([
  "openCalculatorDialog",
  "openSettingsDialog",
  "openBolusParamsDialog",
]);
</script>
<style>
.custom-item {
  padding: var(--dd-item-padding);
}
</style>
