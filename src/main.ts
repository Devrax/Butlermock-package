import Interface2Mock from "./core/class/TypeMocker";
import { join } from 'path';

export function mockInterface(filePath: string): string {
    const projectRoot = process.cwd();
    const absoluteFilePath = join(projectRoot, filePath);
    
    try {
        const mock = new Interface2Mock(absoluteFilePath);
        return JSON.stringify(mock.buildMock());
    } catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
}
