import { faker } from '@faker-js/faker';
import { UserEntity } from '../../user.entity';
import { UserProps } from '@/user/domain/types/user.types';

describe('Testing user Entity', () => {
    let props: UserProps,
        SUT: UserEntity;
    
    beforeEach(() => {
        props = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

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

    it('Date prop getter', () => {
        expect(SUT.props.createdAt).toBeDefined();
        expect(SUT.props.createdAt).toEqual(props.createdAt);
        expect(SUT.props.createdAt).toBeInstanceOf(Date);
    });
});