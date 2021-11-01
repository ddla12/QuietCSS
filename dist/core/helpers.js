"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minifyOutput = exports.toCSSBlock = exports.cssProperty = exports.hasEmptyStrings = exports.toDashCase = void 0;
const cssbeautify = require("cssbeautify"), options = {
    autosemicolon: true
};
const toDashCase = (string) => [...string]
    .map((letter) => (!(/\W/.test(letter)) && (letter === letter.toUpperCase())) ? ("-" + letter) : letter)
    .join("")
    .toLowerCase();
exports.toDashCase = toDashCase;
const hasEmptyStrings = (value) => (value instanceof Array)
    ? !(value.filter(Boolean).length === value.length)
    : !(value);
exports.hasEmptyStrings = hasEmptyStrings;
const cssProperty = ([prop, value]) => `${(0, exports.toDashCase)(prop)}: ${value.toString().trim()};`;
exports.cssProperty = cssProperty;
const toCSSBlock = (map) => cssbeautify(map.map(exports.cssProperty).join("\n").trimEnd, options);
exports.toCSSBlock = toCSSBlock;
const minifyOutput = (value) => value.split("\n")
    .filter(Boolean)
    .map((v) => v.trim().replace(" {", "{").split(":").map((s) => s.trim()).join(":"))
    .join("");
exports.minifyOutput = minifyOutput;
