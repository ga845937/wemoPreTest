import type { AutoOptions } from "sequelize-auto";

import { SequelizeAuto } from "sequelize-auto";

import { dbConfig } from "../src/env";

const option: AutoOptions = {
    dialect: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    lang: "ts", // the lang of the generated models
    directory: "./src/db/postgres/entity", // where to write files
    caseModel: "p", // convert snake_case column names to camelCase field names: user_id -> userId
    caseFile: "c", // file names created for each model use camelCase.js not snake_case.js
    caseProp: "c", // convert snake_case column names to camelCase field names: user_id -> userId
    singularize: true, // convert plural table names to singular model names
    useDefine: true, // use Object.defineProperty for each property
    indentation: 4,
    additional: {
        timestamps: false, // don't add timestamps fields (createdAt, updatedAt)
    }
};

const auto = new SequelizeAuto(dbConfig.database, dbConfig.username, dbConfig.password, option);

auto.run();
