const util = require("util")
const fs = require("fs")

const languages = new Map();

class UelameLocalization {
    async LoadAllLanguages() {
        const files = fs.readdirSync(__dirname + '/../languages');

        for (const file of files){
            this.LoadLanguage(file);
        }
    }

    async LoadLanguage(fileName) {
        const language = require(__dirname+`/../languages/${fileName}`);
        languages.set(language.name, language);
    }

    async getString(str, ctx, ...args) {
        const currentLang = await lang.findOrCreate(
            {
                where: {
                    chatID: ctx.update.message.chat.id
                },
                defaults:{
                    langSelected: "en"
                }
            }
        )
        const langStrs = languages.get(currentLang[0].langSelected);
        return langStrs[str] ? util.format(langStrs[str], ...args) : `${str} ${args.join(' ')}`; 
    }
    
    async isLangExists(name) {
        if (languages.has(name)) return true;
        else return false;
    }

    get languages(){
        return Array.from(languages.keys());
    }
}

module.exports = UelameLocalization;