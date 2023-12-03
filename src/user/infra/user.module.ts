import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SignUpUseCase } from '../application/useCases/signUpUseCase/SignUpUseCase';
import { UserInMemoryRepository } from './database/in-memory/user.in-memory.repository';
import { BcryptJsHashProvider } from './providers/hash/bcryptjs.hash.provider';
import { UserRepository } from '../domain/repositories/user.repository.contracts';
import { IHashProvider } from '@/shared/application/providers/hash.provider';
import { SignInUseCase } from '../application/useCases/signInUseCase/SignInUseCase';
import { FindUserByIdUseCase } from '../application/useCases/findUserByIdUseCase/FindUserByIdUseCase';
import { ListUsersUseCase } from '../application/useCases/listUsersUseCase/ListUsersUseCase';
import { UpdateUserUseCase } from '../application/useCases/updateUserUseCase/UpdateUserUseCase';
import { UpdatePasswordUseCase } from '../application/useCases/updatePasswordUseCase/UpdatePasswordUseCase';
import { DeleteUserUseCase } from '../application/useCases/deleteUserUseCase/DeleteUserUseCase';

@Module({
    controllers: [UserController],
    providers: [
        {
            provide: "UserRepository",
            useClass: UserInMemoryRepository
        },
        {
            provide: "HashProvider",
            useClass: BcryptJsHashProvider
        },
        {
            provide: SignUpUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository,
                hashProvider: IHashProvider
            ) => {
                return new SignUpUseCase.UseCase(userRepository, hashProvider);
            },
            inject: ["UserRepository", "HashProvider"]
        },
        {
            provide: SignInUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository,
                hashProvider: IHashProvider
            ) => {
                return new SignInUseCase.UseCase(userRepository, hashProvider);
            },
            inject: ["UserRepository", "HashProvider"]
        },
        {
            provide: FindUserByIdUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => {
                return new FindUserByIdUseCase.UseCase(userRepository);
            },
            inject: ["UserRepository"]
        },
        {
            provide: ListUsersUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => {
                return new ListUsersUseCase.UseCase(userRepository);
            },
            inject: ["UserRepository"]
        },
        {
            provide: UpdateUserUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => {
                return new UpdateUserUseCase.UseCase(userRepository);
            },
            inject: ["UserRepository"]
        },
        {
            provide: UpdatePasswordUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository,
                hashProvider: IHashProvider
            ) => {
                return new UpdatePasswordUseCase.UseCase(userRepository, hashProvider);
            },
            inject: ["UserRepository", "HashProvider"]
        },
        {
            provide: DeleteUserUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => {
                return new DeleteUserUseCase.UseCase(userRepository);
            },
            inject: ["UserRepository"]
        }
    ],
})
export class UserModule { }
