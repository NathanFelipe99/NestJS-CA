import { BadRequestError } from "@/shared/domain/errors/BadRequestError";
import { UserUseCaseTypes } from "../types/user.application.types";
import { IUserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserEntity } from "@/user/domain/entities/user.entity";

export class SignUpUseCase {
    constructor(private userRepository: IUserRepository.Repository) {}

    async execute(data: UserUseCaseTypes.SignUpInput): Promise<UserUseCaseTypes.SignUpOutput>{
        const { email, name, password } = data;
        if (!email || !name || !password) {
            throw new BadRequestError("Invalid input data!");
        }

        await this.userRepository.emailExists(email);

        const entity = new UserEntity({ email, name, password });
        await this.userRepository.insert(entity);

        return entity.toJSON();
    }
}