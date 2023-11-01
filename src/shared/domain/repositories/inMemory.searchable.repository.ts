import { Entity } from "../entities/Entity";
import { InMemoryRepository } from "./inMemory.repository";
import { ISearchableRepository, SearchParams, SearchResult } from "./searchable-repository.contracts";

export abstract class InMemorySearchableRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements ISearchableRepository<E, any, any>
{
    sortableFiels: string[] = [];

    async search(props: SearchParams): Promise<SearchResult<E>> {
        const filteredItems = await this.applyFilter(this.items, props.filter);
        const sortedItems = await this.applySort(filteredItems, props.sortField, props.sortDir);
        const paginatedItems = await this.applyPaginate(sortedItems, props.page, props.perPage);

        return new SearchResult({
            items: paginatedItems,
            total: this.items.length,
            currentPage: props.page,
            perPage: props.perPage,
            sortDir: props.sortDir,
            sortField: props.sortField,
            filter: props.filter
        });
    }

    protected abstract applyFilter(items: E[], filter: string | null): Promise<E[]>;

    protected async applySort(items: E[], sortField: string | null, sortDir: string | null): Promise<E[]> {
        if (!sortField || !this.sortableFiels.includes(sortField)) {
            return items;
        }
        
        return [...items].sort((a, b) => {
            return a.props[sortField] < b.props[sortField] ? (sortDir === "ASC" ? -1 : 1) :
                a.props[sortField] > b.props[sortField] ? (sortDir === "ASC" ? 1 : -1) : 0;
        });
    }

    protected async applyPaginate(items: E[], page: SearchParams["page"], perPage: SearchParams["perPage"]): Promise<E[]> {
        const start = (page - 1) * perPage;
        const limit = start + perPage;

        return items.slice(start, limit);
    }
}