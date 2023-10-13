import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { UserRules, UserValidator, UserValidatorFactory } from "../../user.validator";
import { UserProps } from "@/user/domain/types/user.types";

describe("Validating User with UserValidator", () => {
    let SUT: UserValidator,
        props: UserProps;

    beforeEach(() => {
        SUT = UserValidatorFactory.create();
        props = UserDataBuilder({});
    });

    describe("Validating name field", () => {
        it("Invalidation cases", () => {
            let isValid = SUT.validate(null as any);
            expect(isValid).toBeFalsy();
            expect(SUT.errors.name).toStrictEqual([
                "name should not be empty",
                "name must be a string",
                "name must be shorter than or equal to 255 characters"
            ]);

            isValid = SUT.validate({ ...props, name: "" as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.name).toStrictEqual([
                "name should not be empty"
            ]);

            isValid = SUT.validate({ ...props, name: 1234 as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.name).toStrictEqual([
                "name must be a string",
                "name must be shorter than or equal to 255 characters"
            ]);

            isValid = SUT.validate({ ...props, name: "a".repeat(256) as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.name).toStrictEqual([
                "name must be shorter than or equal to 255 characters"
            ]);
        });

        it("Valid case", () => {
            const userProps = props;
            const isValid = SUT.validate(userProps);
            expect(isValid).toBeTruthy();
            expect(SUT.validatedData).toStrictEqual(new UserRules(userProps));
        });
    });

    describe("Validating email field", () => {
        it("Invalidation cases", () => {
            let isValid = SUT.validate(null as any);
            expect(isValid).toBeFalsy();
            expect(SUT.errors.email).toStrictEqual([
                "email must be an email",
                "email should not be empty",
                "email must be a string",
                "email must be shorter than or equal to 255 characters"
            ]);

            isValid = SUT.validate({ ...props, email: "" as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.email).toStrictEqual([
                "email must be an email",
                "email should not be empty"
            ]);

            isValid = SUT.validate({ ...props, email: 1234 as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.email).toStrictEqual([
                "email must be an email",
                "email must be a string",
                "email must be shorter than or equal to 255 characters"
            ]);

            isValid = SUT.validate({ ...props, email: "a".repeat(256) as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.email).toStrictEqual([
                "email must be an email",
                "email must be shorter than or equal to 255 characters"
            ]);
        });

        it("Valid case", () => {
            const userProps = props;
            const isValid = SUT.validate(userProps);
            expect(isValid).toBeTruthy();
            expect(SUT.validatedData).toStrictEqual(new UserRules(userProps));
        });
    });

    describe("Validating password field", () => {
        it("Invalidation cases", () => {
            let isValid = SUT.validate(null as any);
            expect(isValid).toBeFalsy();
            expect(SUT.errors.password).toStrictEqual([
                "password should not be empty",
                "password must be a string",
                "password must be shorter than or equal to 100 characters"
            ]);

            isValid = SUT.validate({ ...props, password: "" as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.password).toStrictEqual([
                "password should not be empty"
            ]);

            isValid = SUT.validate({ ...props, password: 1234 as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.password).toStrictEqual([
                "password must be a string",
                "password must be shorter than or equal to 100 characters"
            ]);

            isValid = SUT.validate({ ...props, password: "a".repeat(256) as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.password).toStrictEqual([
                "password must be shorter than or equal to 100 characters"
            ]);
        });

        it("Valid case", () => {
            const userProps = props;
            const isValid = SUT.validate(userProps);
            expect(isValid).toBeTruthy();
            expect(SUT.validatedData).toStrictEqual(new UserRules(userProps));
        });
    });

    describe("Validating createdAt field", () => {
        it("Invalidation cases", () => {
            let isValid = SUT.validate({ ...props, createdAt: 1234 as any});
            expect(isValid).toBeFalsy();
            expect(SUT.errors.createdAt).toStrictEqual([
                "createdAt must be a Date instance"
            ]);
            
            isValid = SUT.validate({ ...props, createdAt: "abcd" as any });
            expect(isValid).toBeFalsy();
            expect(SUT.errors.createdAt).toStrictEqual([
                "createdAt must be a Date instance"
            ]);
        });

        it("Valid case", () => {
            const userProps = UserDataBuilder({});
            const isValid = SUT.validate(userProps);
            expect(isValid).toBeTruthy();
            expect(SUT.validatedData).toStrictEqual(new UserRules(userProps));
        });
    });
});