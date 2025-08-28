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

  return new Intl.NumberFormat(additionalOptions.language ?? "en-US", {
    style: "currency",
    currency: sign,
    ...decimalOpts,
    ...additionalOptions,
  }).format(+val);
}
