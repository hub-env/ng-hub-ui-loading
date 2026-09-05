import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { HubLoadingBarService } from '../services/loading-bar.service';
import { provideHubLoadingBarRouter } from './loading-bar-router';

@Component({ standalone: true, template: '' })
class RouteComponent {}

describe('provideHubLoadingBarRouter', () => {
	let router: Router;
	let bar: HubLoadingBarService;
	let start: MockInstance<() => void>;
	let complete: MockInstance<() => void>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideRouter([
					{ path: 'orders', component: RouteComponent },
					{ path: 'customers', component: RouteComponent },
					{ path: 'admin', component: RouteComponent, canActivate: [() => false] }
				]),
				provideLocationMocks(),
				provideHubLoadingBarRouter()
			]
		});

		router = TestBed.inject(Router);
		bar = TestBed.inject(HubLoadingBarService);
		start = vi.spyOn(bar, 'start');
		complete = vi.spyOn(bar, 'complete');
	});

	afterEach(() => {
		bar.reset();
		vi.restoreAllMocks();
	});

	it('runs the bar for exactly the length of a navigation', async () => {
		await router.navigateByUrl('/orders');

		expect(start).toHaveBeenCalledTimes(1);
		expect(complete).toHaveBeenCalledTimes(1);
		expect(bar.isActive()).toBe(false);
	});

	it('releases the bar when a guard rejects the navigation', async () => {
		await router.navigateByUrl('/admin');

		expect(start).toHaveBeenCalledTimes(1);
		expect(complete).toHaveBeenCalledTimes(1);
		expect(bar.isActive()).toBe(false);
	});

	it('pairs every navigation on its own rather than accumulating callers', async () => {
		await router.navigateByUrl('/orders');
		await router.navigateByUrl('/customers');
		await router.navigateByUrl('/orders');

		expect(start).toHaveBeenCalledTimes(3);
		expect(complete).toHaveBeenCalledTimes(3);
		expect(bar.isActive()).toBe(false);
	});
});
