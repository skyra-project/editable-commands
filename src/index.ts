import { Message, MessageOptions, MessagePayload, MessageTarget, ReplyMessageOptions, ReplyOptions, WebhookMessageOptions } from 'discord.js';

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
	const entry = replies.get(message);
	if (entry === undefined) return null;
	if (entry.deleted) {
		replies.delete(message);
		return null;
	}

	return entry;
}

/**
 * Sends a message as a response for `message`, and tracks it.
 * @param message The message to replies to.
 * @param options The options for the message sending, identical to `TextBasedChannel#send`'s options.
 * @returns The response message.
 */
export async function send(message: Message, options: string | MessageOptions | WebhookMessageOptions): Promise<Message> {
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

function resolvePayload(
	target: MessageTarget,
	options: string | MessageOptions | WebhookMessageOptions,
	extra?: MessageOptions | WebhookMessageOptions | undefined
): Promise<MessagePayload> {
	if (typeof options === 'string') options = { content: options };
	else options = { content: null, embeds: [], ...options };

	return MessagePayload.create(target, options, extra).resolveData().resolveFiles();
}

function resolveReplyOptions(message: Message, options: string | ReplyMessageOptions): ReplyOptions {
	if (typeof options === 'string') return { messageReference: message, failIfNotExists: message.client.options.failIfNotExists };
	return { messageReference: message, failIfNotExists: options.failIfNotExists ?? message.client.options.failIfNotExists };
}

async function sendPayload(message: Message, payload: MessagePayload): Promise<Message> {
	const existing = get(message);

	const response = await (existing ? existing.edit(payload) : message.channel.send(payload));
	track(message, response);

	return response;
}
