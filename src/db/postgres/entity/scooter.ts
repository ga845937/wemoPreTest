import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Rent, RentId } from './rent';

export interface ScooterAttributes {
    licensePlate: string;
    model: "Kymco Candy 3.0EV" | "Kymco i-One Fly";
    status: "INACTIVE" | "ACTIVE" | "RESERVATION" | "RENT";
}

export type ScooterPk = "licensePlate";
export type ScooterId = Scooter[ScooterPk];
export type ScooterOptionalAttributes = "model" | "status";
export type ScooterCreationAttributes = Optional<ScooterAttributes, ScooterOptionalAttributes>;

export class Scooter extends Model<ScooterAttributes, ScooterCreationAttributes> implements ScooterAttributes {
    licensePlate!: string;
    model!: "Kymco Candy 3.0EV" | "Kymco i-One Fly";
    status!: "INACTIVE" | "ACTIVE" | "RESERVATION" | "RENT";

    // Scooter hasMany Rent via scooterLicensePlate
    rents!: Rent[];
    getRents!: Sequelize.HasManyGetAssociationsMixin<Rent>;
    setRents!: Sequelize.HasManySetAssociationsMixin<Rent, RentId>;
    addRent!: Sequelize.HasManyAddAssociationMixin<Rent, RentId>;
    addRents!: Sequelize.HasManyAddAssociationsMixin<Rent, RentId>;
    createRent!: Sequelize.HasManyCreateAssociationMixin<Rent>;
    removeRent!: Sequelize.HasManyRemoveAssociationMixin<Rent, RentId>;
    removeRents!: Sequelize.HasManyRemoveAssociationsMixin<Rent, RentId>;
    hasRent!: Sequelize.HasManyHasAssociationMixin<Rent, RentId>;
    hasRents!: Sequelize.HasManyHasAssociationsMixin<Rent, RentId>;
    countRents!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof Scooter {
        return sequelize.define('Scooter', {
        licensePlate: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: "機車車牌",
            primaryKey: true,
            field: 'license_plate'
        },
        model: {
            type: DataTypes.ENUM("Kymco Candy 3.0EV","Kymco i-One Fly"),
            allowNull: false,
            defaultValue: "Kymco Candy 3.0EV",
            comment: "機車型號"
        },
        status: {
            type: DataTypes.ENUM("INACTIVE","ACTIVE","RESERVATION","RENT"),
            allowNull: false,
            defaultValue: "INACTIVE",
            comment: "機車狀態"
        }
    }, {
        tableName: 'scooter',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "scooter_pkey",
                unique: true,
                fields: [
                    { name: "license_plate" },
                ]
            },
        ]
    }) as typeof Scooter;
    }
}
