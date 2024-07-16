import { GridBase } from "@customType/utility";
import { ScooterAttributes, ScooterPk } from "@db/postgres/entity/scooter";
import { IsNotEmpty, MaxLength, IsOptional, IsString } from "class-validator";

export type ScooterFindByPKAttributes = Pick<ScooterAttributes, ScooterPk>;
export type ScooterModelEnum = ScooterAttributes["model"];
export type ScooterStatusEnum = ScooterAttributes["status"];

export class CreateScooterRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    public licensePlate: string;

    @IsNotEmpty()
    @IsString()
    public model: ScooterModelEnum;
}

export class ReadScooterRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    public licensePlate: string;
}

export class UpdateScooterRequest {
    @IsNotEmpty()
    @IsString()
    public licensePlate: string;

    @IsOptional()
    @IsString()
    public model: ScooterModelEnum;

    @IsOptional()
    @IsString()
    public status: ScooterStatusEnum;
}

export class ReadAvailableScooterRequest extends GridBase {
    @IsOptional()
    @IsString()
    @MaxLength(10)
    public licensePlate: string;

    @IsOptional()
    @IsString()
    public model: ScooterModelEnum;

    @IsOptional()
    @IsString()
    public status: ScooterStatusEnum;
}
