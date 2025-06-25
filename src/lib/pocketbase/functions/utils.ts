import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { Collections } from '$lib/types';

export function getImageUrl(
	collection: Collections,
	recordId: string,
	filename: string,
	size = '0x0'
): string | null {
	return `${PUBLIC_POCKETBASE_URL}/api/files/${collection}/${recordId}/${filename}?thumb=${size}`;
}
