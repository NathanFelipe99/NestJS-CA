import * as libClassValidator from "class-validator";
import { ClassValidatorFields } from "../../class.validator";

class StubClassValidatorFields extends ClassValidatorFields<{
    field: string
}>{ }

describe("Class validator fields unit tests", () => {
    let SUT: StubClassValidatorFields;

    beforeEach(() => {
        SUT = new StubClassValidatorFields();
    });

    it("Should initialize errors and validatedData vars with null", () => {
        expect(SUT.errors).toBeNull();
        expect(SUT.validatedData).toBeNull();
    });

    it("Should validate with errors", () => {
        const spyValidateSync = jest.spyOn(libClassValidator, "validateSync"),
            constraintObject = { isRequired: "test error" };

        spyValidateSync.mockReturnValue([
            { property: "field", constraints: constraintObject }
        ]);

        expect(SUT.validate(null)).toBeFalsy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(SUT.validatedData).toBeNull();
        expect(SUT.errors).toStrictEqual({ field: [constraintObject.isRequired] });
    });

    it("Should validate without errors", () => {
        const spyValidateSync = jest.spyOn(libClassValidator, "validateSync"),
            validateData = { field: "value" };

        spyValidateSync.mockReturnValue([]);

        expect(SUT.validate(validateData)).toBeTruthy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(SUT.validatedData).toStrictEqual(validateData);
        expect(SUT.errors).toBeNull();
    });
});

