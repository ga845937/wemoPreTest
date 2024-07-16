import type { UserAttributes, UserPk } from "@db/postgres/entity/user";

import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export type UserFindByPKAttributes = Pick<UserAttributes, UserPk>;
export type UserStatusEnum = UserAttributes["status"];

export class CreateUserRequest {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    public email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    public name: string;
}

export class ReadUserRequest {
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}

export class UpdateUserRequest {
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public status: UserStatusEnum;
}
