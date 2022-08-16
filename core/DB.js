const { Sequelize } = require('sequelize');
const fs = require("fs");

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
});

sequelize.authenticate().then(() => console.log("DB connected!")).catch(err => console.log("DB not connected: " + err))

class DB {
    async LoadAllDBModules() {
        const files = fs.readdirSync(__dirname + '/dbModules');

        for (const file of files){
            this.LoadDBModule(file);
        }
    }

    async LoadDBModule(fileName) {
        require(__dirname + `/dbModules/${fileName}`)(sequelize)
    }
}

module.exports = DB