const { makeCSSOutput, makeCSS, makeSelector, makeStyle } = require("../dist/index");

//Some random colors
const COLORS = ["red", "green", "black", "white", "blue", "brown", "gray", "violet"];

function genSizeUtil(prop, amount = 6) {
    const array     = Array(amount).fill(1),
        sizes       = array.map((num, i) => makeStyle({ [prop]: `${num * (i + 1)}rem` }).style),
        selectors   = makeSelector(array.map((num, i) => `.${prop[0]}-${num * (i + 1)}`));

    return selectors.applyConcat(sizes);
}

function genColorsUtils(colors) {
    const colorSelectors    = makeSelector(colors.map((color) => `.color-${color}`)),
        bgSelectors         = makeSelector(colors.map((color) => `.bg-${color}`));

    const bgColors = colors.map((color) => makeStyle({ backgroundColor: color }).style),
        justColors = colors.map((color) => makeStyle({ color }).style);

    return makeCSS`
        ${colorSelectors.applyConcat(justColors)}
        ${bgSelectors.applyConcat(bgColors)}
    `;
}

const STYLE = makeCSS`
    ${genSizeUtil("width")}
    ${genSizeUtil("height")}
    ${genColorsUtils(COLORS)}
`;

//Run npm run default:style...
makeCSSOutput("./style/index.css", STYLE);