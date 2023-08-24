import Interface2Mock from "./core/class/TypeMocker";
import { join } from 'path';

interface Config { anyReturn: any; rawInterface: boolean; topLevelProperty: string; quantity: number; };

export function mockInterface<T>(interfaceRef: string, config?: Config): T | T[] {
    const opts: Config  = {
        anyReturn: null,
        rawInterface: false,
        topLevelProperty: '',
        quantity: 1,
        ...config
    }

    const projectRoot = process.cwd();
    const content = opts.rawInterface ? interfaceRef : join(projectRoot, interfaceRef);
    
    try {

        if(opts.quantity > 1) {
            const mocks = [];
            for(let i = 0; i < opts.quantity; i++) { 
                const createMock = new Interface2Mock(content, opts);
                mocks.push(createMock.buildMock(opts.topLevelProperty));
            }
            return mocks as T[];
        }

        const mock = new Interface2Mock(content, opts);
        return mock.buildMock(opts.topLevelProperty) as T;
    } catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
}
