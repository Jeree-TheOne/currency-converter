import type { Currency } from '#/models/Currency';
import type { DataItem } from '#/utility-types';

export type LatestRequest = { base: string; symbols: string | string[] };
export type LatestResponse = DataItem<Record<string, number>>;

export type CurrenciesResponse = DataItem<Record<string, Currency>>;
