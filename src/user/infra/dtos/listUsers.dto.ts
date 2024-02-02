import { SortDirection } from "@/shared/domain/repositories/searchable-repository.contracts";
import { ListUsersUseCase } from "@/user/application/useCases/listUsersUseCase/ListUsersUseCase";
import { IsOptional } from "class-validator";

export class ListUsersDTO implements ListUsersUseCase.Input {
    @IsOptional()
    page?: number;

    @IsOptional()
    perPage?: number;

    @IsOptional()
    sortField?: string;
    
    @IsOptional()
    sortDir?: SortDirection;

    @IsOptional()
    filter?: string;
}