import type { ScooterAttributes } from "@db/postgres/entity/scooter";

import { ErrorMessage } from "@customType/error";
import { ScooterRoute } from "@customType/route";
import { CreateScooterRequest, ReadScooterRequest, UpdateScooterRequest } from "@customType/scooter";
import {
    Controller,
    Get, Post, Put, Delete,
    Body, Query,
    HttpException,
    HttpCode, HttpStatus,
} from "@nestjs/common";
import { ScooterProvider } from "@provider/scooter";
import { UniqueConstraintError } from "sequelize";

@Controller()
export class ScooterController {
    constructor(private readonly scooterProvider: ScooterProvider) { }

    @Post(ScooterRoute.Base)
    @HttpCode(HttpStatus.CREATED)
    public async createScooter(@Body() body: CreateScooterRequest): Promise<void> {
        try {
            return await this.scooterProvider.createScooter(body);
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException(ErrorMessage.ScooterLicensePlateExists, HttpStatus.CONFLICT);
            }
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(ScooterRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async readScooter(@Query() query: ReadScooterRequest): Promise<ScooterAttributes> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.scooterProvider.readScooter(query.licensePlate);
    }

    @Put(ScooterRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async updateScooter(@Body() body: UpdateScooterRequest): Promise<void> {
        return await this.scooterProvider.updateScooter(body);
    }

    @Delete(ScooterRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async deleteScooter(@Query() query: ReadScooterRequest): Promise<void> {
        return await this.scooterProvider.deleteScooter(query.licensePlate);
    }
}
