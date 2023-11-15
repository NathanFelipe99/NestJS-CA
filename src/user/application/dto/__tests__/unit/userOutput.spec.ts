import { UserEntity } from "@/user/domain/entities/user.entity";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";
import { UserOutputMapper } from "../../userOutput";

describe("UserOutputMapper unit tests", () => {
    let entity: UserEntity;
    let SUT: UserOutputMapper;

    beforeEach(() => {
        entity = new UserEntity(UserDataBuilder({}));
    });

    it("Should convert user in output", async () => {
        const spyOnToJSON = jest.spyOn(entity, "toJSON");
        SUT = UserOutputMapper.toOutput(entity);
        expect(spyOnToJSON).toHaveBeenCalled();
        expect(SUT).toStrictEqual(entity.toJSON());
    });
});