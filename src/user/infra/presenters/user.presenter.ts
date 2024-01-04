import { UserOutput } from "@/user/application/dto/userOutput";
import { Transform } from "class-transformer";

export namespace UserPresenter {
    type DateTransform  = {
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
}