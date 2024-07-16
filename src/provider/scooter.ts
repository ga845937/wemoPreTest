import type { CreateScooterRequest, UpdateScooterRequest, ScooterFindByPKAttributes } from "@customType/scooter";
import type { initModels } from "@db/postgres/entity/init-models";
import type { ScooterCreationAttributes, ScooterAttributes } from "@db/postgres/entity/scooter";
import type { NonNullFindOptions, FindOptions, UpdateOptions, DestroyOptions, WhereOptions } from "sequelize";

import { PostgresProvider } from "@customType/db";
// import { ErrorMessage } from "@customType/error";
import { Injectable, Inject } from "@nestjs/common";
import { Validator } from "@pipe/validator";

@Injectable()
export class ScooterProvider {
    constructor(
        @Inject(PostgresProvider.Wemo) private readonly wemoDB: ReturnType<typeof initModels>,
        @Inject(Validator) private readonly validator: Validator
    ) { }

    public createScooter = async (body: CreateScooterRequest): Promise<void> => {
        const data: ScooterCreationAttributes = {
            licensePlate: body.licensePlate,
            model: body.model,
            status: "INACTIVE"
        };

        await this.wemoDB.Scooter.create(data);
    };

    public readScooterByPK = async ({ licensePlate }: ScooterFindByPKAttributes): Promise<ScooterAttributes> => {
        const findOption: NonNullFindOptions<ScooterAttributes> = {
            rejectOnEmpty: true,
            raw: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.wemoDB.Scooter.findByPk(licensePlate, findOption);
    };

    public readScooter = async (licensePlate: string): Promise<ScooterAttributes> => {
        const findOption: NonNullFindOptions<ScooterAttributes> = {
            rejectOnEmpty: true,
            raw: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.wemoDB.Scooter.findByPk(licensePlate, findOption);
    };

    public updateScooter = async (body: UpdateScooterRequest): Promise<void> => {
        const { licensePlate, ...updateProperty } = body;

        const updateOption: UpdateOptions<ScooterAttributes> = {
            where: {
                licensePlate,
            }
        };

        await this.wemoDB.Scooter.update(updateProperty, updateOption);
    };

    public deleteScooter = async (licensePlate: string): Promise<void> => {
        const deleteOption: DestroyOptions<ScooterAttributes> = {
            where: {
                licensePlate,
            }
        };

        await this.wemoDB.Scooter.destroy(deleteOption);
    };

    public readAvailableScooter = async (where: WhereOptions<ScooterAttributes>, offset: number, limit: number): Promise<{ rows: ScooterAttributes[], count: number }> => {
        const findOption: FindOptions<ScooterAttributes> = {
            raw: true,
            where,
            offset,
            limit,
        };

        return await this.wemoDB.Scooter.findAndCountAll(findOption);
    };
}
