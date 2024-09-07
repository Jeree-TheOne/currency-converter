<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import CurrencySelect from './components/CurrencySelect.vue';
import { useCurrencyStore } from './stores/currency';

const currencyStore = useCurrencyStore();
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/convert">Конвертация</RouterLink>
    </nav>
    <div class="header__right">
      Choose your base currency:
      <CurrencySelect
        :model-value="currencyStore.currentCurrency?.code"
        @update:model-value="currencyStore.setCurrentCurrency"
      />
    </div>
  </header>

  <RouterView class="main" />
</template>

<style scoped lang="scss">
.header {
  &__right {
    margin-left: auto;
  }
}

.main {
  padding: 1.5rem 0;
}
</style>
