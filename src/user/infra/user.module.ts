import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SignUpUseCase } from '../application/useCases/signUpUseCase/SignUpUseCase';
import { UserInMemoryRepository } from './database/in-memory/user.in-memory.repository';
import { BcryptJsHashProvider } from './providers/hash/bcryptjs.hash.provider';
import { UserRepository } from '../domain/repositories/user.repository.contracts';
import { IHashProvider } from '@/shared/application/providers/hash.provider';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
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
                return new SignUpUseCase.UseCase(userRepository, hashProvider)
            },
            inject: ["UserRepository", "HashProvider"]
        }
    ],
})
export class UserModule { }
