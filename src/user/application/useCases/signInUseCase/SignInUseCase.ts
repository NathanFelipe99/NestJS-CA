import { BadRequestError } from "@/shared/application/errors/BadRequestError";
import { UserUseCaseTypes } from "../../types/user.application.types";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { UserOutput, UserOutputMapper } from "../../dto/userOutput";
import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";
import { InvalidCredentialsError } from "@/shared/application/errors/InvalidCredentialsError";

export namespace SignInUseCase {
    export type Input = UserUseCaseTypes.SignInInput;

    export type Output = UserOutput;

    export class UseCase implements DefaultUseCase<Input, Output>{
        constructor(
            private userRepository: UserRepository.Repository,
            private hashProvider: IHashProvider
        ) { }

        async execute(data: Input): Promise<Output> {
            const { email, password } = data;
            if (!email || !password) {
                throw new BadRequestError("Invalid input data!");
            }

            const userEntity = await this.userRepository.findByEmail(email);

            const passwordMatches = await this.hashProvider.compareHash(password, userEntity.password);

            if (!passwordMatches) {
                throw new InvalidCredentialsError("Invalid credentials!");
            }
            
            return UserOutputMapper.toOutput(userEntity);
        }
    }
}
