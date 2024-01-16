import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SignUpDTO } from "../../dtos/signUp.dto";
import { PrismaClient } from "@prisma/client";
import setupPrismaTests from "@/shared/infra/database/prisma/testing/setup.prisma.tests";
import { EnvConfigModule } from "@/shared/infra/env-config/env-config.module";
import { UserModule } from "../../user.module";
import { DatabaseModule } from "@/shared/infra/database/database.module";
import request from "supertest";
import { UserController } from "../../user.controller";
import { instanceToPlain } from "class-transformer";
import { applyGlobalInterceptors } from "@/global.config";

describe("Create end-to-end test", () => {
    let application: INestApplication,
        module: TestingModule,
        repository: UserRepository.Repository,
        signUpDTO: SignUpDTO;

    const prismaService: PrismaClient = new PrismaClient();

    beforeAll(async () => {
        setupPrismaTests();
        module = await Test.createTestingModule({
            imports: [EnvConfigModule, UserModule, DatabaseModule.forTest(prismaService)]
        }).compile();

        application = module.createNestApplication();
        applyGlobalInterceptors(application);
        await application.init();
        repository = module.get<UserRepository.Repository>("UserRepository");
    }, 12000);

    beforeEach(async () => {
        await prismaService.user.deleteMany();
        signUpDTO = {
            name: "testname",
            email: "test@mail.com",
            password: "test123"
        };
    });

    describe("POST /user", () => {
        it("Should create an user", async () => {
            const endpoint = "/user"
            const response = await request(application.getHttpServer()).post(endpoint).send(signUpDTO).expect(201);
            expect(Object.keys(response.body)).toStrictEqual([
                "id",
                "name",
                "email",
                "createdAt"
            ]);

            const user = await repository.findById(response.body.id);
            const userPresenter = UserController.userToResponse(user.toJSON());
            const serialized = instanceToPlain(userPresenter);
            expect(response.body).toStrictEqual(serialized);
        });
    });
});