import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { UserOutput, UserOutputMapper } from "../../dto/userOutput";
import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";
import { BadRequestError } from "@/shared/application/errors/BadRequestError";

export namespace UpdateUserUseCase {
    export type Input = {
        id: string;
        name: string;
    };

    export type Output = UserOutput;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository
        ) { }

        async execute(input: Input): Promise<Output> {
            if (!input.name) throw new BadRequestError("Name wasn't provided!");

            const userEntity = await this.userRepository.findById(input.id);

            userEntity.update(input.name);

            await this.userRepository.update(userEntity);

            return UserOutputMapper.toOutput(userEntity);
        }
    }
}