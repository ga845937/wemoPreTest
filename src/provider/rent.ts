import type { CreateRentRequest, ReadRentRequest } from "@customType/rent";
import type { ScooterFindByPKAttributes } from "@customType/scooter";
import type { UserFindByPKAttributes } from "@customType/user";
import type { UserAttributes, initModels } from "@db/postgres/entity/init-models";
import type { RentCreationAttributes, RentAttributes } from "@db/postgres/entity/rent";
import type { ScooterAttributes } from "@db/postgres/entity/scooter";
import type { CreateOptions, NonNullFindOptions, FindOptions, UpdateOptions } from "sequelize";

import { PostgresProvider } from "@customType/db";
import { ErrorMessage } from "@customType/error";
import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { Validator } from "@pipe/validator";
import { ScooterProvider } from "@provider/scooter";
import { UserProvider } from "@provider/user";
import { Op } from "sequelize";

/**
 * TODO: ADD job to check if user is overdue
 * 1. schedule (cron)
 * 2. event driven
 * 3. lazy check, like lazy load
 * 4. webSocket
 * 5. gRPC
 */

@Injectable()
export class RentProvider {
    constructor(
        @Inject(PostgresProvider.Wemo) private readonly wemoDB: ReturnType<typeof initModels>,
        @Inject(Validator) private readonly validator: Validator,
        @Inject(ScooterProvider) private readonly scooterProvider: ScooterProvider,
        @Inject(UserProvider) private readonly userProvider: UserProvider
    ) { }

    private readRentalInfo = async (during: number[], userEmail: string): Promise<RentAttributes> => {
        // ? 已在租車狀態還可以預約下次租車時間?
        // check if this user is already renting
        const findOption: FindOptions<RentAttributes> = {
            raw: true,
            where: {
                userEmail,
                during: {
                    [Op.overlap]: during
                }
            },
        };
        const rentalInfo = await this.wemoDB.Rent.findOne(findOption);

        //// raw SQL version
        // const rawSQL = "SELECT * FROM rent WHERE user_email = :userEmail AND during && int8range(:realDuring) limit 1;";
        // const [rentalInfo] = await this.wemoDB.Rent.sequelize.query(rawSQL, {
        //     raw: true,
        //     replacements: { userEmail: body.userEmail, realDuring },
        //     type: QueryTypes.SELECT,
        // });
        // console.log(rentalInfo);
        return rentalInfo;
    };

    public createRent = async (body: CreateRentRequest): Promise<void> => {
        // TODO: redis lock for High Concurrency, lock by scooterLicensePlate and

        const readScooterData: ScooterFindByPKAttributes = {
            licensePlate: body.scooterLicensePlate,
        };
        const { status: scooterStatus } = await this.scooterProvider.readScooterByPK(readScooterData);
        if (scooterStatus !== "ACTIVE") {
            throw new HttpException(ErrorMessage.ScooterNotInServie, HttpStatus.BAD_REQUEST);
        }

        const readUserData: UserFindByPKAttributes = {
            email: body.userEmail,
        };
        const { status: userStatus } = await this.userProvider.readUserByPK(readUserData);
        if (userStatus !== "ACTIVE") {
            throw new HttpException(ErrorMessage.UserNotInServie, HttpStatus.BAD_REQUEST);
        }

        const realDuring = body.during && body.during.length === 2 ? body.during : [+new Date(), 9999999999999];
        const rentalInfo = await this.readRentalInfo(realDuring, body.userEmail);
        if (rentalInfo && rentalInfo.status !== "CANCEL") {
            throw new HttpException(ErrorMessage.UserIsAlreadyRenting, HttpStatus.BAD_REQUEST);
        }

        const transaction = await this.wemoDB.Rent.sequelize.transaction();
        try {
            const updateScooterOption: UpdateOptions<ScooterAttributes> = {
                where: {
                    licensePlate: body.scooterLicensePlate,
                },
                transaction
            };
            await this.wemoDB.Scooter.update({ status: "RESERVATION" }, updateScooterOption);

            const createRentData: RentCreationAttributes = {
                userEmail: body.userEmail,
                scooterLicensePlate: body.scooterLicensePlate,
                during: realDuring,
            };
            const createRentOption: CreateOptions<RentCreationAttributes> = {
                // ! defaultValue: DataTypes.UUIDV4 HAS BUG, 先改成指定 INSERT 欄位
                fields: ["userEmail", "scooterLicensePlate", "during"],
                transaction
            };

            await this.wemoDB.Rent.create(createRentData, createRentOption);

            await transaction.commit();
        }
        catch (error) {
            console.error(error);
            await transaction.rollback();
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    public readRentByPK = async ({ id }: ReadRentRequest): Promise<RentAttributes> => {
        const findOption: NonNullFindOptions<RentAttributes> = {
            rejectOnEmpty: true,
            raw: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.wemoDB.Rent.findByPk(id, findOption);
    };

    public pickUp = async ({ id }: ReadRentRequest): Promise<void> => {
        const readRentData: ReadRentRequest = { id };
        const rentalInfo = await this.readRentByPK(readRentData);
        if (rentalInfo.status !== "RESERVATION") {
            throw new HttpException(ErrorMessage.IsNotReserved, HttpStatus.BAD_REQUEST);
        }
        const now = +new Date();
        if (rentalInfo.during[0].value > now || rentalInfo.during[1].value < now) {
            throw new HttpException(ErrorMessage.RentTimeIsNotValid, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const readScooterData: ScooterFindByPKAttributes = {
            licensePlate: rentalInfo.scooterLicensePlate,
        };
        const { status: scooterStatus } = await this.scooterProvider.readScooterByPK(readScooterData);
        if (scooterStatus !== "RESERVATION") {
            // TODO: cancel rental
            throw new HttpException(ErrorMessage.ScooterIsNotReserved, HttpStatus.BAD_REQUEST);
        }

        const transaction = await this.wemoDB.Rent.sequelize.transaction();
        try {
            const updateScooterOption: UpdateOptions<ScooterAttributes> = {
                where: {
                    licensePlate: rentalInfo.scooterLicensePlate,
                },
                transaction
            };
            await this.wemoDB.Scooter.update({ status: "RENT" }, updateScooterOption);

            const updateUserOption: UpdateOptions<UserAttributes> = {
                where: {
                    email: rentalInfo.userEmail,
                }
            };
            await this.wemoDB.User.update({ status: "RENT" }, updateUserOption);

            const updateRentOption: UpdateOptions<RentAttributes> = {
                where: {
                    id,
                },
                transaction
            };

            await this.wemoDB.Rent.update({
                status: "RENT",
                updateTime: now,
            }, updateRentOption);

            transaction.commit();
        }
        catch (error) {
            console.error(error);
            await transaction.rollback();
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    public returnScooter = async ({ id }: ReadRentRequest): Promise<void> => {
        const readRentData: ReadRentRequest = { id };
        const rentalInfo = await this.readRentByPK(readRentData);
        if (rentalInfo.status !== "RENT") {
            throw new HttpException(ErrorMessage.IsNotRental, HttpStatus.BAD_REQUEST);
        }

        const transaction = await this.wemoDB.Rent.sequelize.transaction();
        try {
            const updateScooterOption: UpdateOptions<ScooterAttributes> = {
                where: {
                    licensePlate: rentalInfo.scooterLicensePlate,
                },
                transaction
            };
            await this.wemoDB.Scooter.update({ status: "ACTIVE" }, updateScooterOption);

            const updateUserOption: UpdateOptions<UserAttributes> = {
                where: {
                    email: rentalInfo.userEmail,
                }
            };
            await this.wemoDB.User.update({ status: "ACTIVE" }, updateUserOption);

            const updateRentOption: UpdateOptions<RentAttributes> = {
                where: {
                    id,
                },
                transaction
            };

            await this.wemoDB.Rent.update({
                status: "DONE",
                during: [rentalInfo.during[0], +new Date()],
                updateTime: +new Date(),
            }, updateRentOption);

            transaction.commit();
        }
        catch (error) {
            console.error(error);
            await transaction.rollback();
            throw new HttpException(ErrorMessage.ServerError, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };
}
