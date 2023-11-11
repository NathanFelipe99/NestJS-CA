import { BadRequestError } from "@/user/application/errors/BadRequestError";
import { UserUseCaseTypes } from "../../types/user.application.types";
import { IUserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { IHashProvider } from "@/shared/application/providers/hash.provider";

export class SignUpUseCase {
    constructor(
        private userRepository: IUserRepository.Repository,
        private hashProvider: IHashProvider
    ) { }

    async execute(data: UserUseCaseTypes.SignUpInput): Promise<UserUseCaseTypes.SignUpOutput>{
        const { email, name, password } = data;
        if (!email || !name || !password) {
            throw new BadRequestError("Invalid input data!");
        }

        await this.userRepository.emailExists(email);

        const encryptedPassword = await this.hashProvider.generateHash(password);
        const entity = new UserEntity({ email, name, password: encryptedPassword });
        
        await this.userRepository.insert(entity);

        return entity.toJSON();
    }
}