import { unref, type MaybeRef } from 'vue';

export const numberParser = (locale: string, options?: Intl.NumberFormatOptions) => {
  const parts = new Intl.NumberFormat(locale, options).formatToParts(12345.6);
  const groupSeparator = parts.find((part) => part.type === 'group')?.value ?? ' ';
  const decimalSeparator = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const numerals = [...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)].reverse();
  const index = new Map(numerals.map((d, i) => [d, i]));
  const _group = new RegExp(`[${groupSeparator}]`, 'g');
  const _decimal = new RegExp(`[${decimalSeparator}]`);
  const _numeral = new RegExp(`[${numerals.join('')}]`, 'g');
  const _index = (d: string) => index.get(d)?.toString() as string;

  const parse = (string: string) => {
    const parsedString = string.trim().replace(_group, '').replace(_decimal, '.').replace(_numeral, _index);
    return parsedString ? +string : NaN;
  };

  return {
    parse,
    decimalSeparator,
    groupSeparator,
  };
};

export function normalizeNumber(raw: number | string) {
  if (!raw) return 0;
  return parseFloat(raw as string);
}

export function numberFormatter(params?: { locale?: string; options?: Intl.NumberFormatOptions }) {
  const locale = params?.locale ?? 'ru-RU';
  const options = params?.options ?? {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  };

  const formatter = new Intl.NumberFormat(locale, options);
  const parser = numberParser(locale, options);

  function format(value: MaybeRef<number | string>) {
    const valueTrimmed = unref(value ?? 0)
      .toString()
      .replace(/[^-,\d.]/g, '');

    if (!valueTrimmed.length) return '';

    const sumRightPart = valueTrimmed.includes('.') ? valueTrimmed.split('.')[1] : null;

    if (valueTrimmed.length >= 1 && (valueTrimmed.at(-1) === '.' || (sumRightPart && parseFloat(sumRightPart) === 0))) {
      return `${formatter.format(normalizeNumber(valueTrimmed.slice(0, -1)))}${parser.decimalSeparator}${sumRightPart || ''}`;
    }
    return formatter.format(normalizeNumber(valueTrimmed));
  }

  function parse(sum: MaybeRef<number | string>) {
    // const regex = new RegExp(String.raw`(?<=${parser.decimalSeparator}.*)${parser.decimalSeparator}`, 'g')

    const value = unref(sum)
      .toString()
      .replace(/[^-.,\d]/g, '')
      .replaceAll(parser.decimalSeparator, '.');
    // .replace(regex, '')

    if (!value.length) return '0';
    if (value === `${parser.decimalSeparator}0`) return '0.0';

    const valueRightPart = value.split('.')[1]?.slice(0, options.maximumFractionDigits) ?? '';

    if (isNaN(+value.slice(-1))) return parser.parse(value) + '.';

    if (valueRightPart) {
      return `${value.split('.')[0]}.${valueRightPart}`;
    }

    return `${parser.parse(value)}`;
  }

  function prepare(sum: MaybeRef<number | string | undefined | null>) {
    const value = unref(sum);

    if (value == undefined || value.toString().length === 0) return 0;

    return normalizeNumber(parse(value));
  }

  return {
    format,
    parse,
    prepare,
  };
}
