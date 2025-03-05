export interface CurrencyOptions extends Intl.NumberFormatOptions {
  language?: string;
}

export function currency(
  val: number,
  sign: string,
  decimalPlaces?: number,
  additionalOptions: CurrencyOptions = {},
): string {
  const decimalOpts =
    decimalPlaces !== undefined
      ? {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }
      : {
          minimumFractionDigits: 2,
          maximumFractionDigits: 20,
        };

  const opts: Intl.NumberFormatOptions = {
    style: "currency",
    currency: sign,
    ...decimalOpts,
    ...additionalOptions,
  };

  return val.toLocaleString(additionalOptions.language ?? "en-US", opts);
}
