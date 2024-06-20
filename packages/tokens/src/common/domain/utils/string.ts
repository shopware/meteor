export function kebabCase(input: string) {
  return input
    .split('/')
    .map((value) => value.toLocaleLowerCase().trim().replaceAll(' ', '-'))
    .join('.');
}
