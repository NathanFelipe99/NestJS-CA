export namespace UserUseCaseTypes {
    export type SignUpInput = {
        name: string;
        email: string;
        password: string;
    }

    export type SignUpOutput = {
        id: string;
        name: string;
        email: string;
        password: string;
        createdAt: Date;
    }
}