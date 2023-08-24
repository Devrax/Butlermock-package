"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConstant = void 0;
const faker_1 = require("@faker-js/faker");
const strings_1 = __importDefault(require("./strings"));
const randNumber_1 = require("./randNumber");
const faker = faker_1.fakerEN;
const forStrings = new strings_1.default(faker);
const checkConstant = (name, type, anyReturn = null) => {
    switch (type) {
        // Primitives
        case "string":
            return forStrings.checkStringName(name) ?? faker.lorem.slug({ min: 1, max: (0, randNumber_1.rand)(5, 2) });
        case "boolean":
            return Boolean((0, randNumber_1.rand)(2, 0));
        case "number":
        case "bigInt":
            return faker.number[type === "bigInt" ? 'bigInt' : 'int']();
        case "null":
        case "undefined":
            return null;
        // Non primitives
        case "Date":
            return faker.date.anytime();
        // Array primitives
        case "string[]":
            return new Array((0, randNumber_1.rand)(10)).fill('.').map(() => forStrings.checkStringName(name));
        case "boolean[]":
            return new Array((0, randNumber_1.rand)(10)).fill('.').map(b => !!(0, randNumber_1.rand)(2, 0));
        case "number[]":
        case "bigint[]":
            return new Array((0, randNumber_1.rand)(10)).fill('.').map(n => type === 'bigint[]' ? BigInt((0, randNumber_1.rand)(10, 0)) : (0, randNumber_1.rand)(10, 0));
        case 'null[]':
        case 'undefined[]':
            return new Array((0, randNumber_1.rand)(5, 0)).fill(null);
        // Array non-primitive
        case 'Date[]':
            return new Array((0, randNumber_1.rand)(10, 0)).fill('.').map((_) => faker.date.anytime());
        case 'any':
        case 'any[]':
            return anyReturn;
        default:
            return null;
    }
};
exports.checkConstant = checkConstant;
