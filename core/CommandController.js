const fs = require("fs");
const { Markup } = require("telegraf");

const commands = new Map();

class CommandController {
    async LoadAllCommands() {
        const files = fs.readdirSync(__dirname + '/../commands');

        for (const file of files){
            this.LoadCommand(file);
        }
    }
    
    async LoadCommand(fileName) {
        console.info("Loading command " + fileName)
        const command = require(__dirname+`/../commands/${fileName}`);
        const permissionsList = [ "can_manage_chat", "can_change_info", "can_delete_messages", "can_invite_users", "can_restrict_members", "can_pin_messages", "can_promote_members", "can_manage_video_chats" ];
        
        if(command.userNeedPermissions && !permissionsList.includes(command.userNeedPermissions)) {
            for (var i = 0; i < command.userNeedPermissions.length;i++) {
                if(!permissionsList.includes(command.userNeedPermissions[i])) throw new Error("There is no permission "+ command.userNeedPermissions[i]+". The permission must be one of these: "+permissionsList.join(", "))
            }
        }
        
        commands.set(command.name, command);
        console.info("Loaded command " + fileName)
    }

    async UploadToBotMenu(Telegram) {
        const ProcessedCommandList = [];

        for (const command of commands){
            if (command[1].hidden) return;        
        
            ProcessedCommandList.push({command: command[1].name, description: command[1].description});
        }

        Telegram.setMyCommands(ProcessedCommandList)
    }

    async RunCommand(ctx) {
        // Original code: https://github.com/telegraf/telegraf-command-parts
        const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;
        const messageText = ctx.updateType === 'channel_post' ? ctx.channelPost.text : ctx.message.text;
        const parts = regex.exec(messageText);

        if (!parts) return;

        const command = {
          text: messageText,
          command: parts[1],
          bot: parts[2],
          args: parts[3],
          get splitArgs() {
            return !parts[3] ? [] : parts[3].split(/\s+/).filter(arg => arg.length);
          },
        };

        ctx.state.command = command;

        if (commands.has(ctx.state.command.command)){
            const command = commands.get(ctx.state.command.command);
            const user = await ctx.telegram.getChatMember(ctx.update.message.chat.id, ctx.update.message.from.id);

            if (command.ownerOnly && !config.ownerID.includes(ctx.message.from.id)) return ctx.reply(await l.t("command_owner_only_fail", ctx), {reply_to_message_id : ctx.update.message.message_id})
            if (config.debugMode && !config.ownerID.includes(ctx.message.from.id)) return ctx.reply(await l.t("debug_mode_message", ctx))
            
            if((ctx.update.message.chat.type == 'supergroup' || ctx.update.message.chat.type == 'group') && user.status !== "creator" && command.userNeedPermissions) {
                for(var i = 0; i < command.userNeedPermissions.length; i++) {
                    if(!user[command.userNeedPermissions[i]]) { 
                        return ctx.replyWithMarkdown(await l.t("permission_error", ctx, command.userNeedPermissions[i]))
                    }
                };
            }

            if (command.arguments) {
                for(var i = 0; i < command.arguments.length; i++) {
                    if (!ctx.state.command.splitArgs[i] && !command.withSubCommands) {
                        return ctx.replyWithMarkdown(await l.t("no_args_error", ctx, command.name, command.arguments.map(a => `[${a.name}]`).join(" ")))
                    } else if(command.withSubCommands) {
                        return ctx.replyWithMarkdown(await l.t("no_args_error", ctx, command.name, ctx.state.command.splitArgs[0] + " " + command.arguments.map(a => `[${a}]`).join(" ")))
                    }
                };
            }

            command.run(ctx, ctx.state.command.splitArgs);
        }
    }
}

module.exports = CommandController