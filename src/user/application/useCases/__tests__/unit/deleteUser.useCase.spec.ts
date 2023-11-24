import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { DeleteUserUseCase } from "../../deleteUserUseCase/DeleteUserUseCase";
import { NotFoundError } from "@/shared/domain/errors/NotFoundError";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("Testing DeleteUser use case", () => {
    let SUT: DeleteUserUseCase.UseCase,
        repository: UserInMemoryRepository;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
        SUT = new DeleteUserUseCase.UseCase(repository);    
    });

    it("Should throw an error when user not found", async () => {
        await expect(SUT.execute({ id: "fakeID" })).rejects.toThrow(new NotFoundError("Entity index not found!"));
    });

    it("Should delete an user", async () => {
        const items = [
            new UserEntity(UserDataBuilder({})),
            new UserEntity(UserDataBuilder({}))
        ];

        repository.items = items;

        await SUT.execute({ id: items[0]._id });

        expect(repository.items).toHaveLength(1);
    });
});