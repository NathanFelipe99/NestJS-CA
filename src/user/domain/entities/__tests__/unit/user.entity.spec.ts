import { UserEntity } from '../../user.entity';
import { UserProps } from '@/user/domain/types/user.types';
import { UserDataBuilder } from '@/user/domain/helper/user-data.builder';

describe('Testing user Entity', () => {
    let props: UserProps,
        SUT: UserEntity;
    
    beforeEach(() => {
        props = UserDataBuilder({});
        SUT = new UserEntity(props);
    });

    it('Constructor method', () => {
        expect(SUT.props.name).toEqual(props.name);
        expect(SUT.props.email).toEqual(props.email);
        expect(SUT.props.password).toEqual(props.password);
        expect(SUT.props.createdAt).toBeInstanceOf(Date);
    });

    it('Name prop getter', () => {
        expect(SUT.props.name).toBeDefined();
        expect(SUT.props.name).toEqual(props.name);
        expect(typeof SUT.props.name).toBe("string");
    });

    it('Name prop setter', () => {
        SUT["name"] = "Test";
        expect(SUT.props.name).toEqual("Test");
        expect(typeof SUT.props.name).toBe("string");
    });

    it('Email prop getter', () => {
        expect(SUT.props.email).toBeDefined();
        expect(SUT.props.email).toEqual(props.email);
        expect(typeof SUT.props.email).toBe("string");
    });

    it('Password prop getter', () => {
        expect(SUT.props.password).toBeDefined();
        expect(SUT.props.password).toEqual(props.password);
        expect(typeof SUT.props.password).toBe("string");
    });

    it('Password prop setter', () => {
        SUT["password"] = "123";
        expect(SUT.props.password).toEqual("123");
        expect(typeof SUT.props.password).toBe("string");
    });

    it('Date prop getter', () => {
        expect(SUT.props.createdAt).toBeDefined();
        expect(SUT.props.createdAt).toEqual(props.createdAt);
        expect(SUT.props.createdAt).toBeInstanceOf(Date);
    });

    it('Update method should update a user', () => {
        SUT.update('John Doe');
        expect(SUT.props.name).toEqual('John Doe');
    });

    it('Update Password method', () => {
        SUT.updatePassword('1234');
        expect(SUT.props.password).toEqual('1234');
    });

});