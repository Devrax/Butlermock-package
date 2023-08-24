"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validTypes = void 0;
const allowedNonPrimitives = ['Date', 'any'];
const allowedArrayNonPrimitives = ['Date[]', 'any[]'];
const allowedPrimitives = ['string', 'number', 'boolean', 'bigint', 'null', 'undefined']; // TODO: In the future I will check for symbol
const allowedArrayPrimitives = ['string[]', 'number[]', 'boolean[]', 'bigint[]', 'null[]', 'undefined[]'];
const validTypes = [...allowedPrimitives, ...allowedNonPrimitives, ...allowedArrayPrimitives, ...allowedArrayNonPrimitives];
exports.validTypes = validTypes;
