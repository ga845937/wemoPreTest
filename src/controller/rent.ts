import type { RentAttributes } from "@db/postgres/entity/rent";

// import { ErrorMessage } from "@customType/error";
import { CreateRentRequest, ReadRentRequest } from "@customType/rent";
import { RentRoute } from "@customType/route";
import {
    Controller,
    Get, Post, Put,
    Body, Query,
    HttpCode, HttpStatus,
} from "@nestjs/common";
import { RentProvider } from "@provider/rent";
//import { UniqueConstraintError } from "sequelize";

@Controller()
export class RentController {
    constructor(private readonly rentProvider: RentProvider) { }

    @Post(RentRoute.Base)
    @HttpCode(HttpStatus.CREATED)
    public async createRent(@Body() body: CreateRentRequest): Promise<void> {
        return await this.rentProvider.createRent(body);
    }

    @Get(RentRoute.Base)
    @HttpCode(HttpStatus.OK)
    public async readRent(@Query() query: ReadRentRequest): Promise<RentAttributes> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.rentProvider.readRentByPK(query);
    }

    @Put(RentRoute.PickUp)
    @HttpCode(HttpStatus.OK)
    public async pickUp(@Body() body: ReadRentRequest): Promise<void> {
        return await this.rentProvider.pickUp(body);
    }

    @Put(RentRoute.ReturnScooter)
    @HttpCode(HttpStatus.OK)
    public async returnScooter(@Body() body: ReadRentRequest): Promise<void> {
        return await this.rentProvider.returnScooter(body);
    }

}
