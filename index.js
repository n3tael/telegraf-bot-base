const { Telegraf, Context } = require("telegraf");
global.config = require('./config.json')
const bot = new Telegraf(config.token);
const BotCommandController = require("./core/CommandController");
const BotDB = require('./core/DB')
const BotLocalization = require('./core/Localization')
global.Localization = new BotLocalization();
const CommandController = new BotCommandController();
const DB = new BotDB();

CommandController.LoadAllCommands();
CommandController.UploadToBotMenu(bot.telegram)

DB.LoadAllDBModules();
Localization.LoadAllLanguages();

global.l = { // l - localization
    t: async function(str, ctx, ...args) {
        return await Localization.getString(str, ctx, ...args)
    }
}

bot.on('text', (ctx) => {
    CommandController.RunCommand(ctx)
})

bot.launch().then(() => console.info("Bot started succesfully."));