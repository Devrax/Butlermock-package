"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamicValue_1 = require("../utils/dynamicValue");
const randNumber_1 = require("../utils/randNumber");
const typeValidation_1 = require("../utils/typeValidation");
const fs_1 = __importDefault(require("fs"));
;
;
class Interface2Mock {
    interfaceReferenceOrPath;
    config;
    #json = {};
    #interfacePatternRegex = /interface(([A-Za-z0-9 ]+)({)(.+)?)(})/g;
    #typePatternRegex = /type(([A-Za-z0-9 ]+)= ?)({)(.+)?(})/g;
    #typePrimitivePatternRegex = /type(([A-Za-z0-9 ]+)= ?)(.+);/g;
    #interfacesCaptured = {};
    #typeCaptured = {};
    constructor(interfaceReferenceOrPath, config = {
        anyReturn: null,
        rawInterface: false
    }) {
        this.interfaceReferenceOrPath = interfaceReferenceOrPath;
        this.config = config;
        let interfacesAndTypes = this.interfaceReferenceOrPath;
        if (!config.rawInterface) {
            interfacesAndTypes = fs_1.default.readFileSync(this.interfaceReferenceOrPath, 'utf8');
        }
        this.#capturePrimitiveTypes(interfacesAndTypes);
        this.#captureStandardTypesAndInterfaces(interfacesAndTypes);
        if (Object.values(this.#interfacesCaptured).length === 0 && Object.values(this.#typeCaptured).length === 0)
            throw new Error('No interfaces or types were found');
        [...Object.values(this.#interfacesCaptured), ...Object.values(this.#typeCaptured)]
            .filter(el => Boolean(el) && !el.isProcess)
            .forEach(obj => this.#process(obj));
    }
    #capturePrimitiveTypes(str) {
        const primitiveTypes = str.match(this.#typePrimitivePatternRegex);
        if (primitiveTypes == null)
            return;
        for (let primitiveStr of primitiveTypes) {
            primitiveStr = primitiveStr.replace(/\n+/g, ' ');
            const processItem = (/type(([A-Za-z0-9 ]+)= ?)([A-Za-z0-9 |"\n]+);/g).exec(primitiveStr);
            if (processItem == null)
                throw new Error('Bad format for interface/type: ' + primitiveStr);
            const [useless, useless2, typeName, typeValue] = processItem;
            const deepTypeValid = (0, typeValidation_1.typeValidation)(typeValue), value = deepTypeValid.value ?? (0, dynamicValue_1.checkConstant)(typeName.trim(), deepTypeValid.type, this.config.anyReturn);
            this.#typeCaptured[typeName.trim()] = {
                raw: typeValue,
                value,
                isProcess: true
            };
        }
    }
    #captureStandardTypesAndInterfaces(str) {
        str = str.replace(/{ +/g, '{').replace(/{\n+/g, '{').replace(/\n( +)/g, '').replace(/}/g, '}\n').replace(/;\n/g, ';'); //Remove any whitespace after line break
        const interfacesTaken = str.match(this.#interfacePatternRegex);
        const typesTaken = str.match(this.#typePatternRegex);
        const reusableIterator = (arr, pattern, storeRef) => {
            for (const item of arr) {
                if (item.match(/(.+)extends([A-Za-z0-9 ]+)/g) != null)
                    throw new Error(`Butlermock is not capable of mocking interface inheritance yet, so we cannot provide you a mock for this interface "${item}", sorry :(`);
                const processItem = new RegExp(pattern, 'g').exec(item);
                if (processItem == null)
                    throw new Error('Bad format for interface/type: ' + item);
                const [useless1, useless2, hashkey, openBracket, tsObject, closingBracket] = processItem;
                if (tsObject == null || tsObject === '')
                    throw new Error(`"${item}" it seems empty, you cannot provide empty interface.`);
                storeRef[hashkey.trim()] = {
                    raw: `${openBracket} ${tsObject} ${closingBracket}`.trim(),
                    value: {},
                    isProcess: false
                };
            }
        };
        if (interfacesTaken)
            reusableIterator(interfacesTaken, 'interface(([A-Za-z0-9 ]+)({)(.+)?)(})', this.#interfacesCaptured);
        if (typesTaken)
            reusableIterator(typesTaken, 'type(([A-Za-z0-9 ]+)= ?)({)(.+)?(})', this.#typeCaptured);
    }
    /**
     * This function process map each interface or types and creates the mock object assigning each value meeting its type one by one
     * is recursive
     * @param obj
     * @returns
     */
    #process(obj) {
        if (obj == null)
            return null;
        const splitEachMember = obj.raw.replace(/(\n|\t|{|}| |readonly )/g, '').split(';').filter(Boolean);
        for (const member of splitEachMember) {
            if (member.match(/\[(.+)\]/g) || member.match(/\((.+)\)/g))
                break;
            let [keyName, ...typeValue] = member.split(':');
            const type = typeValue == null ? (`${typeValue}`).toLocaleLowerCase() : typeValue.join('').trim();
            keyName = keyName.replace('?', '');
            const deepTypeValid = (0, typeValidation_1.typeValidation)(type);
            if (deepTypeValid.isNotCustom) {
                obj.value[keyName] = deepTypeValid.value ?? (0, dynamicValue_1.checkConstant)(keyName, deepTypeValid.type, this.config.anyReturn);
            }
            else {
                const hashtype = String(deepTypeValid.type).replace(/\[\]/, '');
                const checkIfThatInterfaceExist = this.#findTypeValue(hashtype);
                if (checkIfThatInterfaceExist) {
                    const foundInterface = this.#interfacesCaptured[hashtype] ?? this.#typeCaptured[hashtype];
                    const recursiveValue = (t) => {
                        const val = this.#process(foundInterface);
                        return t.includes('[]') ? new Array((0, randNumber_1.rand)(5)).fill(structuredClone(val)) : val;
                    };
                    const value = checkIfThatInterfaceExist?.isProcess ? checkIfThatInterfaceExist.value : recursiveValue(deepTypeValid.type);
                    obj.value[keyName] = deepTypeValid.type.includes('[]') ? Array.isArray(value) ? value : [value] : value;
                }
                else {
                    obj.value[keyName] = null;
                }
            }
        }
        obj.isProcess = true;
        return structuredClone(obj.value);
    }
    #findTypeValue(type) {
        const checkInterfaces = this.#interfacesCaptured[type];
        const checkTypes = this.#typeCaptured[type];
        if (checkInterfaces)
            return checkInterfaces;
        if (checkTypes)
            return checkTypes;
    }
    buildMock(rootTypeInterface = '') {
        if (rootTypeInterface) {
            if (this.#interfacesCaptured[rootTypeInterface] == null && this.#typeCaptured[rootTypeInterface] == null) {
                throw new Error(`Not matches for key '${rootTypeInterface}' in [${Object.keys({ ...this.#interfacesCaptured, ...this.#typeCaptured }).join(', ')}]`);
            }
            const selectedInterface = this.#interfacesCaptured[rootTypeInterface];
            return selectedInterface ? selectedInterface.value : this.#typeCaptured[rootTypeInterface].value;
        }
        const iterateMockedInterface = (tsObj) => Object.entries(tsObj).forEach(obj => this.#json[obj[0]] = obj[1].value);
        iterateMockedInterface(this.#interfacesCaptured);
        iterateMockedInterface(this.#typeCaptured);
        return structuredClone(this.#json);
    }
}
exports.default = Interface2Mock;
