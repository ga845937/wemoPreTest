import type { AutoOptions } from "sequelize-auto";

import { readdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

import { SequelizeAuto } from "sequelize-auto";

import { dbConfig } from "../src/env";

const outputDirectory = "./src/db/postgres/entity"; // the directory where the models will be created
// delete all files in the output directory
readdirSync(outputDirectory).forEach((file: string) => {
    unlinkSync(join(outputDirectory, file));
});

// create .keep file
writeFileSync(join(outputDirectory, ".keep"), "");

const option: AutoOptions = {
    dialect: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    lang: "ts", // the lang of the generated models
    directory: outputDirectory, // where to write files
    caseModel: "p", // convert snake_case column names to camelCase field names: user_id -> userId
    caseFile: "c", // file names created for each model use camelCase.js not snake_case.js
    caseProp: "c", // convert snake_case column names to camelCase field names: user_id -> userId
    singularize: true, // convert plural table names to singular model names
    useDefine: true, // use Object.defineProperty for each property
    indentation: 4,
    additional: {
        timestamps: false, // don't add timestamps fields (createdAt, updatedAt)
    },
    skipTables: ["SequelizeMeta"], // don't generate models for these tables
};

const auto = new SequelizeAuto(dbConfig.database, dbConfig.username, dbConfig.password, option);

auto.run();
