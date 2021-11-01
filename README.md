QuietCSS
========

It's a lightweight CSS-in-JS based preprocessor, easier to use than others of the same kind, think in it as de **JSX** of CSS.

Ok, maybe it's a bit pretentious, but look at this piece of code:

```javascript
const { makeCSSOutput, makeCSS, makeSelector, makeStyle } = require("quietcss");

function Displays() {
    const displays = ["block", "flex", "grid", "inline"];

    const selectors = makeSelector(displays.map((d) => `.${d}`)),
        styles      = displays.map((display) => makeStyle({ display }).style);

    return selectors.applyConcat(styles);
}

const STYLE = makeCSS(Displays());

makeCSSOutput("./index.css", STYLE);
```

The output file *(index.css)* will have these rules:

```CSS
.block {
    display: block;
}

.flex {
    display: flex;
}

.grid {
    display: grid;
}

.inline {
    display: inline;
}
```

You see?, you can make CSS code with functions, you can make them reusable so you can make complex styles without writing much, check the [`style`](./style) folder of this repo to understand what I mean

Get Started
===========

### Install via npm

```
npm i quietcss
```

The documentation is [here](./docs/index.md)

*I hope you liked this, if you do, please, help us with the code, it's pretty simple now*