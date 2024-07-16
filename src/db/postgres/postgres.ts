import { PostgresProvider } from "@customType/db";
import { nodeEnv, dbConfig } from "@env";
import { Sequelize } from "sequelize";

import { initModels } from "./entity/init-models";

export const postgresProvider = [
    {
        provide: PostgresProvider.Wemo,
        useFactory: (): ReturnType<typeof initModels> => {
            const sequelizeOption = new Sequelize({
                dialect: "postgres",
                host: dbConfig.host,
                port: dbConfig.port,
                username: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
                logging: nodeEnv === "dev" ? true : false,
            });
            return initModels(sequelizeOption);
        },
    },
    /* other database
    {

    }
    */
];
