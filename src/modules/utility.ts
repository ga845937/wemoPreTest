import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { PostgresModule } from "@db/postgres";
import { Module } from "@nestjs/common";
import { Validator } from "@pipe/validator";

const metadata: ModuleMetadata = {
    imports: [PostgresModule] as Type<unknown>[],
    controllers: [] as Type<unknown>[],
    providers: [Validator] as Provider[],
    exports: [PostgresModule, Validator] as Provider[],
};

@Module(metadata)

export class UtilityModule { }
