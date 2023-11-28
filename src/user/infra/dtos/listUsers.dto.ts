import { SortDirection } from "@/shared/domain/repositories/searchable-repository.contracts";
import { ListUsersUseCase } from "@/user/application/useCases/listUsersUseCase/ListUsersUseCase";

export class ListUsersDTO implements ListUsersUseCase.Input {
    page?: number;
    perPage?: number;
    sortField?: string;
    sortDir?: SortDirection;
    filter?: string;
}