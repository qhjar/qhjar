import { assertEquals } from "jsr:@std/assert";
import { encodeQhjarStr, decodeQhjarStr } from "./qhjar.ts";

// TODO: test encoding and decoding separately
// TODO: test binary things
const testStrings = ["hello, world!", "foobar", "unicode! ☺☻𝄞𝄡"]

Deno.test("qhjar encodes and decodes string", () => {
    for (const i of testStrings) {
        assertEquals(decodeQhjarStr(encodeQhjarStr(i)),i)
    }
})