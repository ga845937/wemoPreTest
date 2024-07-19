import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Rent, RentId } from './rent';

export interface UserAttributes {
    email: string;
    name: string;
    status: "INACTIVE" | "ACTIVE" | "RENT" | "BANNED";
}

export type UserPk = "email";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "status";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    email!: string;
    name!: string;
    status!: "INACTIVE" | "ACTIVE" | "RENT" | "BANNED";

    // User hasMany Rent via userEmail
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

    static initModel(sequelize: Sequelize.Sequelize): typeof User {
        return sequelize.define('User', {
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "使用者email",
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "使用者名稱"
        },
        status: {
            type: DataTypes.ENUM("INACTIVE","ACTIVE","RENT","BANNED"),
            allowNull: false,
            defaultValue: "INACTIVE",
            comment: "使用者狀態"
        }
    }, {
        tableName: 'user',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "user_pkey",
                unique: true,
                fields: [
                    { name: "email" },
                ]
            },
        ]
    }) as typeof User;
    }
}
