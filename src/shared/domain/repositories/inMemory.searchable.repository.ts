import { Entity } from "../entities/Entity";
import { InMemoryRepository } from "./inMemory.repository";
import { ISearchableRepository } from "./searchable-repository.contracts";

export abstract class InMemorySearchableRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements ISearchableRepository<E, any, any>
{
    search(props: any): Promise<any> {
        throw new Error("Method not implemented.");
    }   
}