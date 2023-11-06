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
});