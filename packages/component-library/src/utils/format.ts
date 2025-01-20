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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
  return val.toLocaleString(additionalOptions.language ?? "en-US", opts);
}
