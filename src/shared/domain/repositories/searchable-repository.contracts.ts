import { Entity } from "../entities/Entity";
import { IRepository } from "./repository.contracts";

export interface ISearchableRepository<E extends Entity, SearchInput, SearchOutput> extends IRepository<E> {
    search(props: SearchInput): Promise<SearchOutput>;
}