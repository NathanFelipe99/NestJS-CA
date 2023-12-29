import { UserEntity } from "../../user.entity";
import { UserProps } from "@/user/domain/types/user.types";
import { UserDataBuilder } from "@/user/domain/helper/user-data.builder";

describe("Testing user Entity", () => {
    let props: UserProps,
        SUT: UserEntity;
    
    beforeEach(() => {
        UserEntity.validate = jest.fn();
        props = UserDataBuilder({});
        SUT = new UserEntity(props);
    });

    it("Constructor method", () => {
        expect(UserEntity.validate).toHaveBeenCalled();
        expect(SUT.props.name).toEqual(props.name);
        expect(SUT.props.email).toEqual(props.email);
        expect(SUT.props.password).toEqual(props.password);
        expect(SUT.props.createdAt).toBeInstanceOf(Date);
    });

    it("Name prop getter", () => {
        expect(SUT.name).toBeDefined();
        expect(SUT.name).toEqual(props.name);
        expect(typeof SUT.name).toBe("string");
    });

    it("Name prop setter", () => {
        SUT["name"] = "Test";
        expect(SUT.props.name).toEqual("Test");
        expect(typeof SUT.props.name).toBe("string");
    });

    it("Email prop getter", () => {
        expect(SUT.email).toBeDefined();
        expect(SUT.email).toEqual(props.email);
        expect(typeof SUT.email).toBe("string");
    });

    it("Password prop getter", () => {
        expect(SUT.password).toBeDefined();
        expect(SUT.password).toEqual(props.password);
        expect(typeof SUT.password).toBe("string");
    });

    it("Password prop setter", () => {
        SUT["password"] = "123";
        expect(SUT.props.password).toEqual("123");
        expect(typeof SUT.props.password).toBe("string");
    });

    it("Date prop getter", () => {
        expect(SUT.createdAt).toBeDefined();
        expect(SUT.createdAt).toEqual(props.createdAt);
        expect(SUT.createdAt).toBeInstanceOf(Date);
    });

    it("Update method should update a user", () => {
        expect(UserEntity.validate).toHaveBeenCalled();
        SUT.update("John Doe");
        expect(SUT.props.name).toEqual("John Doe");
    });

    it("Update Password method", () => {
        expect(UserEntity.validate).toHaveBeenCalled();
        SUT.updatePassword("1234");
        expect(SUT.props.password).toEqual("1234");
    });

});