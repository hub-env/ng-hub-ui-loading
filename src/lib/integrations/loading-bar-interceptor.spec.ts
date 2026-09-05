import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HubLoadingBarService } from '../services/loading-bar.service';
import { hubLoadingBarInterceptor, withoutHubLoadingBar } from './loading-bar-interceptor';

describe('hubLoadingBarInterceptor', () => {
	let http: HttpClient;
	let backend: HttpTestingController;
	let bar: HubLoadingBarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(withInterceptors([hubLoadingBarInterceptor])), provideHttpClientTesting()]
		});
		http = TestBed.inject(HttpClient);
		backend = TestBed.inject(HttpTestingController);
		bar = TestBed.inject(HubLoadingBarService);
	});

	afterEach(() => {
		backend.verify();
		bar.reset();
	});

	it('holds the bar open for the lifetime of a request', () => {
		http.get('/api/orders').subscribe();
		expect(bar.isActive()).toBe(true);

		backend.expectOne('/api/orders').flush([]);

		expect(bar.isActive()).toBe(false);
	});

	it('counts parallel requests, so the first to land does not release the bar', () => {
		http.get('/api/orders').subscribe();
		http.get('/api/customers').subscribe();

		backend.expectOne('/api/orders').flush([]);
		expect(bar.isActive()).toBe(true);

		backend.expectOne('/api/customers').flush([]);
		expect(bar.isActive()).toBe(false);
	});

	it('releases the bar when a request fails', () => {
		http.get('/api/orders').subscribe({ error: () => undefined });

		backend.expectOne('/api/orders').flush('nope', { status: 500, statusText: 'Server Error' });

		expect(bar.isActive()).toBe(false);
	});

	it('releases the bar when a request is cancelled', () => {
		const subscription: Subscription = http.get('/api/orders').subscribe();
		const request = backend.expectOne('/api/orders');

		subscription.unsubscribe();

		expect(request.cancelled).toBe(true);
		expect(bar.isActive()).toBe(false);
	});

	it('ignores a request opted out with withoutHubLoadingBar', () => {
		http.get('/api/notifications', { context: withoutHubLoadingBar() }).subscribe();

		expect(bar.isActive()).toBe(false);

		backend.expectOne('/api/notifications').flush([]);
	});
});
