<template>
  <select v-bind="$attrs" v-model="selectedCurrencyCode" class="currency-select">
    <option value="" disabled selected>Select currency</option>
    <option v-for="{ value, label } in currenciesSelect" :key="value" :value="value">{{ label }}</option>
  </select>
</template>

<script setup lang="ts">
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';

const currencyStore = useCurrencyStore();
const { currenciesSelect } = storeToRefs(currencyStore);

const selectedCurrencyCode = defineModel<string>();
</script>

<style lang="scss">
.currency-select {
  width: 52px;
  position: relative;
  outline: none;
  border: 1px black solid;
  line-height: 16px;
  font-size: 14px;

  height: 22px;

  border-radius: 8px;

  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: hsla(160, 100%, 37%, 1);
    z-index: 1;
  }
}
</style>
