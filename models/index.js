const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");

const sequilize = new Sequelize(
  dbConfig.DB_NAME,
  dbConfig.DB_USER,
  dbConfig.DB_PASSWORD,
  {
    port: dbConfig.DB_PORT,
    host: dbConfig.DB_HOST,
    dialect: dbConfig.DB_DIALECT,
    operatorsAliases: true,
  }
);
sequilize
  .authenticate()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("Error in connecting database => ", err);
  });

(async () => {
  try {
    await sequilize.sync({ force: false });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
module.exports = sequilize;
