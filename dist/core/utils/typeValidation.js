"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeValidation = void 0;
const ValidTypes_1 = require("../constants/ValidTypes");
const randNumber_1 = require("./randNumber");
const typeValidation = (type) => {
    if (type.includes("|")) {
        const splitTypes = type.split("|"), findPossibleValues = splitTypes.filter(t => {
            if (t.includes("'") || t.includes('"'))
                return true;
            if (!isNaN(Number(t)))
                return true;
            return false;
        });
        if (findPossibleValues.length > 0) {
            const randomValue = findPossibleValues[(0, randNumber_1.rand)(findPossibleValues.length, 0)];
            const isNumber = !(randomValue.includes('"') || randomValue.includes("'")) && !isNaN(randomValue);
            return { type: typeof randomValue, isNotCustom: true, value: isNumber ? Number(randomValue) : randomValue.replace(/('|")/g, '').trim() };
        }
        else {
            const types = splitTypes.filter(t => ValidTypes_1.validTypes.includes(t));
            const fixedType = types[(0, randNumber_1.rand)(types.length)];
            return { type: fixedType, isNotCustom: ValidTypes_1.validTypes.includes(fixedType), value: null };
        }
    }
    if (type.includes("'") || type.includes('"')) {
        return { type: typeof type, isNotCustom: true, value: type.replace(/('|")/g, '') };
    }
    if (!isNaN(Number(type))) {
        return { type: typeof type, isNotCustom: true, value: Number(type) };
    }
    if (type === 'true' || type === 'false') {
        return { type: 'boolean', isNotCustom: true, value: JSON.parse(type) };
    }
    return { type, isNotCustom: ValidTypes_1.validTypes.includes(type), value: null };
};
exports.typeValidation = typeValidation;
