import type { RESTPatchAPIChannelMessageJSONBody } from 'discord-api-types/v6';
import {
	APIMessage,
	APIMessageContentResolvable,
	Message,
	MessageAdditions,
	MessageOptions,
	SplitOptions,
	StringResolvable,
	Structures
} from 'discord.js';

export const messageRepliesCache = new WeakMap<Message, readonly Message[]>();

export class ExtendedMessage extends Structures.get('Message') {
	public send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
	public send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
	public send(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
	public send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
	public send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
	public send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
	public async send(content: any, options?: any): Promise<Message | Message[]> {
		const combinedOptions = APIMessage.transformOptions(content, options);

		const resolved = new APIMessage(this.channel, combinedOptions).resolveData();
		const multiple = Array.isArray(Reflect.get(resolved.data!, 'content'));
		const newMessages = resolved.split().map((mes) => {
			const data = mes.data as RESTPatchAPIChannelMessageJSONBody | null;
			if (data) {
				// Command editing should always remove embeds and content if none is provided
				data.embed ??= null;
				data.content ??= null;
			}

			return mes;
		});

		const responses = messageRepliesCache.get(this)?.filter((message) => !message.deleted) ?? [];

		// If the message was configured to send multiple messages:
		if (multiple) {
			// We create two queues, one for deletes, another for updates:
			const deletePromises: Promise<unknown>[] = [];
			const messagePromises: Promise<Message>[] = [];

			// For each message we are sending:
			while (newMessages.length) {
				// We will remove the message from the queue, and remove the first message from the responses:
				const newMessage = newMessages.shift()!;
				const oldMessage = responses.shift();

				// If there are no more responses to be edited, we send a new message:
				if (oldMessage === undefined) {
					messagePromises.push(this.channel.send(newMessage) as Promise<Message>);
					continue;
				}

				// If the current message contained an attachment, we delete the message and unshift, so we check for the next response:
				if (oldMessage.attachments.size > 0) {
					deletePromises.push(oldMessage.delete().catch(() => null));
					newMessages.unshift(newMessage);
					continue;
				}

				// The response can be edited as it has no attachments, we fetch the message
				messagePromises.push(oldMessage.edit(newMessage).then(() => oldMessage));
			}

			while (responses.length) {
				deletePromises.push(
					responses
						.shift()!
						.delete()
						.catch(() => null)
				);
			}

			if (deletePromises.length > 0) await Promise.all(deletePromises);
			const newResponses = await Promise.all(messagePromises);

			messageRepliesCache.set(this, newResponses);
			return newResponses;
		}

		// If there are too many messages, delete the extra ones.
		if (responses.length > 1) await Promise.all(responses.map((message) => message.delete().catch(() => null)));

		// If there is at least one message...
		if (responses.length > 0) {
			const [response] = responses;

			// And said message had a file...
			if (response.attachments.size > 0) {
				// Then delete the file and fallback.
				await this.channel.messages.delete(response.id);
			} else {
				// Otherwise, we fetch the message, just to make sure it exists:
				const previousMessage = await this.channel.messages.fetch(response.id).catch(() => null);

				// If the message existed, we edit it and return the original message (not the one returned by the method):
				if (previousMessage !== null) {
					await previousMessage.edit(newMessages[0]);
					return previousMessage;
				}
			}
		}

		// Fallback for all previous conditions: we send a message, set it as a response, and return the sent message:
		const message = (await this.channel.send(newMessages[0])) as Message;
		messageRepliesCache.set(this, [message]);
		return message;
	}
}

declare module 'discord.js' {
	export interface Message {
		send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
		send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
		send(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
		send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
		send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
		send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
	}
}

Structures.extend('Message', () => ExtendedMessage);
