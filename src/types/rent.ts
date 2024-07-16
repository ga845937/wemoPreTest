import type { RentAttributes, RentPk } from "@db/postgres/entity/rent";

import {
    ArrayMinSize, ArrayMaxSize,
    Min,
    IsNotEmpty, IsOptional,
    IsArray,
    IsEmail, IsString, IsNumber
} from "class-validator";

export type RentFindByPKAttributes = Pick<RentAttributes, RentPk>;
export type RentStatusEnum = RentAttributes["status"];

export class CreateRentRequest {
    @IsNotEmpty()
    @IsEmail()
    public userEmail: string;

    @IsNotEmpty()
    @IsString()
    public scooterLicensePlate: string;

    @IsOptional()
    @IsArray()
    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { each: true })
    @Min(1720000000000, { each: true })
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    public during?: number[];
}

export class ReadRentRequest {
    @IsNotEmpty()
    @IsString()
    public id: string;
}

export class UpdateRentRequest {
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsEmail()
    public userEmail: string;

    @IsNotEmpty()
    @IsString()
    public scooterLicensePlate: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { each: true })
    @Min(1720000000000, { each: true })
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    public during: number[];

    @IsOptional()
    public status: RentStatusEnum;
}
