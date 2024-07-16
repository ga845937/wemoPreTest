import type { CreateUserRequest, UpdateUserRequest, UserFindByPKAttributes } from "@customType/user";
import type { initModels } from "@db/postgres/entity/init-models";
import type { UserCreationAttributes, UserAttributes } from "@db/postgres/entity/user";
import type { NonNullFindOptions, UpdateOptions, DestroyOptions } from "sequelize";

import { PostgresProvider } from "@customType/db";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class UserProvider {
    constructor(
        @Inject(PostgresProvider.Wemo) private readonly wemoDB: ReturnType<typeof initModels>
    ) { }

    public createUser = async (body: CreateUserRequest): Promise<void> => {
        const data: UserCreationAttributes = {
            email: body.email,
            name: body.name,
            status: "INACTIVE"
        };

        await this.wemoDB.User.create(data);
    };

    public readUserByPK = async ({ email }: UserFindByPKAttributes): Promise<UserAttributes> => {
        const findOption: NonNullFindOptions<UserAttributes> = {
            rejectOnEmpty: true,
            raw: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.wemoDB.User.findByPk(email, findOption);
    };

    public updateUser = async (body: UpdateUserRequest): Promise<void> => {
        const { email, ...updateProperty } = body;

        const updateOption: UpdateOptions<UserAttributes> = {
            where: {
                email,
            }
        };

        await this.wemoDB.User.update(updateProperty, updateOption);
    };

    public deleteUser = async (email: string): Promise<void> => {
        const deleteOption: DestroyOptions<UserAttributes> = {
            where: {
                email,
            }
        };

        await this.wemoDB.User.destroy(deleteOption);
    };
}
