const Telegraf = require('telegraf')

module.exports = {
    name: "start",
    hidden: true,
    run: async function(ctx) { 
        if (ctx.update.message.chat == 'supergroup' || ctx.update.message.chat == 'group') {
            return ctx.replyWithMarkdown(await l.t("start_group", ctx))
        } else {
            return ctx.replyWithMarkdown(await l.t("start", ctx))
        }
    }
}