"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rand = void 0;
const rand = (max, min = 1) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};
exports.rand = rand;
