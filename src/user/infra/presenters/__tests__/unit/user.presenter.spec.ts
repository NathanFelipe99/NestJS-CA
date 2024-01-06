import { UserOutput } from "@/user/application/dto/userOutput";
import { UserPresenter } from "../../user.presenter";
import { instanceToPlain } from "class-transformer";
import { PaginationPresenter } from "@/shared/infra/presenters/pagination.presenter";
import { create } from "domain";

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

describe("User Collection Presenter unit tests", () => {
    const createdAt = new Date(),
        props: UserOutput = {
            id: "b088520a-fae9-453b-a769-d4ad17ad3272",
            name: "Nathan Guerlando",
            email: "nathan.guerlando@gmail.com",
            password: "$2a$08$fRHBTLMe/F8w.x6XoWeNRe7hZChCIzcGyZcyBTXPhwc8C/z.32kj.",
            createdAt
        };

    it("Should define values", () => {
        const SUT = new UserPresenter.CollectionPresenter({
            items: [props],
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 1
        });

        expect(SUT.meta).toBeInstanceOf(PaginationPresenter.Presenter);
        expect(SUT.meta).toStrictEqual(new PaginationPresenter.Presenter({
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 1
        }));

        expect(SUT.data).toStrictEqual([new UserPresenter.Presenter(props)]);
    });

    it("Should presenter data", () => {
        const SUT = new UserPresenter.CollectionPresenter({
            items: [props],
            currentPage: "1" as any,
            perPage: "2" as any,
            lastPage: "1" as any,
            total: "1" as any
        });

        const output = instanceToPlain(SUT);
        expect(output).toStrictEqual({
            data: [
                {
                    id: "b088520a-fae9-453b-a769-d4ad17ad3272",
                    name: "Nathan Guerlando",
                    email: "nathan.guerlando@gmail.com",
                    createdAt: createdAt.toISOString()
                }
            ],
            meta: {
                currentPage: 1,
                perPage: 2,
                lastPage: 1,
                total: 1
            }
        })
    });
});