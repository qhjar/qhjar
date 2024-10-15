const txtenc = new TextEncoder();
const txtdec = new TextDecoder();
export const encodeQhjar = function (data: Uint8Array): string {
  let binary = "";

  for (const byte of data) {
    binary += byte.toString(2).padStart(8, "0");
  }

  let result = "";

  while (binary.length >= 4) {
    if (binary.length >= 12) {
      const chunk = binary.slice(0, 12);
      binary = binary.slice(12);
      result += String.fromCodePoint(0xE0000 + parseInt(chunk, 2));
    } else {
      const chunk = binary.slice(0, 4);
      binary = binary.slice(4);
      result += String.fromCodePoint(0xFE00 + parseInt(chunk, 2));
    }
  }
  return result;
};
export const decodeQhjar = function (str: string): Uint8Array {
  let binary = "";

  for (const char of str) {
    const codepoint = char.codePointAt(0) ?? 0;
    if (codepoint >= 0xE0000 && codepoint <= 0xE0FFF) {
      const value = codepoint - 0xE0000;
      binary += value.toString(2).padStart(12, "0");
    }
    if (codepoint >= 0xFE00 && codepoint <= 0xFE0F) {
      const value = codepoint - 0xFE00;
      binary += value.toString(2).padStart(4, "0");
    }
  }

  const data = [];

  while (binary.length >= 8) {
    data.push(parseInt(binary.slice(0, 8), 2));
    binary = binary.slice(8);
  }
  return new Uint8Array(data);
};
export const encodeQhjarStr = function (str: string): string {
  return encodeQhjar(txtenc.encode(str));
};
export const decodeQhjarStr = function (str: string): string {
  return txtdec.decode(decodeQhjar(str));
};
