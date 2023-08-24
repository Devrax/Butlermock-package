import { Faker } from "@faker-js/faker";
export default class StringPlaceholder {
    private faker;
    constructor(faker: Faker);
    checkStringName(name: string): string | undefined;
    checkReservedString(name: string): string | undefined;
}
