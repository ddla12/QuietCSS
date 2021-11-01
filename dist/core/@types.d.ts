declare type Tag = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap;
export declare type Selector = string | Tag;
export declare type Property = Record<keyof CSSStyleDeclaration, string>;
export declare type QuietCSSTemplate = Partial<Property>;
export declare type StyleMap = string[][];
export declare type CSSVariables = Record<string, string>;
export declare type CSSRuleStyles = (QuietCSSTemplate | StyleMap)[];
export interface QuietCSSArray {
    applyToAll(style: StyleMap): string;
    applyConcat(styles: StyleMap[]): string;
}
export interface QuietCSSString {
    apply(style: StyleMap): string;
}
export declare type QuietCSSSelector = QuietCSSArray | QuietCSSString;
export interface QuietCSSStyleInstance {
    style: StyleMap;
    add(properties: QuietCSSTemplate, variables?: CSSVariables): void;
    edit(variable: string, value: any): void;
    remove(...properties: string[]): void;
}
export {};
