import type { QueryInterface } from "sequelize";

import { TableName } from "../enum";

export const up = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.bulkInsert(TableName.User, [
        {
            email: "wemo@example.com",
            name: "wemo",
        },
        {
            email: "omew@example.com",
            name: "omew",
        },
    ]);

    await queryInterface.bulkInsert(TableName.Scooter, [
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            license_plate: "ABC-1234",
        },
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            license_plate: "DEF-5678",
        },
    ]);
};

export const down = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.bulkDelete(TableName.User, null, {});
    await queryInterface.bulkDelete(TableName.Scooter, null, {});
};
