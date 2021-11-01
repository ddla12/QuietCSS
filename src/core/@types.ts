type Tag = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap;

export type Selector = string | Tag;
export type Property = Record<keyof CSSStyleDeclaration, string>;
export type QuietCSSTemplate  = Partial<Property>;
export type StyleMap = string[][];
export type CSSVariables = Record<string, string>;
export type CSSRuleStyles = (QuietCSSTemplate|StyleMap)[];

export interface QuietCSSArray {
    applyToAll(style: StyleMap): string;
    applyConcat(styles: StyleMap[]): string;
};

export interface QuietCSSString {
    apply(style: StyleMap): string;
};