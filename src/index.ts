import {
	Constants,
	DiscordAPIError,
	Message,
	MessageOptions,
	MessagePayload,
	MessageTarget,
	ReplyMessageOptions,
	ReplyOptions,
	WebhookMessageOptions
} from 'discord.js';

const replies = new WeakMap<Message, Message>();

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
export async function send(message: Message, options: string | Options): Promise<Message> {
	const payload = await resolvePayload(message.channel, options);
	return sendPayload(message, payload);
}

/**
 * Sends a reply message as a response for `message`, and tracks it.
 * @param message The message to replies to.
 * @param options The options for the message sending, identical to `TextBasedChannel#send`'s options.
 * @returns The response message.
 */
export async function reply(message: Message, options: string | ReplyMessageOptions): Promise<Message> {
	const payload = await resolvePayload(message.channel, options, { reply: resolveReplyOptions(message, options) });
	return sendPayload(message, payload);
}

function resolvePayload(target: MessageTarget, options: string | Options, extra?: Options | undefined): Promise<MessagePayload> {
	options =
		typeof options === 'string'
			? { content: options, embeds: [], attachments: [], components: [], files: [], allowedMentions: undefined }
			: { content: null, embeds: [], attachments: [], components: [], files: [], allowedMentions: undefined, ...options };
	return MessagePayload.create(target, options, extra).resolveData().resolveFiles();
}

function resolveReplyOptions(message: Message, options: string | ReplyMessageOptions): ReplyOptions {
	if (typeof options === 'string') return { messageReference: message, failIfNotExists: message.client.options.failIfNotExists };
	return { messageReference: message, failIfNotExists: options.failIfNotExists ?? message.client.options.failIfNotExists };
}

async function tryEdit(message: Message, response: Message, payload: MessagePayload) {
	try {
		return await response.edit(payload);
	} catch (error) {
		// If the error isn't a Discord API Error, re-throw:
		if (!(error instanceof DiscordAPIError)) throw error;

		// If the error isn't caused by the error triggered by editing a deleted
		// message, re-throw:
		if (error.code !== Constants.APIErrors.UNKNOWN_MESSAGE) throw error;

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

async function sendPayload(message: Message, payload: MessagePayload): Promise<Message> {
	const existing = get(message);

	const response = await (existing ? tryEdit(message, existing, payload) : message.channel.send(payload));
	track(message, response);

	return response;
}

type Options = MessageOptions | WebhookMessageOptions;
