import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { UserInMemoryRepository } from "../../user.in-memory.repository";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { ConflictError } from "@/shared/domain/errors/ConflictError";

describe("Testing UserInMemoryRepository", () => {
    let SUT: UserInMemoryRepository;

    beforeEach(() => {
        SUT = new UserInMemoryRepository();
    });

    describe("Testing findByEmail method", () => {
        it("Should throw error when email is not found", async () => {
            const email = "test@gmail.com";
            await expect(SUT.findByEmail(email)).rejects.toThrowError(new NotFoundError(`Entity not found using email ${email}!`));
        });

        it("Should find entity with email parameter", async () => {
            const email = "test@gmail.com";
            const entity = new UserEntity(UserDataBuilder({ email }));
            await SUT.insert(entity);

            const result = await SUT.findByEmail(email);
            expect(result.toJSON()).toStrictEqual(entity.toJSON());
        });
    });

    describe("Testing emailExists method", () => {
        it("Should throw error when email is not found", async () => {
            const email = "test2@gmail.com";
            const entity = new UserEntity(UserDataBuilder({ email }));
            await SUT.insert(entity);

            await expect(SUT.emailExists(email)).rejects.toThrowError(new ConflictError("Email address already in use!"));
        });

        it("Should throw error when email is not found", async () => {
            expect.assertions(0);
            const email = "test2@gmail.com";
            await SUT.emailExists(email);
        });
    });

    describe("Testing applyFilter method", () => {
        it("Should return all items when filter is null", async () => {
            const email = "test2@gmail.com";
            const entity = new UserEntity(UserDataBuilder({ email }));
            await SUT.insert(entity);

            const result = await SUT.findAll();
            const spyFilterMethod = jest.spyOn(result, "filter");
            const filteredItems = await SUT["applyFilter"](result, null);
            expect(spyFilterMethod).not.toHaveBeenCalled();
            expect(filteredItems).toStrictEqual(result);
        });

        it("Should filter name field using filter param", async () => {
            const items = [
                new UserEntity(UserDataBuilder({ name: "John Doe" })),
                new UserEntity(UserDataBuilder({ name: "Doe" })),
                new UserEntity(UserDataBuilder({ name: "John Wick" }))
            ];

            const spyFilterMethod = jest.spyOn(items, "filter");
            const filteredItems = await SUT["applyFilter"](items, "John");
            expect(spyFilterMethod).toHaveBeenCalled();
            expect(filteredItems).toHaveLength(2);
            expect(filteredItems).toStrictEqual([items[0], items[2]]);
        });
    });

    describe("Testing applySort method by default (when sort param is null)", () => {
        it("Should order by createdAt", async () => {
            const createdAt = new Date();
            const items = [
                new UserEntity(UserDataBuilder({ name: "Jane Doe", createdAt })),
                new UserEntity(UserDataBuilder({ name: "John Doe", createdAt: new Date(createdAt.getTime() + 1) })),
                new UserEntity(UserDataBuilder({ name: "John Wick", createdAt: new Date(createdAt.getTime() + 2) }))
            ];


            const orderedItems = await SUT["applySort"](items, null, null);
            expect(orderedItems).toStrictEqual([items[2], items[1], items[0]]);
        });

        it("Should order by params", async () => {
            const items = [
                new UserEntity(UserDataBuilder({ name: "Jane Doe" })),
                new UserEntity(UserDataBuilder({ name: "Doe John" })),
                new UserEntity(UserDataBuilder({ name: "John Wick" }))
            ];

            let orderedItems = await SUT["applySort"](items, "name", "ASC");
            expect(orderedItems).toStrictEqual([items[1], items[0], items[2]]);

            orderedItems = await SUT["applySort"](items, "name", null);
            expect(orderedItems).toStrictEqual([items[2], items[0], items[1]]);
        });
    });
});