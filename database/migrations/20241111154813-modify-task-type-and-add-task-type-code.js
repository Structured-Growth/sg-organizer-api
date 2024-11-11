"use strict";

const Sequelize = require("sequelize");

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.changeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "task_type_id", {
			type: Sequelize.SMALLINT,
			allowNull: false,
			references: {
				model: "task_types",
				key: "id",
			},
			onDelete: "RESTRICT",
		});

		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "task_type_code", {
			type: Sequelize.STRING(100),
			allowNull: false,
		});
	},

	async down(queryInterface) {
		await queryInterface.changeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "task_type_id", {
			type: Sequelize.SMALLINT,
			allowNull: false,
		});

		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "task_type_code");
	},
};
