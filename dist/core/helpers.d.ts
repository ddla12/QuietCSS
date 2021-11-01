import { StyleMap } from "./@types";
export declare const toDashCase: (string: string) => string;
export declare const hasEmptyStrings: (value: string | string[]) => boolean;
export declare const cssProperty: ([prop, value]: string[]) => string;
export declare const toCSSBlock: (map: StyleMap) => string;
export declare const minifyOutput: (value: string) => string;
