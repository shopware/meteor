declare module 'diff' {
  export function createTwoFilesPatch(
    oldFilename: string,
    newFilename: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: { context?: number }
  ): string;
}


