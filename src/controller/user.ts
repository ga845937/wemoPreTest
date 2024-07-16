import type { UserAttributes } from "@db/postgres/entity/user";

import { ErrorMessage } from "@customType/error";
import { UserRoute } from "@customType/route";
import { CreateUserRequest, ReadUserRequest, UpdateUserRequest } from "@customType/user";
import {
    Controller,
    Get, Post, Put, Delete,
    Body, Query,
    HttpException,
    HttpCode, HttpStatus,
} from "@nestjs/common";
import { UserProvider } from "@provider/user";
import { UniqueConstraintError } from "sequelize";

@Controller()
export class UserController {
    constructor(private readonly userProvider: UserProvider) { }

    @Post(UserRoute.Base)
    @HttpCode(HttpStatus.CREATED)
    public async createUser(@Body() body: CreateUserRequest): Promise<void> {
        try {
            return await this.userProvider.createUser(body);
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException(ErrorMessage.UserExists, HttpStatus.CONFLICT);
            }
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(UserRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async readUser(@Query() query: ReadUserRequest): Promise<UserAttributes> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.userProvider.readUserByPK(query);
    }

    @Put(UserRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async updateUser(@Body() body: UpdateUserRequest): Promise<void> {
        return await this.userProvider.updateUser(body);
    }

    @Delete(UserRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async deleteUser(@Query() query: ReadUserRequest): Promise<void> {
        return await this.userProvider.deleteUser(query.email);
    }
}
