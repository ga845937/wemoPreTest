import type { ModuleMetadata, Provider } from "@nestjs/common";

import { Module } from "@nestjs/common";

import { postgresProvider } from "./postgres/postgres";

const metadata: ModuleMetadata = {
    providers: postgresProvider as Provider[],
    exports: postgresProvider as Provider[],
};

@Module(metadata)
export class PostgresModule { }
