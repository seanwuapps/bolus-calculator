<template>
  <h1>hello</h1>
  <ClientOnly>
    <GoButton @click="test">TEST</GoButton>
  </ClientOnly>
  <div class="container">
    <GoMd :content="content"></GoMd>
  </div>
</template>

<script setup>
import { GoMd, GoButton } from "@go-ui/vue";
import content from "../README.md?raw";
const test = () => {
  console.log("test");
};
</script>
