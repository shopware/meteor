import punycode from "punycode/";

export default function (value: string) {
  if (!value) {
    return "";
  }

  const unicode = punycode.toUnicode(value);

  return decodeURI(unicode);
}
