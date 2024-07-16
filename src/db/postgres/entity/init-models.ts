import type { Sequelize } from "sequelize";
import { Rent as _Rent } from "./rent";
import type { RentAttributes, RentCreationAttributes } from "./rent";
import { Scooter as _Scooter } from "./scooter";
import type { ScooterAttributes, ScooterCreationAttributes } from "./scooter";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
    _Rent as Rent,
    _Scooter as Scooter,
    _User as User,
};

export type {
    RentAttributes,
    RentCreationAttributes,
    ScooterAttributes,
    ScooterCreationAttributes,
    UserAttributes,
    UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
    const Rent = _Rent.initModel(sequelize);
    const Scooter = _Scooter.initModel(sequelize);
    const User = _User.initModel(sequelize);

    Rent.belongsTo(Scooter, { as: "scooterLicensePlateScooter", foreignKey: "scooterLicensePlate"});
    Scooter.hasMany(Rent, { as: "rents", foreignKey: "scooterLicensePlate"});
    Rent.belongsTo(User, { as: "userEmailUser", foreignKey: "userEmail"});
    User.hasMany(Rent, { as: "rents", foreignKey: "userEmail"});

    return {
        Rent: Rent,
        Scooter: Scooter,
        User: User,
    };
}
