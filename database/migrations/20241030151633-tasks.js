"use strict";

const Sequelize = require("sequelize");

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.createTable(
			{
				schema: process.env.DB_SCHEMA,
				tableName: "tasks",
			},
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				org_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				region: {
					type: Sequelize.STRING(10),
					allowNull: false,
				},
				priority: {
					type: Sequelize.STRING(15),
					allowNull: false,
				},
				task_type_id: {
					type: Sequelize.SMALLINT,
					allowNull: false,
				},
				task_detail: {
					type: Sequelize.STRING(255),
					allowNull: false,
				},
				assigned_account_id: {
					type: Sequelize.INTEGER,
				},
				assigned_user_id: {
					type: Sequelize.INTEGER,
				},
				assigned_group_id: {
					type: Sequelize.INTEGER,
				},
				created_by_account_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				created_by_user_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				start_date: Sequelize.DATE,
				due_date: Sequelize.DATE,
				status: {
					type: Sequelize.STRING(15),
					allowNull: false,
				},
				created_at: Sequelize.DATE,
				updated_at: Sequelize.DATE,
				deleted_at: Sequelize.DATE,
			}
		);
	},

	async down(queryInterface) {
		await queryInterface.dropTable({
			schema: process.env.DB_SCHEMA,
			tableName: "tasks",
		});
	},
};
