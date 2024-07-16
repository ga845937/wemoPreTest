import type { ValidationError } from "@nestjs/common";

import { Injectable, ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { validate } from "class-validator";

const getAllConstraints = (error: ValidationError[]): string[] => {
    const constraints: string[] = [];

    for (const thisError of error) {
        if (thisError.constraints) {
            const constraintValues = Object.values(thisError.constraints);
            constraints.push(...constraintValues);
        }

        if (thisError.children) {
            const childConstraints = getAllConstraints(thisError.children);
            constraints.push(...childConstraints);
        }
    }

    return constraints;
};

@Injectable()
export class Validator extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (error: ValidationError[]): unknown => new HttpException(getAllConstraints(error), HttpStatus.UNPROCESSABLE_ENTITY),
        });
    }

    public internalValidate = async (instance: object): Promise<void> => {
        const error: ValidationError[] = await validate(instance);

        if (error.length > 0) {
            throw this.exceptionFactory(error);
        }
    };
}
