export default class Interface2Mock {
    #private;
    private interfaceReferenceOrPath;
    private config;
    constructor(interfaceReferenceOrPath: string, config?: {
        anyReturn: null;
        rawInterface: boolean;
    });
    buildMock(rootTypeInterface?: string): any;
}
