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

export type QuietCSSSelector = QuietCSSArray|QuietCSSString;

export interface QuietCSSStyleInstance {
    style: StyleMap;
    add(properties: QuietCSSTemplate, variables?: CSSVariables): void;
    edit(variable: string, value: any)  : void;
    remove(...properties: string[])     : void;
}