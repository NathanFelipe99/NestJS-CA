import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { SignInUseCase } from "../../signInUseCase/SignInUseCase";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";
import { UserUseCaseTypes } from "@/user/application/types/user.application.types";
import { BadRequestError } from "@/shared/application/errors/BadRequestError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { InvalidCredentialsError } from "@/shared/application/errors/InvalidCredentialsError";

describe("Testing SignIn use case", () => {
    let SUT: SignInUseCase.UseCase,
        repository: UserInMemoryRepository,
        hashProvider: IHashProvider;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
        hashProvider = new BcryptJsHashProvider();
        SUT = new SignInUseCase.UseCase(repository, hashProvider);
    });

    it("It should throw an error when the email or password is not provided", async () => {
        let userCredentials: UserUseCaseTypes.SignInInput = {
            email: "",
            password: "test"
        };

        await expect(SUT.execute(userCredentials)).rejects.toThrow(new BadRequestError("Invalid input data!"));

        userCredentials = {
            email: "test@gmail.com",
            password: ""
        };

        await expect(SUT.execute(userCredentials)).rejects.toThrow(new BadRequestError("Invalid input data!"));
    });

    it("It should throw an error when the password doesn't match", async () => {
        const newEntity = new UserEntity(UserDataBuilder({}));
        await repository.insert(newEntity);

        expect(repository.items).toHaveLength(1);

        const userCredentials: UserUseCaseTypes.SignInInput = {
            email: newEntity.email,
            password: "123"
        };

        await expect(SUT.execute(userCredentials)).rejects.toThrow(new InvalidCredentialsError("Invalid credentials!"));
    });

    it("It should sign in", async () => {
        const hashedPassword = await hashProvider.generateHash("123");
        const newEntity = new UserEntity(UserDataBuilder({ password: hashedPassword }));
        await repository.insert(newEntity);

        expect(repository.items).toHaveLength(1);

        const userCredentials: UserUseCaseTypes.SignInInput = {
            email: newEntity.email,
            password: "123"
        };

        const user = await SUT.execute(userCredentials);

        expect(user).toMatchObject(newEntity.toJSON());
    });
});