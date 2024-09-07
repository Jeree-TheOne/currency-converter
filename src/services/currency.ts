import type { LatestRequest, LatestResponse, CurrenciesResponse } from '#/services/currency';

import { api } from './api';

export const latest = async ({ base, symbols }: LatestRequest) => {
  const { data } = await api.get<LatestResponse>('latest', {
    params: {
      base_currency: base,
      currencies: Array.isArray(symbols) ? symbols.join(',') : symbols,
    },
  });
  return data.data;
};

export const currencies = async () => {
  const { data } = await api.get<CurrenciesResponse>('currencies');
  return Object.values(data.data);
};
