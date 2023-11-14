import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";
import { UserOutput } from "../../dto/userOutput";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { SearchInput } from "@/shared/application/dtos/searchInput";

export namespace ListUsersUseCase{

    export type Input = SearchInput;

    export type Output = void;
    
    export class UseCase implements DefaultUseCase<Input, Output>{
        constructor(private userRepository: UserRepository.Repository) { }

        async execute(searchData: Input): Promise<Output> {
            const params = new UserRepository.SearchParams(searchData);
            const userSearchResult = await this.userRepository.search(params);
            return;
        }

    }
}