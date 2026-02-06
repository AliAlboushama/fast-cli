import {isDeepStrictEqual} from 'node:util';
import {launch, type Page} from 'puppeteer';
import {delay} from 'unicorn-magic';
import {type SpeedData, type SpeedUnit} from './types.js';

type Options = {
	measureUpload?: boolean;
	timeout?: number;
};

async function * monitorSpeed(page: Page, options?: Options): AsyncGenerator<SpeedData, void, undefined> {
	let previousResult: SpeedData | undefined;
	const startTime = Date.now();
	let lastChangeTime = startTime;

	while (true) {
		// eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
		const result = await page.evaluate(() => {
			const $ = document.querySelector.bind(document);

			return {
				downloadSpeed: Number($('#speed-value')?.textContent) || 0,
				uploadSpeed: Number($('#upload-value')?.textContent) || 0,
				downloadUnit: ($('#speed-units')?.textContent?.trim() ?? 'Mbps') as SpeedUnit,
				downloaded: Number($('#down-mb-value')?.textContent?.trim()) || 0,
				uploadUnit: ($('#upload-units')?.textContent?.trim() ?? 'Mbps') as SpeedUnit,
				uploaded: Number($('#up-mb-value')?.textContent?.trim()) || 0,
				latency: Number($('#latency-value')?.textContent?.trim()) || 0,
				bufferBloat: Number($('#bufferbloat-value')?.textContent?.trim()) || 0,
				userLocation: $('#user-location')?.textContent?.trim() ?? '',
				serverLocations: $('#server-locations')?.textContent?.split('|').map(location => location.trim()).filter(Boolean) ?? [],
				userIp: $('#user-ip')?.textContent?.trim() ?? '',
				isDone: Boolean($('#speed-value.succeeded') && $('#upload-value.succeeded')),
			};
		});

		if (!isDeepStrictEqual(result, previousResult)) {
			yield result;
		}

		if (result.isDone || (options?.measureUpload === false && result.uploadSpeed > 0) || (options?.timeout !== undefined && Date.now() - startTime > options.timeout * 1000)) {
			return;
		}

		if (!isDeepStrictEqual(result, previousResult)) {
			lastChangeTime = Date.now();
		}

		if (Date.now() - lastChangeTime > 15_000) {
			throw new Error('Test stalled. No progress detected for 15 seconds.');
		}

		previousResult = result;

		// eslint-disable-next-line no-await-in-loop
		await delay({seconds: 0.1});
	}
}

export default async function * api(options?: Options): AsyncGenerator<SpeedData, void, undefined> {
	let retryCount = 0;
	const maxRetries = 1;

	while (retryCount <= maxRetries) {
		// eslint-disable-next-line no-await-in-loop
		const browser = await launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors'],
			headless: true,
		});

		try {
			// eslint-disable-next-line no-await-in-loop
			const page = await browser.newPage();
			// eslint-disable-next-line no-await-in-loop
			await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
			// eslint-disable-next-line no-await-in-loop
			await page.goto('https://fast.com', {
				timeout: 60_000,
			});

			// eslint-disable-next-line no-await-in-loop
			for await (const result of monitorSpeed(page, options)) {
				yield result;
			}

			return;
		} catch (error: unknown) {
			if (retryCount >= maxRetries) {
				throw error;
			}

			retryCount++;
			// eslint-disable-next-line no-await-in-loop
			await delay({seconds: 1});
		} finally {
			// eslint-disable-next-line no-await-in-loop
			await browser.close();
		}
	}
}
