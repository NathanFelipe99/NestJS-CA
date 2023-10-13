import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../class.validator";

class StubRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    constructor(data: { name: string, price: number }) {
        Object.assign(this, data);
    }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules>{
    validate(data: any): boolean {
        return super.validate(new StubRules(data));
    }
}

describe("Class validator fields integration tests", () => {
    let validator: StubClassValidatorFields;

    beforeEach(() => {
        validator = new StubClassValidatorFields();
    });

    it("Should validate with errors", () => {
        expect(validator.validate(null)).toBeFalsy();
        expect(Object.keys(validator.errors)).toHaveLength(2);
        expect(validator.errors.name).toBeDefined();
        expect(validator.errors.name).toHaveLength(3);
        expect(validator.errors.price).toBeDefined();
        expect(validator.errors.price).toHaveLength(2);
    });

    it("Should validate without errros", () => {
        const validateObject = { name: "Rice", price: 4.50 };

        expect(validator.validate(validateObject)).toBeTruthy();
        expect(validator.errors).toBeNull();
        console.log(validator.validatedData);
        expect(validator.validatedData).toStrictEqual(new StubRules(validateObject));
    });
});