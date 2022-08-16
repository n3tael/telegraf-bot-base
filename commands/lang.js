module.exports = {
    name: "lang",
    description: "Language settings",
    userNeedPermissions: ["can_change_info"],
    run: async function(ctx, args) {
        switch(args[0]) {
            default:
                ctx.replyWithMarkdown(await l.t("lang_list", ctx, await Localization.languages.map(c => `\`${c}\``).join(", ")))
                break;
            case "set": 
                const selectedLang = args[1];
                if (await Localization.isLangExists(selectedLang)) {
                    const currentLang = await lang.findOrCreate({where:{chatID: ctx.update.message.chat.id},defaults: {langSelected: selectedLang}})
                    await lang.update({langSelected: selectedLang},{where:{chatID: ctx.update.message.chat.id}})
                    if(ctx.update.message.chat.type == 'supergroup' || ctx.update.message.chat.type == 'group') {
                        return ctx.replyWithMarkdown(await l.t("lang_group_success_changed", ctx, selectedLang))
                    } else {
                        return ctx.replyWithMarkdown(await l.t("lang_success_changed", ctx, selectedLang))
                    }
                } else {
                    return ctx.replyWithMarkdown(await l.t("lang_change_fail", ctx))
                }
        }
    }
}