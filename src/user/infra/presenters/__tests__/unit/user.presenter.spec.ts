import { UserOutput } from "@/user/application/dto/userOutput";
import { UserPresenter } from "../../user.presenter";
import { instanceToPlain } from "class-transformer";

describe("User Presenter unit tests", () => {
    let SUT: UserPresenter.Presenter;
    const createdAt = new Date(),
        data: UserOutput = {
            id: "b088520a-fae9-453b-a769-d4ad17ad3272",
            name: "Nathan Guerlando",
            email: "nathan.guerlando@gmail.com",
            password: "$2a$08$fRHBTLMe/F8w.x6XoWeNRe7hZChCIzcGyZcyBTXPhwc8C/z.32kj.",
            createdAt
        };

    beforeEach(() => {
        SUT = new UserPresenter.Presenter(data);
    });

    describe("Testing constructor method", () => {
        it("Should be defined and must not have the property 'password'", () => {
            expect(SUT.id).toEqual(data.id);
            expect(SUT.name).toEqual(data.name);
            expect(SUT.email).toEqual(data.email);
            expect(SUT.createdAt).toEqual(data.createdAt);
            expect(SUT).not.toHaveProperty("password");
        });
    });

    describe("Testing presenter data", () => {
        it("Should transform data", () => {
            const output = instanceToPlain(SUT);
            expect(output).toStrictEqual({
                id: "b088520a-fae9-453b-a769-d4ad17ad3272",
                name: "Nathan Guerlando",
                email: "nathan.guerlando@gmail.com",
                createdAt: createdAt.toISOString()
            });
        });
    });
});