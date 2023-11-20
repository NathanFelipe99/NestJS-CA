import { BadRequestError } from "@/shared/application/errors/BadRequestError";
import { UserUseCaseTypes } from "../../types/user.application.types";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserEntity } from "@/user/domain/entities/user.entity";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { UserOutput, UserOutputMapper } from "../../dto/userOutput";
import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";

export namespace SignUpUseCase {
    export type Input = UserUseCaseTypes.SignUpInput;

    export type Output = UserOutput;

    export class UseCase implements DefaultUseCase<UserUseCaseTypes.SignUpInput, UserOutput>{
        constructor(
            private userRepository: UserRepository.Repository,
            private hashProvider: IHashProvider
        ) { }

        async execute(data: UserUseCaseTypes.SignUpInput): Promise<UserOutput> {
            const { email, name, password } = data;
            if (!email || !name || !password) {
                throw new BadRequestError("Invalid input data!");
            }

            await this.userRepository.emailExists(email);

            const encryptedPassword = await this.hashProvider.generateHash(password);
            const entity = new UserEntity({ email, name, password: encryptedPassword });

            await this.userRepository.insert(entity);

            return UserOutputMapper.toOutput(entity);
        }
    }
}
