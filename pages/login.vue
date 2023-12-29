<template>
  <ClientOnly>
    <GoCenter height="100svh">
      <GoCard heading="Login">
        <GoInput v-model="email" label="Email" />
        <GoInput v-model="password" type="password" label="Password" />

        <GoButtonGroup>
          <GoButton :loading="loading" variant="primary" @click="signIn">
            Login
          </GoButton>
        </GoButtonGroup>
      </GoCard>
    </GoCenter>
  </ClientOnly>
</template>

<script setup lang="ts">
import { GoCenter, GoCard, GoInput, GoButton, GoButtonGroup } from "@go-ui/vue";
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

watchEffect(() => {
  if (user.value) {
    console.log(user.value);
    router.replace("/");
  }
});

const signIn = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
};
</script>
