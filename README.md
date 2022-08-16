> [Версия на русском](https://github.com/n3tael/telegraf-bot-base/blob/master/README_ru.md)
# telegraf-bot-base
Base for creating bots on telegraf.js

## **⚠ The project is still under development, if you find a bug, please report it.**

### Capabilities
* Checking the user for permission
* Arguments with sub-commands
* Localization

## Installation
*We assume that you already have the latest version of Node.js installed (everything was tested on version 18.3.0)*
1. Download the project with the command `git clone https://github.com/n3tael/telegraf-bot-base.git`
2. Change the file called `config_example.json`.
```
{
    "token":"249382013:3JDIDIWJID...", - enter the bot token, which can be obtained from bot @botfather
    "ownerID": [ 12345689 ], - IDs of people who will have access to owner-only commands
    "debugMode": false - Enable this feature if you are going to change or add something.
}
```
3. Rename it to `config.json`
4. Run the command `node .`!

> Made with ❤ in Ukraine.
