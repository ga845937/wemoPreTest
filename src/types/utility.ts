import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class GridBase {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    public offset: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    public limit: number;
}
