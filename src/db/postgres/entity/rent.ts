import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Scooter, ScooterId } from './scooter';
import type { User, UserId } from './user';

export interface RentAttributes {
    id: string;
    userEmail: string;
    scooterLicensePlate: string;
    status: "RESERVATION" | "RENT" | "CANCEL" | "DONE";
    during?: any[];
    createTime: number;
    updateTime: number;
}

export type RentPk = "id";
export type RentId = Rent[RentPk];
export type RentOptionalAttributes = "id" | "status" | "during" | "createTime" | "updateTime";
export type RentCreationAttributes = Optional<RentAttributes, RentOptionalAttributes>;

export class Rent extends Model<RentAttributes, RentCreationAttributes> implements RentAttributes {
    id!: string;
    userEmail!: string;
    scooterLicensePlate!: string;
    status!: "RESERVATION" | "RENT" | "CANCEL" | "DONE";
    during?: any[];
    createTime!: number;
    updateTime!: number;

    // Rent belongsTo Scooter via scooterLicensePlate
    scooterLicensePlateScooter!: Scooter;
    getScooterLicensePlateScooter!: Sequelize.BelongsToGetAssociationMixin<Scooter>;
    setScooterLicensePlateScooter!: Sequelize.BelongsToSetAssociationMixin<Scooter, ScooterId>;
    createScooterLicensePlateScooter!: Sequelize.BelongsToCreateAssociationMixin<Scooter>;
    // Rent belongsTo User via userEmail
    userEmailUser!: User;
    getUserEmailUser!: Sequelize.BelongsToGetAssociationMixin<User>;
    setUserEmailUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
    createUserEmailUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

    static initModel(sequelize: Sequelize.Sequelize): typeof Rent {
        return sequelize.define('Rent', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            comment: "租賃資料唯一辨識值",
            primaryKey: true
        },
        userEmail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "使用者email",
            references: {
                model: 'user',
                key: 'email'
            },
            field: 'user_email'
        },
        scooterLicensePlate: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: "機車車牌",
            references: {
                model: 'scooter',
                key: 'license_plate'
            },
            field: 'scooter_license_plate'
        },
        status: {
            type: DataTypes.ENUM("RESERVATION","RENT","CANCEL","DONE"),
            allowNull: false,
            defaultValue: "RESERVATION",
            comment: "租賃狀態"
        },
        during: {
            type: DataTypes.RANGE(DataTypes.BIGINT),
            allowNull: true,
            comment: "租賃起迄"
        },
        createTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.literal('floor(EXTRACT(epoch FROM now())) * (1000'),
            comment: "租賃資料建立時間",
            field: 'create_time'
        },
        updateTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.literal('floor(EXTRACT(epoch FROM now())) * (1000'),
            comment: "租賃資料異動時間",
            field: 'update_time'
        }
    }, {
        tableName: 'rent',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "rent_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    }) as typeof Rent;
    }
}
