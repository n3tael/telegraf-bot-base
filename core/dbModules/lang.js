const { DataTypes } = require("sequelize")

module.exports = function(sequelize){
    global.lang = sequelize.define('langsSettings', {
      chatID: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      langSelected: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },{ 
      primaryKey: false,
      freezeTableName: true,
      timestamps: false
    });
    
    lang.sync().then(() => console.log("DB module \"lang\" synced!")).catch(err => console.log("DB module \"lang\" not synced: " + err))
}