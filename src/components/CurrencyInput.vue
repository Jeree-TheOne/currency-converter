<template>
  <div>
    <div class="currency-input__input-wrapper">
      <input v-bind="$attrs" class="currency-input__input" :value="format(currencyNumber)" @input="onInput" />
    </div>
    <CurrencySelect v-bind="$attrs" v-model="selectedCurrencyCode" class="currency-input__select" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { numberFormatter } from '@/utils/numberFormatter';
import CurrencySelect from './CurrencySelect.vue';
const { parse, format, prepare } = numberFormatter();

const emits = defineEmits<{
  (event: 'change', payload: number): void;
}>();

const currencyNumber = defineModel<string | number>({ default: 0 });
const actualNumber = ref<string | number>(0);

function onInput(a: Event) {
  let { value } = a.target as HTMLInputElement;

  currencyNumber.value = parse(value);
  actualNumber.value = prepare(value);

  emits('change', actualNumber.value);
}

const selectedCurrencyCode = defineModel<string>('currency');
</script>

<style lang="scss">
.currency-input {
  &__input,
  &__select {
    position: relative;
    outline: none;
    border: 1px black solid;
    line-height: 16px;
    font-size: 14px;

    transition: border-color 0.2s ease-in-out;

    &:focus {
      border-color: hsla(160, 100%, 37%, 1);
      z-index: 1;
    }
  }
  &__input {
    text-align: right;
    padding: 2px 4px;

    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;

    &-wrapper {
      display: inline-block;
    }
  }

  &__select {
    margin-left: -1px;

    border-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>
