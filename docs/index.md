Docs
====

QuietCSS is builded on functions, ranging from the basics (which returns strings) to the complex (which returns objects)

## *``makeCSS``*
```javascript
const { makeCSS } = require("quietcss");

const section = `
section {
    padding: 1rem;
    color: black;
}
`;

makeCSS(section);
makeCSS`
p > small {
    color: gray;
}
`;
```

It receives and **string** or a **template literal**, and returns a **string** which is no more than a CSS code **with indentation**

## *`makeRule`*

```javascript
const { makeRule } = require("quietcss");

const button = makeRule("button", {
    padding: "1rem"
});

console.log(button);
/*
button {
padding: 1rem;
}
*/
```

It makes a rule for a CSS selector, it returns a **string**, which is, again, CSS code, but without the **indentation**

It has two variants, ``makeRules`` and ``makeRulesByNesting``...

```javascript
const { makeRules, makeRulesByNesting } = require("quietcss");

const multipleRules = makeRule(
    ["p", ["button", "strong", "small"]],
    [
        {
            padding: "1rem"
        },
        {
            color: "green",
            border: ".125rem solid white"
        }
    ]
);

const nestedRules = makeRulesByNesting(
    ".parent",
    ["&::before"],
    [
        //The first element styles the parent
        {
            color: "red",
            position: "relative",
        },
        {
            content: "",
            position: "absolute",
            padding: "1rem"
        }
    ]
);

console.log(multipleRules + "\n" + nestedRules);
```

#### Output:

```
p {
padding: 1rem;
}

button, strong, small {
color: green;
border: .125rem solid white;
}

.parent {
color: red;
position: relative;
}

.parent::before {
content: "";
position: absolute;
padding: 1rem;
}
```

``makeRule`` based functions are quite fine to get started, but let's go up a step with other functions that allow have more control of the resulting CSS

## *``makeStyle``*

It accepts two arguments, the first one is the object literal of the CSS properties, and the last one is the CSS variables availables in the map. The keys in both objects must be in **camelCase**
```javascript
const { makeStyle } = require("quietcss");

const simpleStyle = makeStyle({
    padding: "1rem",
    width: "2rem",
    backgroundColor: "white"
});
```

It returns a ``QuietCSSStyleInstance``, which has the following properties:

1. ``style`` The ``StyleMap`` itself, which can be pass to the ``makeRule`` functions as arguments
```javascript
simpleStyle.style;
/*
[
    ["padding", "1rem"],
    ["width", "2rem"],
    ["background-color", "white"]
]
*/
```
2. ``add`` as its name suggest, adds new elements and variables to the style map,
```javascript
simpleStyle.add({
    height: "var(--size-var)"
}, {
    sizeVar: "2rem"
})
```
3. ``edit``, changes the value of a element,
```javascript
style.edit("width", "22px");
```
4. ``remove``, substracts elements from the map
```javascriptt
style.remove("width", "padding");
```

## ```makeSelector```

This functions receives CSS selectors as arguments and returns a ``QuietCSSSelector`` instance which allows you to control CSS precisely by methods

All methods returns a ``string``, which is a piece of CSS code **without indentation**, so they can be placed inside the ``makeCSS`` function

If the argument is a ``string``, the returned object will have the following method:

1. ``apply``, assign properties to the selector, the argument must be a ``StyleMap``
```javascript
const style = makeStyle({
    backgroundColor: "green",
    marginTop: "1rem",
    position: "fixed"
});

makeSelector("div").apply(style.style);
```

Else, if the argument is a ``string[]``, the methods will be:

1. ``applyToAll``, consider the following selector and the following style:

```javascript
const style = makeStyle({
    display: "flex",
    gap: "1rem",
    alignItems: "center";
});

const applyToAll = makeSelector(["div", "section", "article"]).applyToAll(style.style);
```

The value of ``applyToAll`` will be:
```css
div, section, article {
display: flex;
gap: 1rem;
align-items: center;
}
```

2. ``applyConcat``, consider the following code:
3. 
```javascript

const colors = ["red", "blue", "yellow"].map((color) => makeStyle({ color }).style),
    selectors = makeSelector([".red", ".blue", "yellow"]);

const applyConcat = selectors.applyConcat(colors);
```

``applyConcat`` variable will be:
```css
.red {
color: red
}

.blue {
color: blue
}

.yellow {
color: yellow;
}
```

``makeSelector`` has one variation: ``makeNestedSelector``, which receives two arguments, a ``string`` and a ``string[]``

It returns a valid selector, after resolve the nested selectors, for instance:

```javascript
const nestedSelectors = makeNestedSelector("button", ["& > small"]);
```

## ``makeCSSOutput`` and ``importStyle``

These are functions for the final steps, if you already have a CSS code, you may want to generate a file with it, then, you're gonna need ``makeCSSOutput``

```javascript
makeCSSOutput(path: string, code: string, minify: boolean = false);
```
The second method, ``importStyle``, reads a CSS file and returns a ``string``, it may be useful in the ``makeCSS`` method, for instance, if you have a file called *``mycssfile.css``* with the following code:

```css
div > p {
    text-align: center;
}
```

You can import it in your ``makeCSS`` function, like this:

```javascript
makeCSS`
    div {
        display: flex;
    }

    ${importStyle("mycssfile.css")}
`;
```

So the output will be:

```css
div {
    display: flex;
}

div > p {
    text-align: center;
}
```