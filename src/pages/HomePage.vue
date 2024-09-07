<template>
  <div>
    <div v-for="[code, price] in currencyRates" :key="code">
      {{ `1 ${code} = ${format(parse(1 / price))} ${currencyStore.currentCurrency?.code}` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrencyStore } from '@/stores/currency';
import { onMounted, ref } from 'vue';

import * as CurrencyService from '@/services/currency';
import { numberFormatter } from '@/utils/numberFormatter';

const { parse, format } = numberFormatter();

const currencyStore = useCurrencyStore();

const currencyRates = ref<[string, number][]>([]);

onMounted(async () => {
  if (!currencyStore.currentCurrency?.code) return;

  const data = await CurrencyService.latest({
    base: currencyStore.currentCurrency.code,
    symbols: ['USD', 'EUR', 'GBP', 'RUB'].filter((code) => code !== currencyStore.currentCurrency?.code),
  });
  currencyRates.value = Object.entries(data);
});
</script>
