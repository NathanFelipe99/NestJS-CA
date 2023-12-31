import { DatabaseModule } from "@/shared/infra/database/database.module";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { SignUpUseCase } from "../../signUpUseCase/SignUpUseCase";
import { UserPrismaRepository } from "@/user/infra/database/prisma/repositories/user.prisma.repository";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";

describe("SignUp UseCase integration tests", () => {
    const prismaService = new PrismaClient();    
    let SUT: SignUpUseCase.UseCase,
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
        SUT = new SignUpUseCase.UseCase(repository, hashProvider);
        await prismaService.user.deleteMany();
    });

    it("Should create an user", async () => {
        const data: SignUpUseCase.Input = {
            email: "test@test.com",
            name: "John Doe",
            password: "1234"
        };

        const output = await SUT.execute(data);

        expect(output.id).toBeDefined();
        expect(output.createdAt).toBeInstanceOf(Date);
    });

    afterAll(async () => {
        await module.close();
    });
});