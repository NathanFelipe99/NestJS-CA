import { UserInMemoryRepository } from "@/user/infra/database/in-memory/user.in-memory.repository";
import { FindUserByIdUseCase } from "../../findUserByIdUseCase/FindUserByIdUseCase";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("Testing FindUserById use case ", () => {
    let SUT: FindUserByIdUseCase,
        repository: UserInMemoryRepository;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
        SUT = new FindUserByIdUseCase(repository);
    });

    it("Should throws error when entity is not found", async () => {
        await expect(() => SUT.execute({ id: "fakeID" })).rejects.toThrowError("Entity not found!");
    });

    it("Should find an user by ID", async () => {
        const findByIdSpyOn = jest.spyOn(repository, "findById");
        const items: UserEntity[] = [
            new UserEntity(UserDataBuilder({})),
            new UserEntity(UserDataBuilder({}))
        ];

        repository.items = items;

        const entityResult = await SUT.execute({ id: items[0]._id });
        expect(findByIdSpyOn).toHaveBeenCalledTimes(1);
        expect(entityResult).toMatchObject(items[0].props);
    });
});