import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { SignUpUseCase } from "../../signUpUseCase/SignUpUseCase";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";
import { UserUseCaseTypes } from "@/user/application/types/user.application.types";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { BadRequestError } from "@/shared/application/errors/BadRequestError";
import { ConflictError } from "@/shared/domain/errors/ConflictError";

describe("Testing SignUp Use Case", () => {
    let SUT: SignUpUseCase.UseCase,
        repository: UserInMemoryRepository,
        provider: IHashProvider;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
        provider = new BcryptJsHashProvider();
        SUT = new SignUpUseCase.UseCase(repository, provider);
    });

    it("Should create an user", async () => {
        const spyOnInsert = jest.spyOn(repository, "insert");
        const userData: UserUseCaseTypes.SignUpInput = UserDataBuilder({});

        const resultEntity = await SUT.execute(userData);
        expect(spyOnInsert).toHaveBeenCalledTimes(1);
        expect(resultEntity.id).toBeDefined();
        expect(resultEntity.createdAt).toBeInstanceOf(Date);
    });

    it("Shouldn't create an user because email already exists", async () => {
        const spyOnInsert = jest.spyOn(repository, "insert");
        const userData: UserUseCaseTypes.SignUpInput = UserDataBuilder({ email: "test@test.com" });

        await SUT.execute(userData);

        expect(spyOnInsert).toHaveBeenCalledTimes(1);
        await expect(async () => await SUT.execute(userData)).rejects.toBeInstanceOf(ConflictError);
    });

    it("Should throw error when name isn't providded", async () => {
        const userData: UserUseCaseTypes.SignUpInput = Object.assign(UserDataBuilder({}), { name: null });
        await expect(() => SUT.execute(userData)).rejects.toBeInstanceOf(BadRequestError);
    });

    it("Should throw error when email isn't providded", async () => {
        const userData: UserUseCaseTypes.SignUpInput = Object.assign(UserDataBuilder({}), { email: null });
        await expect(() => SUT.execute(userData)).rejects.toBeInstanceOf(BadRequestError);
    });

    it("Should throw error when password isn't providded", async () => {
        const userData: UserUseCaseTypes.SignUpInput = Object.assign(UserDataBuilder({}), { password: null });
        await expect(() => SUT.execute(userData)).rejects.toBeInstanceOf(BadRequestError);
    });
});