import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HUB_LOADING_BAR_DEFAULT_CONFIG, provideHubLoadingBar } from '../../loading-bar-config';
import { HubLoadingBarMode, HubLoadingBarPlacement } from '../../models/loading-bar.types';
import { HubLoadingBarService } from '../../services/loading-bar.service';
import { HubLoadingBarComponent } from './loading-bar.component';

@Component({
	standalone: true,
	imports: [HubLoadingBarComponent],
	template: `
		<hub-loading-bar
			[mode]="mode()"
			[placement]="placement()"
			[progress]="progress()"
			[indeterminate]="indeterminate()"
			[glow]="glow()"
			[color]="color()"
			[ariaLabel]="ariaLabel()"
		/>
	`
})
class HostLoadingBarComponent {
	readonly mode = signal<HubLoadingBarMode>('inline');
	readonly placement = signal<HubLoadingBarPlacement>('top');
	readonly progress = signal<number | null | undefined>(undefined);
	readonly indeterminate = signal(false);
	readonly glow = signal(HUB_LOADING_BAR_DEFAULT_CONFIG.glow);
	readonly color = signal<string | null>(null);
	readonly ariaLabel = signal(HUB_LOADING_BAR_DEFAULT_CONFIG.ariaLabel);
}

describe('HubLoadingBarComponent', () => {
	let fixture: ComponentFixture<HostLoadingBarComponent>;
	let host: HostLoadingBarComponent;

	/** The `<hub-loading-bar>` element itself — every class and aria binding lives on the host. */
	const element = (): HTMLElement => fixture.nativeElement.querySelector('hub-loading-bar');

	/** Re-renders and returns the host element, so assertions read as one expression. */
	const render = (): HTMLElement => {
		fixture.detectChanges();
		return element();
	};

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HostLoadingBarComponent] });
		fixture = TestBed.createComponent(HostLoadingBarComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('structure', () => {
		it('renders a progressbar carrying a single fill element', () => {
			expect(element().getAttribute('role')).toBe('progressbar');
			expect(element().querySelectorAll('.hub-loading-bar__indicator')).toHaveLength(1);
		});

		it('publishes the static bounds of the scale', () => {
			expect(element().getAttribute('aria-valuemin')).toBe('0');
			expect(element().getAttribute('aria-valuemax')).toBe('100');
		});

		it('carries the accessible name', () => {
			host.ariaLabel.set('Loading the page');

			expect(render().getAttribute('aria-label')).toBe('Loading the page');
		});
	});

	describe('modes', () => {
		it('is inline by default and emits no placement modifier', () => {
			expect(element().classList.contains('hub-loading-bar--inline')).toBe(true);
			expect(element().classList.contains('hub-loading-bar--top')).toBe(false);
		});

		it.each<HubLoadingBarMode>(['inline', 'overlay', 'fixed'])('renders the %s mode', (mode) => {
			host.mode.set(mode);

			expect(render().classList.contains(`hub-loading-bar--${mode}`)).toBe(true);
		});

		it.each<HubLoadingBarPlacement>(['top', 'bottom'])('attaches a positioned bar to the %s edge', (placement) => {
			host.mode.set('overlay');
			host.placement.set(placement);

			expect(render().classList.contains(`hub-loading-bar--${placement}`)).toBe(true);
		});
	});

	describe('appearance', () => {
		it('glows by default and drops the modifier when switched off', () => {
			expect(element().classList.contains('hub-loading-bar--glow')).toBe(true);

			host.glow.set(false);

			expect(render().classList.contains('hub-loading-bar--glow')).toBe(false);
		});

		it('resolves a semantic accent name to a design-system token', () => {
			host.color.set('success');

			expect(render().style.getPropertyValue('--hub-loading-bar-accent')).toBe('var(--hub-sys-color-success, success)');
		});

		it('passes a colour literal through untouched', () => {
			host.color.set('#ff8800');

			expect(render().style.getPropertyValue('--hub-loading-bar-accent')).toBe('#ff8800');
		});
	});

	describe('manual control', () => {
		it('is hidden while nothing is loading', () => {
			expect(element().classList.contains('hub-loading-bar--visible')).toBe(false);
			expect(element().getAttribute('aria-hidden')).toBe('true');
		});

		it('draws and announces a bound value', () => {
			host.progress.set(42);

			expect(render().classList.contains('hub-loading-bar--visible')).toBe(true);
			expect(element().style.getPropertyValue('--hub-loading-bar-progress')).toBe('42%');
			expect(element().getAttribute('aria-valuenow')).toBe('42');
			expect(element().getAttribute('aria-hidden')).toBeNull();
		});

		it('hides again when the bound value becomes null', () => {
			host.progress.set(42);
			render();

			host.progress.set(null);

			expect(render().classList.contains('hub-loading-bar--visible')).toBe(false);
		});

		it('publishes no value while the bar is not painted', () => {
			host.progress.set(null);

			expect(render().getAttribute('aria-valuenow')).toBeNull();
		});

		it('withholds the announced value while sweeping, which is how ARIA spells indeterminate', () => {
			host.progress.set(42);
			host.indeterminate.set(true);

			expect(render().classList.contains('hub-loading-bar--indeterminate')).toBe(true);
			expect(element().getAttribute('aria-valuenow')).toBeNull();
		});
	});

	describe('service-driven', () => {
		let service: HubLoadingBarService;

		beforeEach(() => {
			vi.useFakeTimers();
			service = TestBed.inject(HubLoadingBarService);
		});

		afterEach(() => {
			service.reset();
			vi.useRealTimers();
		});

		it('follows the shared state when nothing is bound', () => {
			service.set(37);

			expect(render().classList.contains('hub-loading-bar--visible')).toBe(true);
			expect(element().style.getPropertyValue('--hub-loading-bar-progress')).toBe('37%');
		});

		it('announces no value while the service is trickling an invented one', () => {
			service.set(37);

			expect(render().getAttribute('aria-valuenow')).toBeNull();
		});

		it('stops following the service once a value is bound', () => {
			service.set(37);
			render();

			host.progress.set(80);

			expect(render().style.getPropertyValue('--hub-loading-bar-progress')).toBe('80%');
		});
	});

	describe('configuration defaults', () => {
		beforeEach(() => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				imports: [HostLoadingBarComponent],
				providers: [provideHubLoadingBar({ color: 'danger', glow: false, ariaLabel: 'Cargando' })]
			});
			fixture = TestBed.createComponent(HostLoadingBarComponent);
			host = fixture.componentInstance;
			host.glow.set(false);
			host.ariaLabel.set('Cargando');
			host.color.set('danger');
			fixture.detectChanges();
		});

		it('dresses the bar from the application configuration', () => {
			expect(element().classList.contains('hub-loading-bar--glow')).toBe(false);
			expect(element().getAttribute('aria-label')).toBe('Cargando');
			expect(element().style.getPropertyValue('--hub-loading-bar-accent')).toBe('var(--hub-sys-color-danger, danger)');
		});
	});
});
