import { Entity } from "@/shared/domain/entities/Entity";
import { UserProps } from "../types/user.types";
import { UserValidatorFactory } from "../validators/user.validator";

export class UserEntity extends Entity<UserProps>{

    constructor(public readonly props: UserProps, id?: string) {
        UserEntity.validate(props);
        super(props, id)
        this.props.createdAt = this.props.createdAt ?? new Date();
    }

    static validate(props: UserProps) {
        const validator = UserValidatorFactory.create();
        validator.validate(props);
    }

    get name() {
        return this.props.name;
    }

    private set name(value: string) {
        this.props.name = value;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password;
    }

    private set password(value: string) {
        this.props.password = value;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    update(value: string): void {
        UserEntity.validate({ ...this.props, name: value });
        this.name = value;
    }

    updatePassword(value: string): void {
        UserEntity.validate({ ...this.props, password: value });
        this.password = value;
    }
}
