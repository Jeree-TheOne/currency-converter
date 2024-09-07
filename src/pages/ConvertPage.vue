<template>
  <div>
    <CurrencyInput v-model="currencies.base.amount" v-model:currency="currencies.base.currency" />
    =
    <CurrencyInput v-model="currencies.symbol.amount" v-model:currency="currencies.symbol.currency" />
  </div>
</template>

<script setup lang="ts">
import CurrencyInput from '@/components/CurrencyInput.vue';
import * as CurrencyService from '@/services/currency';
import { useCurrencyStore } from '@/stores/currency';
import { onMounted, reactive, ref, watch } from 'vue';

const currencyStore = useCurrencyStore();

const currencies = reactive({
  base: {
    currency: currencyStore.currentCurrency?.code ?? '',
    amount: 1,
  },
  symbol: {
    currency: '',
    amount: 0,
  },
});

watch(
  () => [currencyStore.currencies],
  () => {
    if (!currencyStore.currencies.length) return;
    const filteredCurrencies = currencyStore.currencies.filter((el) => el.code !== currencies.base.currency);
    currencies.symbol.currency = filteredCurrencies[Math.floor(Math.random() * filteredCurrencies.length)].code;
  }
);

onMounted(() => {
  if (!currencyStore.currencies.length) return;

  const filteredCurrencies = currencyStore.currencies.filter((el) => el.code !== currencies.base.currency);
  currencies.symbol.currency = filteredCurrencies[Math.floor(Math.random() * filteredCurrencies.length)].code;
});

watch(
  () => currencies.base.currency,
  (newBase, oldBase) => {
    if (newBase === currencies.symbol.currency) currencies.symbol.currency = oldBase;
  }
);

watch(
  () => currencies.symbol.currency,
  (newSymbol, oldSymbol) => {
    if (newSymbol === currencies.base.currency) currencies.base.currency = oldSymbol;
  }
);

const currentRate = ref<number>();

watch(
  () => [currencies.base.currency, currencies.symbol.currency],
  async () => {
    if (!currencies.base.currency || !currencies.symbol.currency) return;
    const data = await CurrencyService.latest({ base: currencies.base.currency, symbols: currencies.symbol.currency });
    currentRate.value = data[currencies.symbol.currency];
    currencies.symbol.amount = currentRate.value * currencies.base.amount;
  }
);

watch(
  () => currencies.base.amount,
  () => {
    if (!currentRate.value) return;
    currencies.symbol.amount = currencies.base.amount * currentRate.value;
  }
);

watch(
  () => currencies.symbol.amount,
  () => {
    if (!currentRate.value) return;
    currencies.base.amount = currencies.symbol.amount / currentRate.value;
  }
);
</script>

<style scoped></style>
