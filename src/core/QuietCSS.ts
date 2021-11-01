import { QuietCSSTemplate, StyleMap, Selector, QuietCSSArray, QuietCSSString, CSSVariables, CSSRuleStyles } from "./@types.js";
import { minifyOutput, toDashCase, toCSSBlock, hasEmptyStrings } from "./helpers.js";
import { readFileSync, writeFile } from "fs";

const cssbeautify = require("cssbeautify"),
    options = {
        autosemicolon: true
    };

const ERROR_MESSAGES = {
    emptyString: (method: string) => `Cannot call '${method}' with an empty string`,
    fileExtension: (path: string) => {
        if(!path.endsWith(".css")) {
            throw Error("The file extension must be ends with .css");
        }
    }
};

/**
 * An object that allows you to control and generate CSS rules 
 * @param selector 
 * @returns A proper control to the selectors
 */
const QuietCSS = (selector: Selector[]|Selector): QuietCSSArray|QuietCSSString => ({
    ...(typeof selector === "string") 
        ? ({
            apply(style: StyleMap) {
                if(hasEmptyStrings(style.flat())) {
                    throw new Error(ERROR_MESSAGES.emptyString("apply"));
                }

                return `${selector} {\n${toCSSBlock(style)}\n}`;
            },
        }) : ({
            applyToAll(style: StyleMap) {
                if(hasEmptyStrings(style.flat())) {
                    throw new Error(ERROR_MESSAGES.emptyString("applyToAll"));
                }

                return `${selector.join(", ")} {\n${toCSSBlock(style)}\n}`;
            },
            applyConcat(styles: StyleMap[]) {
                if(hasEmptyStrings(styles.flat(2))) {
                    throw new Error(ERROR_MESSAGES.emptyString("applyConcat"));
                }
        
                return styles
                    .map((style, i) => `${selector[i]} {\n${toCSSBlock(style)}\n}`)
                    .join("\n");
            },
        }),
});

/**
 * Create a QuietCSS instance
 * @param selector 
 * @returns A QuietCSS instance, it allows to create CSS valid code
 */
export function makeSelector(selector: Selector|Selector[]) {
    return QuietCSS(selector);
}

/**
 * Generate a style map, which can be easily manipulated with Array's methods
 * @param properties 
 * @returns A valid style map
 */
export function makeStyle(properties: QuietCSSTemplate, variables?: CSSVariables): StyleMap {
    return [
        ...(variables ? Object.entries(variables).map(([variable, value]) => [`--${toDashCase(variable)}`,value]) : []),
        ...Object.entries(properties)
    ].map(([prop, value]) => [toDashCase(prop), value as string]);
}

/**
 * Generate proper selector by a parent reference
 * @param parent 
 * @param selectors 
 * @returns An array of resolved selectors
 */
export function makeNestedSelector(parent: Selector, selectors: string[]) {
    return QuietCSS(selectors.map((s) => s.replace("&", parent)));
}

/**
 * Concat an array of 'nested' selectors with an array of styles (The first element will be applied to the parent)
 * @param parent 
 * @param nested 
 * @param styles 
 * @returns CSS rules from the parent selector and his 'children' selectors 
 */
export function makeRulesByNesting(parent: Selector, nested: string[], styles: CSSRuleStyles): string {
    nested = [parent, ...nested.map((rule) => rule.replace("&", parent))];

    return nested.map((rule, i) => makeRule(rule, styles[i])).join("\n");
};

/**
 * Generate multiple CSS rules
 * @param selectors 
 * @param styles 
 * @returns CSS rules
 */
export function makeRules(selectors: (Selector|Selector[])[], styles: CSSRuleStyles): string {
    return selectors.map((selector, i) => makeRule(selector, styles[i])).join("");
}

/**
 * Generate a CSS rule
 * @param selector 
 * @param style 
 * @returns A single CSS rule
 */
export function makeRule(selector: Selector|Selector[], style: QuietCSSTemplate|StyleMap): string {
    selector = (typeof selector === "string" ? selector : selector.join(", ")).trim();

    return `${selector} {\n${toCSSBlock((style instanceof Array) ? style : makeStyle(style))}\n}\n`;
}

/**
 * Create a CSS code
 * @param template 
 * @param interpolations 
 * @returns A valid CSS code
 */
export function makeCSS(template: TemplateStringsArray|string, ...interpolations: any[]): string {
    return (typeof template === "string")
        ? template
        : template.map((string, i) => string.trim() + (interpolations[i] || "")).join("\n").trim() + "\n";
}

export function importStyles(path: string): string {
    ERROR_MESSAGES.fileExtension(path);

    return readFileSync(path, "utf8");
}

/**
 * Generate a CSS file
 * @param path The path of the file to be created
 * @param value The CSS code to be written in the file 
 * @param minify Check if the code is readable or not
 */
export function makeCSSOutput(path: string, value: string, minify: boolean = false) {
    ERROR_MESSAGES.fileExtension(path);

    console.time("Output duration");

    value = cssbeautify((minify) ? minifyOutput(value) : value, options);

    if(!minify) console.warn("\nRemember to set minify true if you are ready to production!\n");

    writeFile(path, value, (e) => {
        if(e) throw e;

        console.log("File was created successfully!");
        console.timeEnd("Output duration");
    });
}