import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { HubLoadingMode } from '../../models/loading.types';
import { HubLoadingComponent } from './loading.component';

/**
 * A fullscreen indicator has to cover the window from wherever it is written.
 *
 * `position: fixed` only measures from the viewport while no ancestor applies layout containment,
 * a transform or a filter, and only paints over the page while no ancestor opens a stacking
 * context. Inside `<hub-side-panel-container>` both were false, so the overlay covered the content
 * area and nothing else, and consuming products shipped a directive of their own to move the node
 * to `<body>`. It moves itself now, and these tests are about where the node ends up — the one
 * part of the failure a DOM without layout can still answer honestly.
 */

/** Written the way a consumer writes it: no placement input, so it pins the default. */
@Component({
	standalone: true,
	imports: [HubLoadingComponent],
	template: `<div class="stage"><hub-loading mode="fullscreen" /></div>`
})
class PlainStageComponent {}

/** The same thing with both placement inputs bound, for the cases that need to change them. */
@Component({
	standalone: true,
	imports: [HubLoadingComponent],
	template: `
		<div class="stage">
			<span class="before"></span>
			<hub-loading [mode]="mode()" [appendTo]="appendTo()" />
			<span class="after"></span>
		</div>
	`
})
class BoundStageComponent {
	readonly mode = signal<HubLoadingMode>('fullscreen');
	readonly appendTo = signal<string | null>('body');
}

/** The indicator, found from the document: the point of the fix is that it is not in the stage. */
const indicator = (): HTMLElement => document.querySelector('hub-loading') as HTMLElement;

describe('a fullscreen hub-loading leaves the subtree it is declared in', () => {
	it('hangs from the body rather than from the block that declares it, with nothing asked of the consumer', () => {
		TestBed.configureTestingModule({ imports: [PlainStageComponent] });
		const fixture = TestBed.createComponent(PlainStageComponent);
		fixture.detectChanges();

		expect(indicator().parentElement).toBe(document.body);
		expect(fixture.nativeElement.querySelector('.stage').querySelector('hub-loading')).toBeNull();
	});

	it('is taken off the page with the view that declared it', () => {
		TestBed.configureTestingModule({ imports: [PlainStageComponent] });
		const fixture = TestBed.createComponent(PlainStageComponent);
		fixture.detectChanges();

		fixture.destroy();

		expect(document.querySelector('hub-loading')).toBeNull();
	});
});

describe('where a hub-loading is placed', () => {
	let fixture: ReturnType<typeof TestBed.createComponent<BoundStageComponent>>;

	const stage = (): HTMLElement => fixture.nativeElement.querySelector('.stage');

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [BoundStageComponent] });
		fixture = TestBed.createComponent(BoundStageComponent);
		fixture.detectChanges();
	});

	it('stays where it is declared once the consumer opts out', () => {
		fixture.componentInstance.appendTo.set(null);
		fixture.detectChanges();

		expect(indicator().parentElement).toBe(stage());
	});

	it.each<HubLoadingMode>(['inline', 'overlay'])('never moves a %s indicator', (mode) => {
		fixture.componentInstance.mode.set(mode);
		fixture.detectChanges();

		expect(indicator().parentElement).toBe(stage());
	});

	it('goes back between the same siblings when it stops being fullscreen', () => {
		fixture.componentInstance.mode.set('inline');
		fixture.detectChanges();

		expect(indicator().previousElementSibling?.className).toBe('before');
		expect(indicator().nextElementSibling?.className).toBe('after');
	});

	it('stays put when the selector matches nothing', () => {
		fixture.componentInstance.appendTo.set('#an-overlay-root-that-does-not-exist');
		fixture.detectChanges();

		expect(indicator().parentElement).toBe(stage());
	});
});
