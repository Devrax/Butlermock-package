interface Config {
    anyReturn: any;
    rawInterface: boolean;
    topLevelProperty: string;
    quantity: number;
}
export declare function mockInterface<T>(interfaceRef: string, config?: Config): T | T[];
export {};
