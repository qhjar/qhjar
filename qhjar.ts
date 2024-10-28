const txtenc = new TextEncoder();
const txtdec = new TextDecoder();
const enum State {
  NewChunk,
  TwoChunk,
  OneChunk
}

export const encodeQhjar = function(data: Uint8Array): string {
  let result = "";
  let state = State.NewChunk;
  let chunk = 0;
  const final = data.at(-1) ?? 0;
  const length = data.length - 1;
  for (let i = 0; i < length; i++) {
    const byte = data[i]
    switch(state) {
      case State.NewChunk:
        chunk = byte << 4;
        state = State.TwoChunk;
        break;
      case State.TwoChunk:
        result += String.fromCodePoint(0xE0000 + chunk + (byte >> 4))
        chunk = (byte & 0b1111) << 8;
        state = State.OneChunk;
        break;
      case State.OneChunk:
        result += String.fromCodePoint(0xE0000 + chunk + byte)
        state = State.NewChunk;
        break;
    }
  }
  switch(state) {
    case State.NewChunk:
      result += String.fromCodePoint(0xFE00 + (final >> 4)) + String.fromCodePoint(0xFE00 + (final & 0b1111));
      break;
    case State.TwoChunk:
      result += String.fromCodePoint(0xE0000 + chunk + (final >> 4)) + String.fromCodePoint(0xFE00 + (final & 0b1111))
      break;
    case State.OneChunk:
      result += String.fromCodePoint(0xE0000 + chunk + final)
      break;
  }

  return result;
}

// rewrite this
export const decodeQhjar = function (str: string): Uint8Array {
  let binary = "";

  for (const char of str) {
    const codepoint = char.codePointAt(0)!;
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
