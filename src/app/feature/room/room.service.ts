import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import roomsData from '../../../data/rooms.json';
import { Room } from './room.interface';

type RawRoom = Partial<Room> & Record<string, unknown>;

const ROOM_TRANSLATION_PATH = '/i18n/room';
const _fallbackRooms: Room[] = _normalizeRooms(roomsData as RawRoom[]);
const _fallbackRoomBySlug = new Map(_fallbackRooms.map((room) => [room.slug, room]));

export const roomSlugs = _fallbackRooms.map((room) => room.slug);

export function findFallbackRoomBySlug(slug: string) {
	return _fallbackRoomBySlug.get(slug) ?? _fallbackRooms[0] ?? null;
}

@Injectable({
	providedIn: 'root',
})
export class RoomService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _languageService = inject(LanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly rooms = signal<Room[]>(_fallbackRooms);
	readonly isLoading = signal(true);

	loadTranslations() {
		if (!this._isBrowser) {
			return;
		}

		const language = this._languageService.language();

		void this._translateService.loadExtraTranslation(ROOM_TRANSLATION_PATH, {
			language,
		});
	}

	resolveRooms(rooms: RawRoom[] | null | undefined) {
		this.rooms.set(
			Array.isArray(rooms) && rooms.length > 0 ? _normalizeRooms(rooms) : _fallbackRooms,
		);
		this.isLoading.set(false);
	}

	finishLoading() {
		this.isLoading.set(false);
	}
}

function _normalizeRooms(rooms: RawRoom[]) {
	return rooms
		.map((room, index) => _normalizeRoom(room, index))
		.filter((room): room is Room => Boolean(room));
}

function _normalizeRoom(room: RawRoom | null | undefined, index: number): Room | null {
	const name = _stringOrFallback(room?.name ?? room?.['title']);
	const description = _stringOrFallback(room?.description ?? room?.['summary']);
	const image = _stringOrFallback(room?.image);

	if (!name || !description || !image) {
		return null;
	}

	const slugSource = room?.slug ?? room?.['id'] ?? name;

	return {
		slug: _slugOrFallback(slugSource, index),
		name,
		description,
		price: _stringOrFallback(room?.price),
		image,
		imageAlt: _stringOrFallback(room?.imageAlt, name),
		size: _stringOrFallback(room?.size),
		occupancy: _stringOrFallback(room?.occupancy),
		bed: _stringOrFallback(room?.bed),
		bathroom: _stringOrFallback(room?.bathroom),
		body: _stringsOrFallback(room?.body, [description]),
		amenities: _stringsOrFallback(room?.amenities, []),
	};
}

function _slugOrFallback(value: unknown, index: number): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return `room-${value}`;
	}

	const normalized = _stringOrFallback(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || `room-${index + 1}`;
}

function _stringOrFallback(value: unknown, fallback = ''): string {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function _stringsOrFallback(value: unknown, fallback: string[]): string[] {
	if (!Array.isArray(value)) {
		return fallback;
	}

	const strings = value
		.map((item) => _stringOrFallback(item))
		.filter((item) => item.length > 0);

	return strings.length ? strings : fallback;
}
