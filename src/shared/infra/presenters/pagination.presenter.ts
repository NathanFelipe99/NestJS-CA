import { Transform } from "class-transformer";

export namespace PaginationPresenter {
    export type PaginationPresenterProps = {
        currentPage: number;
        perPage: number;
        lastPage: number;
        total: number;
    }

    export class Presenter {
        @Transform(({ value }) => parseInt(value))
        currentPage: number;
        @Transform(({ value }) => parseInt(value))
        perPage: number;
        @Transform(({ value }) => parseInt(value))
        lastPage: number;
        @Transform(({ value }) => parseInt(value))
        total: number;

        constructor(props: PaginationPresenterProps) {
            const keys = Object.keys(props);
            for (let index = 0; index < keys["length"]; index++) {
                const key = keys[index];
                this[key] = props[key];
            }
        }
    }
}