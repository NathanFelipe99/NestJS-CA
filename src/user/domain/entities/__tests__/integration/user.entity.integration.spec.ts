import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { UserProps } from "@/user/domain/types/user.types";
import { UserEntity } from "../../user.entity";
import { EntityValidationError } from "@/shared/domain/entities/errors/ValidationError";

describe("User entity integration tests", () => {
    let props: UserProps;
    describe("Constructor methods", () => {
        beforeEach(() => {
            props = UserDataBuilder({});
        });

        it("Should throw an exception when creating an user with invalid props", () => {
            for (const prop in props) {
                if (prop != "createdAt") {
                    props[prop] = null;
                    expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

                    props[prop] = "";
                    expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
                }

                props[prop] = "a".repeat(256);
                expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

                props[prop] = 1234 as any;
                expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

                props = UserDataBuilder({});
            }
        });

        it("Should create a valid user", () => {
            expect.assertions(0);
            new UserEntity(props);
        });
    });

    describe("Update (name) method", () => {

        beforeEach(() => {
            props = UserDataBuilder({});
        });

        it("Should throw exception on update user name", () => {
            const user = new UserEntity(props);

            expect(() => user.update(null)).toThrowError(EntityValidationError);
            expect(() => user.update("")).toThrowError(EntityValidationError);
            expect(() => user.update(1234 as any)).toThrowError(EntityValidationError);
            expect(() => user.update("a".repeat(256))).toThrowError(EntityValidationError);
        });

        it("Should update user name", () => {
            const user = new UserEntity(props);
            expect.assertions(0);
            user.update("New user name");
        });
    });

    describe("Password update method", () => {

        beforeEach(() => {
            props = UserDataBuilder({});
        });

        it("Should throw exception on update user password", () => {
            const user = new UserEntity(props);

            expect(() => user.updatePassword(null)).toThrowError(EntityValidationError);
            expect(() => user.updatePassword("")).toThrowError(EntityValidationError);
            expect(() => user.updatePassword(1234 as any)).toThrowError(EntityValidationError);
            expect(() => user.updatePassword("a".repeat(101))).toThrowError(EntityValidationError);
        });

        it("Should update user password", () => {
            const user = new UserEntity(props);
            expect.assertions(0);
            user.update("abcd123");
        });
    });
});