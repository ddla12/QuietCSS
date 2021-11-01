import { makeSelector, makeStyle, makeCSS } from "../dist";
import { QuietCSSArray } from "../dist/core/@types";

const colors = ["yellow", "blue", "red"],
    colorsOutput = (prop: string, className: string) => {
        return colors.map((color) => `
${className + color} {
    ${prop}: ${color};
}`.trim()).join("\n").trim();
    };

function Color(prop: string, colors: string[], className: string): string {
    const selectors     = makeSelector(colors.map((color) => className + color)) as QuietCSSArray,
        colorsByProp    = colors.map((color) => makeStyle({ [prop]: color }));

    return selectors.applyConcat(colorsByProp);
}

describe("CSS styles are generated", () => {
    const colorUtils = Color("color", colors, ".color-"),
        bgUtils      = Color("background-color", colors, ".bg-");

    const colorOutput   = colorsOutput("color", ".color-"),
        bgOutput        = colorsOutput("background-color", ".bg-");

    test("'color' utilities are generated", () => {
        expect(colorUtils).toStrictEqual(colorOutput);
    });
    test("'background-color' utilities are generated", () => {
        
        expect(bgUtils).toStrictEqual(bgOutput);
    });
});