"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCSSOutput = exports.importStyles = exports.makeCSS = exports.makeRule = exports.makeRules = exports.makeRulesByNesting = exports.makeNestedSelector = exports.makeStyle = exports.makeSelector = void 0;
const helpers_js_1 = require("./helpers.js");
const fs_1 = require("fs");
const cssbeautify = require("cssbeautify"), options = {
    autosemicolon: true
};
const ERROR_MESSAGES = {
    emptyString: (method) => `Cannot call '${method}' with an empty string`,
    fileExtension: (path) => {
        if (!path.endsWith(".css")) {
            throw Error("The file extension must be ends with .css");
        }
    }
};
const QuietCSS = (selector) => ({
    ...(typeof selector === "string")
        ? ({
            apply(style) {
                if ((0, helpers_js_1.hasEmptyStrings)(style.flat())) {
                    throw new Error(ERROR_MESSAGES.emptyString("apply"));
                }
                return `${selector} {\n${(0, helpers_js_1.toCSSBlock)(style)}\n}`;
            },
        }) : ({
        applyToAll(style) {
            if ((0, helpers_js_1.hasEmptyStrings)(style.flat())) {
                throw new Error(ERROR_MESSAGES.emptyString("applyToAll"));
            }
            return `${selector.join(", ")} {\n${(0, helpers_js_1.toCSSBlock)(style)}\n}`;
        },
        applyConcat(styles) {
            if ((0, helpers_js_1.hasEmptyStrings)(styles.flat(2))) {
                throw new Error(ERROR_MESSAGES.emptyString("applyConcat"));
            }
            return styles
                .map((style, i) => `${selector[i]} {\n${(0, helpers_js_1.toCSSBlock)(style)}\n}`)
                .join("\n");
        },
    }),
});
function makeSelector(selector) {
    return QuietCSS(selector);
}
exports.makeSelector = makeSelector;
function makeStyle(properties, variables) {
    return [
        ...(variables ? Object.entries(variables).map(([variable, value]) => [`--${(0, helpers_js_1.toDashCase)(variable)}`, value]) : []),
        ...Object.entries(properties)
    ].map(([prop, value]) => [(0, helpers_js_1.toDashCase)(prop), value]);
}
exports.makeStyle = makeStyle;
function makeNestedSelector(parent, selectors) {
    return QuietCSS(selectors.map((s) => s.replace("&", parent)));
}
exports.makeNestedSelector = makeNestedSelector;
function makeRulesByNesting(parent, nested, styles) {
    nested = [parent, ...nested.map((rule) => rule.replace("&", parent))];
    return nested.map((rule, i) => makeRule(rule, styles[i])).join("\n");
}
exports.makeRulesByNesting = makeRulesByNesting;
;
function makeRules(selectors, styles) {
    return selectors.map((selector, i) => makeRule(selector, styles[i])).join("");
}
exports.makeRules = makeRules;
function makeRule(selector, style) {
    selector = (typeof selector === "string" ? selector : selector.join(", ")).trim();
    return `${selector} {\n${(0, helpers_js_1.toCSSBlock)((style instanceof Array) ? style : makeStyle(style))}\n}\n`;
}
exports.makeRule = makeRule;
function makeCSS(template, ...interpolations) {
    return (typeof template === "string")
        ? template
        : template.map((string, i) => string.trim() + (interpolations[i] || "")).join("\n").trim() + "\n";
}
exports.makeCSS = makeCSS;
function importStyles(path) {
    ERROR_MESSAGES.fileExtension(path);
    return (0, fs_1.readFileSync)(path, "utf8");
}
exports.importStyles = importStyles;
function makeCSSOutput(path, value, minify = false) {
    ERROR_MESSAGES.fileExtension(path);
    console.time("Output duration");
    value = cssbeautify((minify) ? (0, helpers_js_1.minifyOutput)(value) : value, options);
    if (!minify)
        console.warn("\nRemember to set minify true if you are ready to production!\n");
    (0, fs_1.writeFile)(path, value, (e) => {
        if (e)
            throw e;
        console.log("File was created successfully!");
        console.timeEnd("Output duration");
    });
}
exports.makeCSSOutput = makeCSSOutput;
