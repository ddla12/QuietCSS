import { StyleMap } from "./@types";

/**
 * Convert a capitalize property to dash case, for example 'paddingTop' to 'padding-top'
 * @param string 
 * @returns A valid CSS property
 */
export const toDashCase = (string: string): string => [...string]
    .map((letter) => (!(/\W/.test(letter)) && (letter === letter.toUpperCase())) ? ("-" + letter) : letter)
    .join("")
    .toLowerCase();

/**
 * Check if there is an string is empty or if an array has a empty string
 * @param value 
 * @returns If there is an empty string
 */
export const hasEmptyStrings = (value: string|string[]): boolean => (value instanceof Array)
    ? !(value.filter(Boolean).length === value.length)
    : !(value);

/**
 * Add indentation to a CSS rule
 * @param string 
 * @returns A readable CSS rule
 */

/**
 * Converts a key/value pair to a CSS declaration
 * @param value A key/value array, CSS property and value
 * @returns A raw CSS declaration
 */
export const cssProperty = ([prop, value]: string[]) => `${toDashCase(prop)}: ${value.toString().trim()};`;

/**
 * Create a CSS block
 * @param map 
 * @returns A CSS block (rule)
 */
export const toCSSBlock = (map: StyleMap) => map.map(cssProperty).join("\n").trimEnd();

/**
 * Minify a CSS input
 * @param value 
 * @returns A minified CSS
 */
export const minifyOutput = (value: string): string => value.split("\n")
    .filter(Boolean)
    .map((v) => v.trim().replace(" {", "{").split(":").map((s) => s.trim()).join(":"))
    .join("");