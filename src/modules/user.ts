import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { UserController } from "@controller/user";
import { UtilityModule } from "@modules/utility";
import { Module } from "@nestjs/common";
import { UserProvider } from "@provider/user";

// info module
const metadata: ModuleMetadata = {
    imports: [UtilityModule] as Type<unknown>[],
    controllers: [UserController] as Type<unknown>[],
    providers: [UserProvider] as Provider[],
    exports: [UserProvider] as Provider[],
};

@Module(metadata)

export class UserModule { }
