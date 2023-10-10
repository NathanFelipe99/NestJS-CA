import { faker } from "@faker-js/faker";
import { Props, UserProps } from "../types/user.types";

export function UserDataBuilder(props: Props): UserProps {
    return {
        name: props.name ?? faker.person.fullName(),
        email: props.email ?? faker.internet.email(),
        password: props.password ?? faker.internet.password(),
        createdAt: props.createdAt ?? new Date()
    };
}
