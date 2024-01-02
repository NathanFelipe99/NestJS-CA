import { PrismaClient } from "@prisma/client";
import { SignInUseCase } from "../../signInUseCase/SignInUseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { Test, TestingModule } from "@nestjs/testing";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";
import { BadRequestError } from "@/shared/application/errors/BadRequestError";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { InvalidCredentialsError } from "@/shared/application/errors/InvalidCredentialsError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("SignIn UseCase integration tests", () => {
    const prismaService = new PrismaClient();
    let SUT: SignInUseCase.UseCase,
        repository: UserRepository.Repository,
        hashProvider: IHashProvider,
        module: TestingModule;

    beforeAll(async () => {
        setupPrismaTests();
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();

        repository = new UserPrismaRepository(prismaService as any);
        hashProvider = new BcryptJsHashProvider();
    });

    beforeEach(async () => {
        SUT = new SignInUseCase.UseCase(repository, hashProvider);
        await prismaService.user.deleteMany();
    });

    it("Should throw an error when email or password is not provided", async () => {
        const data: SignInUseCase.Input = {
            email: "",
            password: "123"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new BadRequestError("Invalid input data!"));

        data["email"] = "test@mail.com";
        data["password"] = "";

        await expect(() => SUT.execute(data)).rejects.toThrow(new BadRequestError("Invalid input data!"));
    });

    it("Should throw an error when user is not found by email", async () => {
        const data: SignInUseCase.Input = {
            email: "test@mail.com",
            password: "123"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new NotFoundError(`UserModel not found using email ${data.email}`));
    });

    it("Should throw an error when password doesn't match", async () => {
        const email = "test@mail.com",
            password = "123";
        const entity = new UserEntity(UserDataBuilder({ email, password }));

        await prismaService.user.create({
            data: entity.toJSON()
        });

        const data: SignInUseCase.Input = {
            email,
            password: "TEST"
        };

        await expect(() => SUT.execute(data)).rejects.toThrow(new InvalidCredentialsError("Invalid credentials!"));
    });

    it("Should sign in with user credentials", async () => {
        const email = "test@mail.com",
            password = "123",
            hashedPassword = await hashProvider.generateHash(password);
        const entity = new UserEntity(UserDataBuilder({ email, password: hashedPassword }));

        await prismaService.user.create({
            data: entity.toJSON()
        });

        const data: SignInUseCase.Input = {
            email,
            password
        };

        const output = await SUT.execute(data);
        expect(output).toStrictEqual(entity.toJSON());
    });

    afterAll(async () => {
        await module.close();
    });
});