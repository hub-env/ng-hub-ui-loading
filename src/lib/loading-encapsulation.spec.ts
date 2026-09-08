import { TestBed } from '@angular/core/testing';
import { HubLoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { HubLoadingComponent } from './components/loading/loading.component';
import { HubLoadingService } from './services/loading.service';

/** One `selector { … }` rule of the stylesheet as the build injects it into the document. */
interface StyleRule {
	selector: string;
	body: string;
}

/** A keyframe step (`0%`, `from`, `to`) — a rule, but not one that selects an element. */
const KEYFRAME_STEP = /^(from|to|\d+(\.\d+)?%)(\s*,\s*(from|to|\d+(\.\d+)?%))*$/;

/**
 * The rules the component actually ships, read back from the document rather than from the
 * `.scss` source. What decides whether encapsulation holds is the CSS that reaches the page,
 * after the build has compiled it and the shim has rewritten `:host` into an attribute
 * selector — the source says nothing about either.
 */
function shippedCss(prefix: string): string {
	return Array.from(document.querySelectorAll('style'))
		.map((style) => style.textContent ?? '')
		.filter((text) => text.includes(prefix))
		.join('\n')
		.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Drops every `@media` / `@keyframes` block, braces and all. What is inside one is
 * conditional by construction — the reduced-motion block retunes two durations on purpose —
 * and the flat rule parser below cannot tell it apart from an unconditional declaration.
 */
function withoutAtRuleBlocks(css: string): string {
	let out = '';
	let index = 0;

	while (index < css.length) {
		const at = css.indexOf('@', index);
		if (at === -1) {
			return out + css.slice(index);
		}
		out += css.slice(index, at);

		const open = css.indexOf('{', at);
		if (open === -1) {
			return out;
		}
		let depth = 1;
		let cursor = open + 1;
		while (cursor < css.length && depth > 0) {
			if (css[cursor] === '{') depth++;
			else if (css[cursor] === '}') depth--;
			cursor++;
		}
		index = cursor;
	}
	return out;
}

function parseRules(css: string): StyleRule[] {
	const rules: StyleRule[] = [];
	// Nested at-rules are stepped over rather than parsed: their wrapper never matches this
	// pattern, and the rules inside them do.
	for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		const selector = match[1].trim();
		if (!KEYFRAME_STEP.test(selector)) {
			rules.push({ selector, body: match[2] });
		}
	}
	return rules;
}

/** Every rule the component ships, at-rule blocks included. */
function shippedRules(prefix: string): StyleRule[] {
	return parseRules(shippedCss(prefix));
}

/** Only the rules that apply unconditionally — no `@media` guard around them. */
function unconditionalRules(prefix: string): StyleRule[] {
	return parseRules(withoutAtRuleBlocks(shippedCss(prefix)));
}

/** Whether Angular's emulated-encapsulation shim has stamped this selector. */
const isScoped = (selector: string): boolean => selector.includes('_nghost-') || selector.includes('_ngcontent-');

/** `hub-loading` is a prefix of `hub-loading-bar`, so the bar's rules have to be filtered out. */
const belongsToLoading = (selector: string): boolean => !selector.includes('hub-loading-bar');

describe('hub-loading stylesheet', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HubLoadingComponent] }).compileComponents();
		TestBed.createComponent(HubLoadingComponent).detectChanges();
	});

	/**
	 * Nothing this component paints with can be reached — or broken — by a rule written
	 * elsewhere, because every selector it emits is stamped with its own marker attribute.
	 */
	it('emits no rule that escapes into the application cascade', () => {
		const escaped = shippedRules('hub-loading')
			.map((rule) => rule.selector)
			.filter(belongsToLoading)
			.filter((selector) => !isScoped(selector));

		expect(escaped).toEqual([]);
	});

	/**
	 * The token defaults are declared ON the host, which is what makes the global half
	 * unnecessary: a custom property inherits, so the indicator, the image and the message all
	 * see them. They stay inside `:where()` so their specificity is zero and a consumer rule —
	 * `hub-loading-theme()` included — still outranks them.
	 */
	it('declares its tokens on the host at zero specificity', () => {
		// The size steps and the reduced-motion block retune tokens deliberately, so they are
		// excluded by selector; what is pinned is that nothing else declares above zero.
		const declaring = unconditionalRules('hub-loading').filter(
			(rule) =>
				belongsToLoading(rule.selector) &&
				/--hub-loading-[a-z-]+\s*:/.test(rule.body) &&
				!rule.selector.includes('hub-loading--')
		);

		expect(declaring.length).toBeGreaterThan(0);
		for (const rule of declaring) {
			expect(rule.selector).toMatch(/^:where\(\[_nghost-[^\]]+\]\)$/);
		}
	});

	/**
	 * `overlay`, `fullscreen`, `backdrop` and the size steps all ride on the host element,
	 * which carries `_nghost` and never `_ngcontent`. Written as plain class rules they would
	 * be stamped with the content marker and stop matching — the overlay would lose its
	 * `position: fixed` and the fullscreen loader would scroll away with the page.
	 */
	it('matches every mode and size modifier on the host', () => {
		const modifiers = shippedRules('hub-loading').filter((rule) => rule.selector.includes('hub-loading--'));

		expect(modifiers.length).toBeGreaterThan(0);
		for (const rule of modifiers) {
			expect(rule.selector).toMatch(/hub-loading--[a-z-]+\[_nghost-/);
		}
	});
});

describe('the overlay HubLoadingService mounts on document.body', () => {
	/**
	 * The reason the component used to give for going global was that the service-mounted
	 * overlay lived "outside any component's style scope". It does not: `createComponent()`
	 * builds an ordinary instance, so Angular stamps its host with the same marker attribute
	 * and registers the same stylesheet — wherever the node is then appended.
	 */
	it('carries the component stylesheet with it', () => {
		TestBed.configureTestingModule({ providers: [] });
		const service = TestBed.inject(HubLoadingService);

		service.show({ message: 'Saving…' });

		const overlay = document.body.querySelector('hub-loading.hub-loading--fullscreen') as HTMLElement;
		expect(overlay).toBeTruthy();

		const marker = Array.from(overlay.attributes)
			.map((attribute) => attribute.name)
			.find((name) => name.startsWith('_nghost-'));
		expect(marker).toBeTruthy();

		// And the rule that positions it is written against that very marker, so the overlay
		// is painted rather than left as an unstyled block at the end of the body.
		const fullscreen = shippedRules('hub-loading').find((rule) => rule.selector.includes('hub-loading--fullscreen'));
		expect(fullscreen?.selector).toContain(`[${marker}]`);

		service.hideAll();
	});
});

describe('hub-loading-bar stylesheet', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HubLoadingBarComponent] }).compileComponents();
		TestBed.createComponent(HubLoadingBarComponent).detectChanges();
	});

	it('emits no rule that escapes into the application cascade', () => {
		const escaped = shippedRules('hub-loading-bar')
			.map((rule) => rule.selector)
			.filter((selector) => selector.includes('hub-loading-bar'))
			.filter((selector) => !isScoped(selector));

		expect(escaped).toEqual([]);
	});

	it('declares its tokens on the host at zero specificity', () => {
		const declaring = unconditionalRules('hub-loading-bar').filter(
			(rule) =>
				/--hub-loading-bar-[a-z-]+\s*:/.test(rule.body) &&
				!rule.selector.includes('hub-loading-bar--') &&
				!rule.selector.includes('dir=')
		);

		expect(declaring.length).toBeGreaterThan(0);
		for (const rule of declaring) {
			expect(rule.selector).toMatch(/^:where\(\[_nghost-[^\]]+\]\)$/);
		}
	});

	/**
	 * `dir` is an inherited attribute, so the RTL flip has to fire whether it sits on the bar
	 * itself or on any ancestor. `:host-context()` emits exactly that pair — the two selectors
	 * the stylesheet used to spell out by hand — and this is the assertion that says so.
	 */
	it('flips the sweep for an RTL ancestor and for an RTL bar alike', () => {
		const rtl = shippedRules('hub-loading-bar').filter((rule) => /\[dir=["']?rtl["']?\]/.test(rule.selector));

		expect(rtl.length).toBe(1);
		const halves = rtl[0].selector.split(',').map((half) => half.trim());
		expect(halves.length).toBe(2);
		// One half matches the host itself, the other any ancestor: no descendant combinator
		// in the first, one in the second.
		expect(halves.some((half) => /^\[dir=["']?rtl["']?\]\[_nghost-[^\]]+\]$/.test(half))).toBe(true);
		expect(halves.some((half) => /^\[dir=["']?rtl["']?\]\s+\[_nghost-[^\]]+\]$/.test(half))).toBe(true);
	});
});
