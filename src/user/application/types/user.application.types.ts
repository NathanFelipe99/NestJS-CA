export namespace UserUseCaseTypes {
    export type SignUpInput = {
        name: string;
        email: string;
        password: string;
    }
    
    export type ListInput = {
        id: string;
    }
}