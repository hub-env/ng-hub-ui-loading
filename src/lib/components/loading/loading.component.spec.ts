import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { HUB_LOADING_CONFIG, HUB_LOADING_DEFAULT_CONFIG } from '../../loading-config';
import { HubLoadingImageAnimation, HubLoadingMode, HubLoadingSize, HubLoadingVariant } from '../../models/loading.types';
import { HubLoadingComponent } from './loading.component';

@Component({
	standalone: true,
	imports: [HubLoadingComponent],
	template: `
		<hub-loading
			[mode]="mode()"
			[variant]="variant()"
			[image]="image()"
			[imageAnimation]="imageAnimation()"
			[message]="message()"
			[size]="size()"
			[color]="color()"
			[backdrop]="backdrop()"
			[ariaLabel]="ariaLabel()"
			[appendTo]="appendTo()"
		>
			<span class="projected">Extra</span>
		</hub-loading>
	`
})
class HostLoadingComponent {
	readonly mode = signal<HubLoadingMode>('inline');
	readonly variant = signal<HubLoadingVariant>('spinner');
	readonly image = signal<string | null>(null);
	readonly imageAnimation = signal<HubLoadingImageAnimation>('none');
	readonly message = signal<string | null>(null);
	readonly size = signal<HubLoadingSize>('md');
	readonly color = signal<string | null>(null);
	readonly backdrop = signal(true);
	readonly ariaLabel = signal('Loading');
	/** Hoisting is off here so `element()` keeps finding the node; it has its own spec file. */
	readonly appendTo = signal<string | null>(null);
}

describe('HubLoadingComponent', () => {
	let fixture: ComponentFixture<HostLoadingComponent>;
	let host: HostLoadingComponent;

	/** The `<hub-loading>` element itself — every class and aria binding lives on the host. */
	const element = (): HTMLElement => fixture.nativeElement.querySelector('hub-loading');

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HostLoadingComponent] });
		fixture = TestBed.createComponent(HostLoadingComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('variants', () => {
		it('renders the spinner indicator by default', () => {
			expect(element().querySelector('.hub-loading__indicator--spinner')).not.toBeNull();
		});

		it.each<HubLoadingVariant>(['spinner', 'dots', 'bars', 'pulse', 'ring'])('renders the %s indicator', (variant) => {
			host.variant.set(variant);
			fixture.detectChanges();

			expect(element().querySelector(`.hub-loading__indicator--${variant}`)).not.toBeNull();
		});

		it('renders one animated node per dot and per bar', () => {
			host.variant.set('dots');
			fixture.detectChanges();
			expect(element().querySelectorAll('.hub-loading__dot')).toHaveLength(3);

			host.variant.set('bars');
			fixture.detectChanges();
			expect(element().querySelectorAll('.hub-loading__bar')).toHaveLength(4);
		});

		it('hides the indicator from assistive tech, which reads the host live region instead', () => {
			expect(element().querySelector('.hub-loading__indicator')!.getAttribute('aria-hidden')).toBe('true');
		});
	});

	describe('modes and backdrop', () => {
		it('is an inline block of the default size', () => {
			expect(element().classList.contains('hub-loading')).toBe(true);
			expect(element().classList.contains('hub-loading--inline')).toBe(true);
			expect(element().classList.contains('hub-loading--md')).toBe(true);
		});

		it.each<HubLoadingMode>(['inline', 'overlay', 'fullscreen'])('applies the %s mode modifier', (mode) => {
			host.mode.set(mode);
			fixture.detectChanges();

			expect(element().classList.contains(`hub-loading--${mode}`)).toBe(true);
		});

		it.each<HubLoadingSize>(['sm', 'md', 'lg'])('applies the %s size modifier', (size) => {
			host.size.set(size);
			fixture.detectChanges();

			expect(element().classList.contains(`hub-loading--${size}`)).toBe(true);
		});

		it('keeps mode and size modifiers together when only one of them changes', () => {
			host.mode.set('overlay');
			host.size.set('lg');
			fixture.detectChanges();

			expect(element().classList.contains('hub-loading--overlay')).toBe(true);
			expect(element().classList.contains('hub-loading--lg')).toBe(true);
			expect(element().classList.contains('hub-loading')).toBe(true);
		});

		it('never paints a backdrop inline, where there is nothing to cover', () => {
			expect(element().classList.contains('hub-loading--backdrop')).toBe(false);
		});

		it('paints the backdrop when covering a container or the viewport', () => {
			host.mode.set('overlay');
			fixture.detectChanges();
			expect(element().classList.contains('hub-loading--backdrop')).toBe(true);

			host.mode.set('fullscreen');
			fixture.detectChanges();
			expect(element().classList.contains('hub-loading--backdrop')).toBe(true);
		});

		it('drops the backdrop when the caller opts out', () => {
			host.mode.set('fullscreen');
			host.backdrop.set(false);
			fixture.detectChanges();

			expect(element().classList.contains('hub-loading--backdrop')).toBe(false);
		});
	});

	describe('image and message', () => {
		it('replaces the built-in indicator with the supplied image', () => {
			host.image.set('/assets/logo.svg');
			fixture.detectChanges();

			const image = element().querySelector<HTMLImageElement>('img.hub-loading__image');
			expect(image).not.toBeNull();
			expect(image!.getAttribute('src')).toBe('/assets/logo.svg');
			expect(element().querySelector('.hub-loading__indicator')).toBeNull();
		});

		it('keeps a plain (non-base64) SVG data URI intact through Angular sanitization', () => {
			const dataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E";
			host.image.set(dataUri);
			fixture.detectChanges();

			expect(element().querySelector<HTMLImageElement>('img.hub-loading__image')!.getAttribute('src')).toBe(dataUri);
		});

		it('animates the image only when an animation is requested', () => {
			host.image.set('/assets/logo.svg');
			fixture.detectChanges();
			const image = () => element().querySelector<HTMLImageElement>('img.hub-loading__image')!;
			expect(image().className).toBe('hub-loading__image');

			host.imageAnimation.set('spin');
			fixture.detectChanges();
			expect(image().classList.contains('hub-loading__image--spin')).toBe(true);

			host.imageAnimation.set('pulse');
			fixture.detectChanges();
			expect(image().classList.contains('hub-loading__image--pulse')).toBe(true);
			expect(image().classList.contains('hub-loading__image--spin')).toBe(false);
		});

		it('renders the message only when there is one', () => {
			expect(element().querySelector('.hub-loading__message')).toBeNull();

			host.message.set('Loading orders…');
			fixture.detectChanges();

			expect(element().querySelector('.hub-loading__message')!.textContent!.trim()).toBe('Loading orders…');
		});

		it('projects arbitrary extra content', () => {
			expect(element().querySelector('.projected')!.textContent).toBe('Extra');
		});
	});

	describe('accessibility', () => {
		it('announces itself as a polite busy status region', () => {
			expect(element().getAttribute('role')).toBe('status');
			expect(element().getAttribute('aria-live')).toBe('polite');
			expect(element().getAttribute('aria-busy')).toBe('true');
			expect(element().getAttribute('aria-label')).toBe('Loading');
		});

		it('uses the supplied accessible label', () => {
			host.ariaLabel.set('Cargando pedidos');
			fixture.detectChanges();

			expect(element().getAttribute('aria-label')).toBe('Cargando pedidos');
		});
	});

	describe('accent', () => {
		it('leaves the accent token untouched while no colour is set', () => {
			expect(element().getAttribute('style') ?? '').not.toContain('--hub-loading-accent');
		});

		it('resolves a semantic name to its design-system token with a raw fallback', () => {
			host.color.set('primary');
			fixture.detectChanges();

			expect(element().getAttribute('style')).toContain('var(--hub-sys-color-primary, primary)');
		});

		it('passes a colour literal straight through', () => {
			host.color.set('#ff0000');
			fixture.detectChanges();

			expect(element().getAttribute('style')).toContain('#ff0000');
		});
	});

	describe('application defaults', () => {
		it('takes every unbound input default from the configuration token', () => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				imports: [HubLoadingComponent],
				providers: [
					{
						provide: HUB_LOADING_CONFIG,
						useValue: {
							...HUB_LOADING_DEFAULT_CONFIG,
							variant: 'dots',
							size: 'lg',
							message: 'Cargando…',
							ariaLabel: 'Cargando'
						}
					}
				]
			});

			const configured = TestBed.createComponent(HubLoadingComponent);
			configured.detectChanges();
			const el: HTMLElement = configured.nativeElement;

			expect(el.querySelector('.hub-loading__indicator--dots')).not.toBeNull();
			expect(el.classList.contains('hub-loading--lg')).toBe(true);
			expect(el.querySelector('.hub-loading__message')!.textContent!.trim()).toBe('Cargando…');
			expect(el.getAttribute('aria-label')).toBe('Cargando');
		});
	});
});
