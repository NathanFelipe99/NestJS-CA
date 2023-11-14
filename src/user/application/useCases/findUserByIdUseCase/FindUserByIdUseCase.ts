import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserUseCaseTypes } from "../../types/user.application.types";
import { UserOutput } from "../../dto/userOutput";
import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";

export namespace FindUserByIdUseCase {
    export type Input = UserUseCaseTypes.ListInput;

    export type Output = UserOutput;
        
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(private userRepository: UserRepository.Repository) { }

        async execute(data: Input): Promise<Output> {
            const entity = await this.userRepository.findById(data.id);
            return entity.toJSON();
        }
    }
}