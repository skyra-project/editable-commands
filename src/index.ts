import {
	DiscordAPIError,
	MessagePayload,
	RESTJSONErrorCodes,
	type Message,
	type MessageCreateOptions,
	type MessageEditOptions,
	type MessageReplyOptions,
	type ReplyOptions
} from 'discord.js';

const replies = new WeakMap<Message, Message>();

export type MessageOptions = MessageCreateOptions | MessageReplyOptions | MessageEditOptions;

/**
 * Tracks a response with a message, in a way that if {@link send} is called with `message`, `response` will be edited.
 * @param message The message to track when editing.
 * @param response The response to edit when using send with `message`.
 */
export function track(message: Message, response: Message): void {
	replies.set(message, response);
}

/**
 * Removes the tracked response for `message`.
 * @param message The message to free from tracking.
 * @returns Whether the message was tracked.
 */
export function free(message: Message): boolean {
	return replies.delete(message);
}

/**
 * Gets the tracked response to `message`, if any was tracked and was not deleted.
 * @param message The message to get the reply from.
 * @returns The replied message, if any.
 */
export function get(message: Message): Message | null {
	return replies.get(message) ?? null;
}

/**
 * Sends a message as a response for `message`, and tracks it.
 * @param message The message to replies to.
 * @param options The options for the message sending, identical to `TextBasedChannel#send`'s options.
 * @returns The response message.
 */
export function send(message: Message, options: string | MessageOptions): Promise<Message> {
	return handle(message, options);
}

/**
 * Sends a reply message as a response for `message`, and tracks it.
 * @param message The message to replies to.
 * @param options The options for the message sending, identical to `TextBasedChannel#send`'s options.
 * @returns The response message.
 */
export function reply(message: Message, options: string | MessageOptions): Promise<Message> {
	const replyOptions: ReplyOptions =
		typeof options === 'string'
			? { messageReference: message, failIfNotExists: message.client.options.failIfNotExists }
			: { messageReference: message, failIfNotExists: Reflect.get(options, 'failIfNotExists') ?? message.client.options.failIfNotExists };

	return handle(message, options, { reply: replyOptions });
}

async function handle<T extends MessageOptions>(message: Message, options: string | T, extra?: T | undefined): Promise<Message> {
	const existing = get(message);

	const payloadOptions = existing ? resolveEditPayload(existing, options as MessageEditOptions) : resolveSendPayload<T>(options);
	const payload = await MessagePayload.create(message.channel, payloadOptions, extra).resolveBody().resolveFiles();
	const response = await (existing ? tryEdit(message, existing, payload) : message.channel.send(payload));
	track(message, response);

	return response;
}

function resolveSendPayload<T extends MessageOptions>(options: string | MessageOptions): T {
	return typeof options === 'string' ? ({ content: options, components: [] } as unknown as T) : ({ components: [], ...options } as T);
}

function resolveEditPayload(response: Message, options: string | MessageEditOptions): MessageEditOptions {
	options = resolveSendPayload<MessageEditOptions>(options);
	if (response.embeds.length) options.embeds ??= [];
	if (response.attachments.size) options.attachments ??= [];
	return options;
}

async function tryEdit(message: Message, response: Message, payload: MessagePayload) {
	try {
		return await response.edit(payload);
	} catch (error) {
		// If the error isn't a Discord API Error, re-throw:
		if (!(error instanceof DiscordAPIError)) throw error;

		// If the error isn't caused by the error triggered by editing a deleted
		// message, re-throw:
		if (error.code !== RESTJSONErrorCodes.UnknownMessage) throw error;

		// Free the response temporarily, serves a dual purpose here:
		//
		// - A following `send()` (before a new one was sent) call will not
		//   trigger this error again.
		// - If the message send throws, no response will be stored.
		//
		// We always call `track()` right after `tryEdit()`, so it'll be tracked
		// once the message has been sent, provided it did not throw.
		free(message);
		return message.channel.send(payload);
	}
}
