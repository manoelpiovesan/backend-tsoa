import {AllowNull, AutoIncrement, Column, DataType, PrimaryKey, Table, Model} from "sequelize-typescript";

@Table({
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    freezeTableName: true,
    underscored: true
})
/*
    Explanation of @Table decorator options:

    tableName: The name of the table in the database.
    timestamps: Whether to add createdAt and updatedAt timestamps.
    createdAt: The name of the createdAt field in the database.
    freezeTableName: Whether to use the table name as is, without pluralization.
    underscored: Whether to use snake_case for column names.
 */
export class User extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    username: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password: string;
}