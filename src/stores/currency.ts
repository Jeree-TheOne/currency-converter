import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';

import * as CurrencyService from '@/services/currency';
import type { Currency } from '@/types/models/Currency';

export const useCurrencyStore = defineStore('currency', () => {
  CurrencyService.currencies().then((data) => {
    currencies.value = data;
  });

  const currencies = ref<Currency[]>([]);
  const currenciesSelect = computed(() => currencies.value.map(({ code }) => ({ value: code, label: code })));

  const currentCurrency = ref(JSON.parse(localStorage.getItem('localCurrency'))) as Ref<Currency | undefined>;

  const setCurrentCurrency = (code: string) => {
    currentCurrency.value = searchByCode(code);
    localStorage.setItem('localCurrency', JSON.stringify(currentCurrency.value));
  };

  const searchByCode = (code: string): Currency | undefined =>
    currencies.value.find((currency) => currency.code === code);

  return { currencies, currenciesSelect, searchByCode, currentCurrency, setCurrentCurrency };
});
