import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { RentController } from "@controller/rent";
import { ScooterModule } from "@modules/scooter";
import { UtilityModule } from "@modules/utility";
import { Module } from "@nestjs/common";
import { RentProvider } from "@provider/rent";
import { UserProvider } from "@provider/user";

const metadata: ModuleMetadata = {
    imports: [UtilityModule, ScooterModule] as Type<unknown>[],
    controllers: [RentController] as Type<unknown>[],
    providers: [RentProvider, UserProvider] as Provider[],
    exports: [] as Provider[],
};

@Module(metadata)

export class RentModule { }
