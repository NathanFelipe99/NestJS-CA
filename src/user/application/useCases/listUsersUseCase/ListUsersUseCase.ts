import { UseCase as DefaultUseCase } from "@/shared/application/useCases/UseCase";
import { UserOutput, UserOutputMapper } from "../../dto/userOutput";
import { UserRepository } from "@/user/domain/repositories/user.repository.contracts";
import { SearchInput } from "@/shared/application/dtos/searchInput";
import { PaginationOutput, PaginationOutputMapper } from "@/shared/application/dtos/paginationOutput";

export namespace ListUsersUseCase {

    export type Input = SearchInput;

    export type Output = PaginationOutput<UserOutput>;

    export class UseCase implements DefaultUseCase<Input, Output>{
        constructor(private userRepository: UserRepository.Repository) { }

        async execute(searchData: Input): Promise<Output> {
            const params = new UserRepository.SearchParams(searchData);
            const userSearchResult = await this.userRepository.search(params);
            return this.toOutput(userSearchResult);
        }

        private toOutput(searchResult: UserRepository.SearchResult): Output {
            const items = searchResult.items.map((item) => {
                return UserOutputMapper.toOutput(item)
            });
            
            return PaginationOutputMapper.toOutput(items, searchResult);
        }
    }
}