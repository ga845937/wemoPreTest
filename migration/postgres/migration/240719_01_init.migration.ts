import type { QueryInterface } from "sequelize";

import { DataTypes } from "sequelize";

import { TableName, TypeName } from "../enum";

export const up = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.UserStatus} AS ENUM ('INACTIVE', 'ACTIVE', 'RENT', 'BANNED');`);
    await queryInterface.createTable(TableName.User, {
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            comment: "使用者email",
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "使用者名稱",
        },
        status: {
            type: TypeName.UserStatus,
            defaultValue: "INACTIVE",
            allowNull: false,
            comment: "使用者狀態",
        },
    });

    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.ScooterModel} AS ENUM ('Kymco Candy 3.0EV', 'Kymco i-One Fly');`);
    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.ScooterStatus} AS ENUM ('INACTIVE', 'ACTIVE', 'RESERVATION', 'RENT');`);
    await queryInterface.createTable(TableName.Scooter, {
        licensePlate: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
            comment: "機車車牌",
            field: "license_plate",
        },
        model: {
            type: TypeName.ScooterModel,
            defaultValue: "Kymco Candy 3.0EV",
            allowNull: false,
            comment: "機車型號",
        },
        status: {
            type: TypeName.ScooterStatus,
            defaultValue: "INACTIVE",
            allowNull: false,
            comment: "機車狀態",
        },
    });

    await queryInterface.sequelize.query(`CREATE TYPE ${TypeName.RentStatus} AS ENUM ('RESERVATION', 'RENT', 'CANCEL', 'DONE');`);
    await queryInterface.createTable(TableName.Rent, {
        id: {
            type: DataTypes.UUID,
            defaultValue: queryInterface.sequelize.literal("uuid_generate_v4()"),
            allowNull: false,
            primaryKey: true,
            comment: "租賃資料唯一辨識值",
        },
        userEmail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: { model: TableName.User, key: "email" },
            comment: "使用者email",
            field: "user_email",
        },
        scooterLicensePlate: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: { model: TableName.Scooter, key: "license_plate" },
            comment: "機車車牌",
            field: "scooter_license_plate",
        },
        status: {
            type: TypeName.RentStatus,
            defaultValue: "RESERVATION",
            allowNull: false,
            comment: "租賃狀態",
        },
        during: {
            type: DataTypes.RANGE(DataTypes.BIGINT),
            allowNull: true,
            comment: "租賃起迄",
        },
        createTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: queryInterface.sequelize.literal("FLOOR(EXTRACT(epoch FROM now())) * (1000)"),
            field: "create_time",
            comment: "租賃資料建立時間",
        },
        updateTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: queryInterface.sequelize.literal("FLOOR(EXTRACT(epoch FROM now())) * (1000)"),
            field: "update_time",
            comment: "租賃資料異動時間",
        }
    });
};

export const down = async ({ context: queryInterface }: Record<string, QueryInterface>): Promise<void> => {
    await queryInterface.dropTable(TableName.User);
    await queryInterface.dropTable(TableName.Scooter);
    await queryInterface.dropTable(TableName.Rent);

    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.UserStatus};`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.ScooterModel};`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.ScooterStatus};`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${TypeName.RentStatus};`);
};
