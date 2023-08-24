"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockInterface = void 0;
const TypeMocker_1 = __importDefault(require("./core/class/TypeMocker"));
const path_1 = require("path");
;
function mockInterface(interfaceRef, config) {
    const opts = {
        anyReturn: null,
        rawInterface: false,
        topLevelProperty: '',
        quantity: 1,
        ...config
    };
    const projectRoot = process.cwd();
    const content = opts.rawInterface ? interfaceRef : (0, path_1.join)(projectRoot, interfaceRef);
    try {
        if (opts.quantity > 1) {
            const mocks = [];
            for (let i = 0; i < opts.quantity; i++) {
                const createMock = new TypeMocker_1.default(content, opts);
                mocks.push(createMock.buildMock(opts.topLevelProperty));
            }
            return mocks;
        }
        const mock = new TypeMocker_1.default(content, opts);
        return mock.buildMock(opts.topLevelProperty);
    }
    catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
}
exports.mockInterface = mockInterface;
