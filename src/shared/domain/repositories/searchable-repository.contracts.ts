import { Entity } from "../entities/Entity";
import { IRepository } from "./repository.contracts";

export type SortDirection = "ASC" | "DESC";

export type SearchProps<Filter = string> = {
    page?: number;
    perPage?: number;
    sortField?: string | null;
    sortDir?: SortDirection | null;
    filter?: Filter | null;
}

export class SearchParams {
    protected _page: number;
    protected _perPage: number = 15;
    protected _sort: string | null;
    protected _sortDir: SortDirection | null;
    protected _filter: string | null;

    constructor(props: SearchProps) {
        this._page = props.page;
        this._perPage = props.perPage;
        this._sort = props.sortField;
        this._sortDir = props.sortDir;
        this._filter = props.filter;
    }

    get page() {
        return this._page;
    }

    private set page(value: number) { }

    get perPage() {
        return this._perPage;
    }

    private set perPage(value: number) { }

    get sort() {
        return this._sort;
    }

    private set sort(value: string | null) { }

    get sortDir() {
        return this._sortDir;
    }

    private set sortDir(value: string | null) { }

    get filter() {
        return this._filter;
    }

    private set filter(value: string | null) { }
}

export interface ISearchableRepository<
    E extends Entity,
    SearchInput,
    SearchOutput
> extends IRepository<E> {
    search(props: SearchParams): Promise<SearchOutput>;
}