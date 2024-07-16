import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { RentModule } from "@modules/rent";
import { ScooterModule } from "@modules/scooter";
import { UserModule } from "@modules/user";
import { Module } from "@nestjs/common";

const metadata: ModuleMetadata = {
    imports: [UserModule, ScooterModule, RentModule] as Type<unknown>[],
    controllers: [] as Type<unknown>[],
    providers: [] as Provider[],
    exports: [] as Provider[],
};

@Module(metadata)

export class MainModule { }
