import { Exclude, Expose } from "class-transformer";
import { PaginationPresenter } from "./pagination.presenter";

export abstract class CollectionPresenter {
    
    @Exclude()
    protected paginationPresenter: PaginationPresenter.Presenter;

    constructor(props: PaginationPresenter.Presenter) {
        this.paginationPresenter = new PaginationPresenter.Presenter(props);
    }
    
    @Expose({ name: "meta" })
    getMeta() {
        return this.paginationPresenter;
    }

    abstract get data(): any;
}