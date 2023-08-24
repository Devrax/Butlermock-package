"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockInterface = void 0;
const TypeMocker_1 = __importDefault(require("./core/class/TypeMocker"));
const path_1 = require("path");
function mockInterface(filePath) {
    const projectRoot = process.cwd();
    const absoluteFilePath = (0, path_1.join)(projectRoot, filePath);
    try {
        const mock = new TypeMocker_1.default(absoluteFilePath);
        return JSON.stringify(mock.buildMock());
    }
    catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
}
exports.mockInterface = mockInterface;
