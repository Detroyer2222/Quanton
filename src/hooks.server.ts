import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { dev } from '$app/environment';
import { Collections, type TypedPocketBase } from '$lib/types';

const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			const user = await event.locals.pb.collection(Collections.Users).authRefresh();
			event.locals.user = user.record;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);

	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ secure: dev ? false : true })
	);

	return response;
};

export const handle: Handle = handleAuth;
