import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserUseCaseTypes } from "../../types/user.application.types";
import { UserOutput } from "../../dto/userOutput";
import { UseCase } from "@/shared/application/useCases/UseCase";

export class FindUserByIdUseCase implements UseCase<UserUseCaseTypes.ListInput, UserOutput> {
    constructor(private userRepository: UserRepository.Repository) { }
    
    async execute(data: UserUseCaseTypes.ListInput): Promise<UserOutput> {
        const entity = await this.userRepository.findById(data.id);
        return entity.toJSON();
    }
}