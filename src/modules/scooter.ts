import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { ScooterController } from "@controller/scooter";
import { UtilityModule } from "@modules/utility";
import { Module } from "@nestjs/common";
import { ScooterProvider } from "@provider/scooter";

const metadata: ModuleMetadata = {
    imports: [UtilityModule] as Type<unknown>[],
    controllers: [ScooterController] as Type<unknown>[],
    providers: [ScooterProvider] as Provider[],
    exports: [ScooterProvider] as Provider[],
};

@Module(metadata)

export class ScooterModule { }
