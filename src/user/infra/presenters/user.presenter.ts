import { CollectionPresenter as DefaultCollectionPresenter } from "@/shared/infra/presenters/collection.presenter";
import { UserOutput } from "@/user/application/dto/userOutput";
import { ListUsersUseCase } from "@/user/application/useCases/listUsersUseCase/ListUsersUseCase";
import { Transform } from "class-transformer";

export namespace UserPresenter {
    type DateTransform = {
        value: Date
    };

    export class Presenter {
        id: string;
        name: string;
        email: string;
        @Transform(({ value }: DateTransform) => value.toISOString())
        createdAt: Date;

        constructor(userOutput: UserOutput) {
            this.id = userOutput.id;
            this.name = userOutput.name;
            this.email = userOutput.email;
            this.createdAt = userOutput.createdAt;
        }
    }

    export class CollectionPresenter extends DefaultCollectionPresenter {
        data: UserPresenter.Presenter[];

        constructor(output: ListUsersUseCase.Output) {
            const { items, ...paginationProps } = output;
            super(paginationProps);
            this.data = items.map((item) => new Presenter(item));
        }
    }
}