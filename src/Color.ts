import { z } from 'zod';

const schema = z.object({
  red: z.number().min(0).max(255),
  green: z.number().min(0).max(255),
  blue: z.number().min(0).max(255),
  alpha: z.number().min(0).max(1).default(1),
});

export class Color {
  constructor(private value: z.infer<typeof schema>) {
    schema.parse(value);
  }

  public static fromRGB(red: number, green: number, blue: number, alpha = 1) {
    return new Color({
      red,
      green,
      blue,
      alpha,
    });
  }

  public toHex() {
    const toHex = (value: number) => {
      const hex = Math.round(value).toString(16);

      return hex.length === 1 ? '0' + hex : hex;
    };

    const hex = [
      toHex(this.value.red),
      toHex(this.value.green),
      toHex(this.value.blue),
    ].join('');

    const containsAlpha = this.value.alpha !== 1;
    return `#${hex}` + (containsAlpha ? toHex(this.value.alpha) : '');
  }
}
