import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { UpdatePasswordUseCase } from "../../updatePasswordUseCase/UpdatePasswordUseCase";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { InvalidPasswordError } from "@/shared/application/errors/InvalidPasswordError";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";

describe("Testing UpdatePassword use case", () => {
    let SUT: UpdatePasswordUseCase.UseCase,
        repository: UserInMemoryRepository,
        hashProvider: BcryptJsHashProvider,
        newEntity: UserEntity;

    beforeEach(async () => {
        repository = new UserInMemoryRepository();
        hashProvider = new BcryptJsHashProvider();

        SUT = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
        const password = await hashProvider.generateHash("123");
        newEntity = new UserEntity(UserDataBuilder({ password }));
        repository.items = [newEntity];
    });

    it("It should throw an error when the entity is not found", async () => {
        const updatePasswordData: UpdatePasswordUseCase.Input = {
            id: "fakeID",
            currentPassword: "",
            newPassword: "123"
        };

        await expect(SUT.execute(updatePasswordData)).rejects.toThrow(new NotFoundError("Entity not found!"));
    });

    it("It should throw an error when the passwords are not provided", async () => {
        const updatePasswordData: UpdatePasswordUseCase.Input = {
            id: newEntity._id,
            currentPassword: "",
            newPassword: "123"
        };

        await expect(SUT.execute(updatePasswordData)).rejects.toThrow(new InvalidPasswordError("Current and old passwords required!"));

        updatePasswordData.currentPassword = "123";
        updatePasswordData.newPassword = "";

        await expect(SUT.execute(updatePasswordData)).rejects.toThrow(new InvalidPasswordError("Current and old passwords required!"));
    });

    it("It should throw an error when the current password doesn't match", async () => {
        const updatePasswordData: UpdatePasswordUseCase.Input = {
            id: newEntity._id,
            currentPassword: "321",
            newPassword: "1234"
        };

        await expect(SUT.execute(updatePasswordData)).rejects.toThrow("Current password doesn't match!");
    });

    it("It should update the password", async () => {
        const updatePasswordData: UpdatePasswordUseCase.Input = {
            id: newEntity._id,
            currentPassword: "123",
            newPassword: "1234"
        };

        const updateResult = await SUT.execute(updatePasswordData);

        const compareHash = await hashProvider.compareHash(updatePasswordData.newPassword, updateResult.password);
        expect(compareHash).toBeTruthy();
    });
});