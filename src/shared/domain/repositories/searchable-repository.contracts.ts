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
    protected _sortField: string | null;
    protected _sortDir: SortDirection | null;
    protected _filter: string | null;

    constructor(props: SearchProps = {}) {
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

    get filter() {
        return this._filter;
    }

    private set filter(value: string | null) {
        this._filter = (value && !(["boolean", "object"].includes(typeof value))) ? `${value}` : null;
    }
}

export interface ISearchableRepository<
    E extends Entity,
    SearchInput,
    SearchOutput
> extends IRepository<E> {
    search(props: SearchParams): Promise<SearchOutput>;
}