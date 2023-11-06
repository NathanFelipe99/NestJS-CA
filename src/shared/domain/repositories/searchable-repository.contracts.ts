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

export type SearchResultProps<E extends Entity, Filter> = {
    items: E[],
    total: number,
    currentPage: number,
    perPage: number,
    sortField: string | null,
    sortDir: string | null,
    filter: Filter | null
}

export class SearchParams<Filter = string> {
    protected _page: number;
    protected _perPage: number = 15;
    protected _sortField: string | null;
    protected _sortDir: SortDirection | null;
    protected _filter: Filter | null;

    constructor(props: SearchProps<Filter> = {}) {
        this.page = props.page;
        this.perPage = props.perPage;
        this.sortField = props.sortField;
        this.sortDir = props.sortDir;
        this.filter = props.filter;
    }

    get page() {
        return this._page;
    }

    private set page(value: number) {
        let _page = +value;
        if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
            _page = 1;
        }

        this._page = _page;
    }

    get perPage() {
        return this._perPage;
    }

    private set perPage(value: number) {
        let _perPage = (value === true as any) ? 0 : +value;
        if (Number.isNaN(_perPage) || _perPage <= 0 || parseInt(_perPage as any) !== _perPage) {
            _perPage = this._perPage;
        };

        this._perPage = _perPage;
    }

    get sortField() {
        return this._sortField;
    }

    private set sortField(value: string | null) {
        this._sortField = (value && !["boolean", "object"].includes(typeof value)) ? `${value}` : null;
    }

    get sortDir() {
        return this._sortDir;
    }

    private set sortDir(value: SortDirection | null) {
        if (!this._sortField || !value || (["boolean", "object"].includes(typeof value))) {
            this._sortDir = null;
            return;
        };

        const direction = `${value}`.toUpperCase();
        this._sortDir = !["ASC", "DESC"].includes(direction) ? "ASC" : direction as SortDirection;
    }

    get filter(): Filter | null  {
        return this._filter;
    }

    private set filter(value: Filter | null) {
        this._filter = (value && !(["boolean", "object"].includes(typeof value))) ? (`${value}` as any) : null;
    }
}

export class SearchResult<E extends Entity, Filter = string> {
    readonly items: E[];
    readonly total: number;
    readonly currentPage: number;
    readonly perPage: number;
    readonly lastPage: number;
    readonly sortField: string | null;
    readonly sortDir: string | null;
    readonly filter: Filter | null;

    constructor(props: SearchResultProps<E, Filter>) {
        this.items = props.items;
        this.total = props.total;
        this.currentPage = props.currentPage;
        this.perPage = props.perPage;
        this.lastPage = Math.ceil(this.total / this.perPage);
        this.sortField = props.sortField ?? null;
        this.sortDir = props.sortDir ?? null;
        this.filter = props.filter ?? null;
    }

    toJSON(forceEntity: boolean = false) {
        return {
            items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
            total: this.total,
            currentPage: this.currentPage,
            perPage: this.perPage,
            lastPage: this.lastPage,
            sortField: this.sortField,
            sortDir: this.sortDir,
            filter: this.filter
        };
    };
}

export interface ISearchableRepository<
    E extends Entity,
    Filter = string,
    SearchInput = SearchParams<Filter>,
    SearchOutput = SearchResult<E, Filter>
> extends IRepository<E> {
    sortableFiels: string[];
    search(props: SearchInput): Promise<SearchOutput>;
}