import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideHubLoading } from '../loading-config';
import { HubLoadingService } from './loading.service';

describe('HubLoadingService', () => {
	let service: HubLoadingService;

	/** The overlay lives on `document.body`, outside any fixture. */
	const overlay = (): HTMLElement | null => document.body.querySelector('hub-loading');

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HubLoadingService);
	});

	afterEach(() => {
		service.hideAll();
	});

	describe('reference counter', () => {
		it('is idle until somebody asks', () => {
			expect(service.isLoading()).toBe(false);
		});

		it('stays busy until every caller has balanced its show', () => {
			service.show();
			service.show();
			expect(service.isLoading()).toBe(true);

			service.hide();
			expect(service.isLoading()).toBe(true);

			service.hide();
			expect(service.isLoading()).toBe(false);
		});

		it('clamps at zero so a stray hide cannot swallow the next show', () => {
			service.hide();
			service.hide();
			expect(service.isLoading()).toBe(false);

			service.show();
			expect(service.isLoading()).toBe(true);
		});

		it('hideAll drops every pending caller at once', () => {
			service.show();
			service.show();
			service.show();

			service.hideAll();

			expect(service.isLoading()).toBe(false);
			expect(overlay()).toBeNull();
		});
	});

	describe('overlay lifecycle', () => {
		it('mounts a fullscreen overlay on the document body', () => {
			service.show();

			const element = overlay();
			expect(element).not.toBeNull();
			expect(element!.parentElement).toBe(document.body);
			expect(element!.classList.contains('hub-loading--fullscreen')).toBe(true);
			expect(element!.getAttribute('role')).toBe('status');
		});

		it('mounts a single overlay however many callers pile up', () => {
			service.show();
			service.show();

			expect(document.body.querySelectorAll('hub-loading')).toHaveLength(1);
		});

		it('removes the overlay from the DOM once the last caller is done', () => {
			service.show();
			service.hide();

			expect(overlay()).toBeNull();
		});

		it('mounts a fresh overlay after a full teardown', () => {
			service.show();
			service.hide();
			service.show();

			expect(document.body.querySelectorAll('hub-loading')).toHaveLength(1);
		});
	});

	describe('options', () => {
		it('renders the options given to show', () => {
			service.show({ message: 'Saving…', variant: 'dots', size: 'lg', ariaLabel: 'Saving' });

			expect(overlay()!.querySelector('.hub-loading__message')!.textContent!.trim()).toBe('Saving…');
			expect(overlay()!.querySelector('.hub-loading__indicator--dots')).not.toBeNull();
			expect(overlay()!.classList.contains('hub-loading--lg')).toBe(true);
			expect(overlay()!.getAttribute('aria-label')).toBe('Saving');
		});

		it('composes nested show calls instead of resetting them', () => {
			service.show({ message: 'Saving…', variant: 'bars' });
			service.show({ message: 'Uploading…' });

			expect(overlay()!.querySelector('.hub-loading__message')!.textContent!.trim()).toBe('Uploading…');
			expect(overlay()!.querySelector('.hub-loading__indicator--bars')).not.toBeNull();
		});

		it('update re-dresses the overlay without touching the counter', () => {
			service.show({ message: 'Step 1' });

			service.update({ message: 'Step 2' });

			expect(overlay()!.querySelector('.hub-loading__message')!.textContent!.trim()).toBe('Step 2');
			service.hide();
			expect(service.isLoading()).toBe(false);
		});

		it('clears a message with null but leaves it alone for undefined', () => {
			service.show({ message: 'Step 1' });

			service.update({ variant: 'pulse' });
			expect(overlay()!.querySelector('.hub-loading__message')!.textContent!.trim()).toBe('Step 1');

			service.update({ message: null });
			expect(overlay()!.querySelector('.hub-loading__message')).toBeNull();
		});

		it('forgets the options of a finished operation', () => {
			service.show({ message: 'Saving…' });
			service.hide();

			service.show();

			expect(overlay()!.querySelector('.hub-loading__message')).toBeNull();
		});

		it('renders a branding image instead of the built-in indicator', () => {
			service.show({ image: '/assets/logo.svg', imageAnimation: 'pulse' });

			const image = overlay()!.querySelector<HTMLImageElement>('img.hub-loading__image');
			expect(image).not.toBeNull();
			expect(image!.classList.contains('hub-loading__image--pulse')).toBe(true);
			expect(overlay()!.querySelector('.hub-loading__indicator')).toBeNull();
		});

		it('drops the backdrop when the caller opts out', () => {
			service.show({ backdrop: false });

			expect(overlay()!.classList.contains('hub-loading--backdrop')).toBe(false);
		});
	});

	describe('configuration defaults', () => {
		beforeEach(() => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				providers: [provideHubLoading({ variant: 'ring', size: 'sm', ariaLabel: 'Cargando', backdrop: false })]
			});
			service = TestBed.inject(HubLoadingService);
		});

		it('dresses the overlay from the application configuration', () => {
			service.show();

			expect(overlay()!.querySelector('.hub-loading__indicator--ring')).not.toBeNull();
			expect(overlay()!.classList.contains('hub-loading--sm')).toBe(true);
			expect(overlay()!.classList.contains('hub-loading--backdrop')).toBe(false);
			expect(overlay()!.getAttribute('aria-label')).toBe('Cargando');
		});

		it('lets a per-call option win over the application configuration', () => {
			service.show({ variant: 'pulse' });

			expect(overlay()!.querySelector('.hub-loading__indicator--pulse')).not.toBeNull();
			expect(overlay()!.classList.contains('hub-loading--sm')).toBe(true);
		});
	});
});
