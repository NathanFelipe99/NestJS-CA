import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserOutput, UserOutputMapper } from "../../dto/userOutput";
import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";
import { InvalidPasswordError } from "@/shared/application/errors/InvalidPasswordError";
import { BcryptJsHashProvider } from "@/user/infra/providers/hash/bcryptjs.hash.provider";

export namespace UpdatePasswordUseCase {
    export type Input = {
        id: string;
        currentPassword: string;
        newPassword: string;
    };

    export type Output = UserOutput;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private hashProvider: BcryptJsHashProvider
        ) { }

        async execute(input: Input): Promise<Output> {
            const { currentPassword, newPassword } = input;
            const userEntity = await this.userRepository.findById(input.id);

            if (!currentPassword || !newPassword) throw new InvalidPasswordError("Current and old passwords required!");
            
            const verifyOldPassword = await this.hashProvider.compareHash(currentPassword, userEntity.password);

            if (!verifyOldPassword) {
                throw new InvalidPasswordError("Current password doesn't match!");
            }

            const hashedPassword = await this.hashProvider.generateHash(newPassword);

            userEntity.updatePassword(hashedPassword);

            await this.userRepository.update(userEntity);

            return UserOutputMapper.toOutput(userEntity);
        }
    }
}