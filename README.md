<div align="center">

![Skyra Logo](https://cdn.skyra.pw/gh-assets/skyra_avatar.png)

# @skyra/editable-commands

**A framework agnostic library for editable commands**

[![GitHub](https://img.shields.io/github/license/skyra-project/editable-commands)](https://github.com/skyra-project/editable-commands/blob/main/LICENSE.md)

[![npm](https://img.shields.io/npm/v/@skyra/editable-commands?color=crimson&label=NPM&logo=npm&style=flat-square)](https://www.npmjs.com/package/@skyra/editable-commands)

[![Support Server](https://discord.com/api/guilds/254360814063058944/embed.png?style=banner2)](https://join.skyra.pw)

</div>

---

## Features

-   @skyra/editable-commands is a framework agnostic implementation of editable commands for discord.js v13.
-   Supports CommonJS and ES Modules.

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @skyra/editable-commands
```

## Usage

### JavaScript

#### Without a framework

```js
const { send } = require('@skyra/editable-commands');

client.on('messageCreate', (message) => {
	send(message, 'This is my reply!');
});

client.on('messageUpdate', (_oldMessage, newMessage) => {
	send(newMessage, 'This is my new reply!');
});
```

#### With [Sapphire Framework][sapphire]

```js
const { Command } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const { send } = require('@skyra/editable-commands');

module.exports = class UserCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			description: 'A very cool command',
			requiredClientPermissions: ['EMBED_LINKS']
		});
	}

	run(message) {
		const embed = new MessageEmbed()
			.setURL('https://github.com/skyra-project/editable-commands')
			.setColor('#7586D8')
			.setDescription('Example description')
			.setTimestamp();

		return send(message, { embeds: [embed] });
	}
};
```

### TypeScript

#### Without a framework

```ts
import { send } from '@skyra/editable-commands';

client.on('messageCreate', (message) => {
	send(message, 'This is my reply!');
});

client.on('messageUpdate', (_oldMessage, newMessage) => {
	send(newMessage, 'This is my new reply!');
});
```

#### With [Sapphire Framework][sapphire]

```ts
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { send } from '@skyra/editable-commands';

@ApplyOptions<CommandOptions>({
	description: 'A very cool command',
	requiredClientPermissions: ['EMBED_LINKS']
})
export class UserCommand extends Command {
	public run(message: Message) {
		const embed = new MessageEmbed()
			.setURL('https://github.com/skyra-project/editable-commands')
			.setColor('#7586D8')
			.setDescription('Example description')
			.setTimestamp();

		return send(message, { embeds: [embed] });
	}
}
```

---

## Buy us some doughnuts

Skyra Project is open source and always will be, even if we don't get donations. That said, we know there are amazing people who
may still want to donate just to show their appreciation. Thanks you very much in advance!

We accept donations through Patreon, BitCoin, Ethereum, and Litecoin. You can use the buttons below to donate through your method of choice.

| Donate With |         QR         |                                                                  Address                                                                  |
| :---------: | :----------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|   Patreon   | ![PatreonImage][]  |                                               [Click Here](https://www.patreon.com/kyranet)                                               |
|   PayPal    |  ![PayPalImage][]  |                     [Click Here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CET28NRZTDQ8L)                      |
|   BitCoin   | ![BitcoinImage][]  |         [3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco](bitcoin:3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco?amount=0.01&label=Skyra%20Discord%20Bot)          |
|  Ethereum   | ![EthereumImage][] | [0xcB5EDB76Bc9E389514F905D9680589004C00190c](ethereum:0xcB5EDB76Bc9E389514F905D9680589004C00190c?amount=0.01&label=Skyra%20Discord%20Bot) |
|  Litecoin   | ![LitecoinImage][] |         [MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM](litecoin:MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM?amount=0.01&label=Skyra%20Discord%20Bot)         |

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a pull request.

Thank you to all the people who already contributed to Skyra Project!

<a href="https://github.com/skyra-project/editable-commands/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=skyra-project/editable-commands" />
</a>

[contributing]: https://github.com/skyra-project/.github/blob/main/.github/CONTRIBUTING.md
[patreonimage]: https://cdn.skyra.pw/gh-assets/patreon.png
[paypalimage]: https://cdn.skyra.pw/gh-assets/paypal.png
[bitcoinimage]: https://cdn.skyra.pw/gh-assets/bitcoin.png
[ethereumimage]: https://cdn.skyra.pw/gh-assets/ethereum.png
[litecoinimage]: https://cdn.skyra.pw/gh-assets/litecoin.png
[sapphire]: https://github.com/sapphiredev/framework
