import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

import { dbConfig } from "../../src/env";

const sequelize = new Sequelize({
    dialect: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
});

const migrator = new Umzug({
    migrations: {
        glob: ["migration/*.migration.ts", { cwd: __dirname }],
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

const seeder = new Umzug({
    migrations: {
        glob: ["seed/*.seed.ts", { cwd: __dirname }],
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

const init = async (): Promise<void> => {
    await migrator.up();
    await seeder.up();
};

init();
