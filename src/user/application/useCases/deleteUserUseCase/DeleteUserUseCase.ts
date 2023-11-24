import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";

export namespace DeleteUserUseCase {
    export type Input = {
        id: string;
    };
    
    export type Output = void;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository
        ) {}

        async execute(data: Input): Promise<Output> {
            await this.userRepository.delete(data.id);
        }
    }
}