#!/usr/bin/env node
import React from 'react';
import meow from 'meow';
import { render } from 'ink';
import Ui from './ui.js';

const cli = meow(`
	Usage
	  $ fast
	  $ fast > file

	Options
	  --upload, -u   Measure upload speed in addition to download speed
	  --single-line  Reduce spacing and output to a single line
	  --json         JSON output
	  --verbose      Include latency and server location information
	  --timeout, -t  Timeout in seconds
	  --gui          Open a premium web dashboard in the browser

	Examples
	  $ fast --upload > file && cat file
	  17 Mbps
	  4.4 Mbps

	  $ fast --upload --json
`, {
	importMeta: import.meta,
	flags: {
		upload: {
			type: 'boolean',
			shortFlag: 'u',
		},
		singleLine: {
			type: 'boolean',
		},
		json: {
			type: 'boolean',
		},
		verbose: {
			type: 'boolean',
		},
		timeout: {
			type: 'number',
			shortFlag: 't',
		},
		gui: {
			type: 'boolean',
		},
	} as const,
});

const App: React.FC = () => (
	<Ui
		singleLine={cli.flags.singleLine}
		upload={cli.flags.upload || cli.flags.verbose} // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
		json={cli.flags.json}
		verbose={cli.flags.verbose}
		timeout={cli.flags.timeout}
	/>
);

async function main() {
	if (cli.flags.gui) {
		const { startGuiServer } = await import('./gui.js');
		await startGuiServer({
			upload: true, // Always test upload in GUI for the premium experience
			timeout: cli.flags.timeout,
		});
		return;
	}

	const app = render(<App />);
	await app.waitUntilExit();
}

// It cannot use top-level await as that errors with some React error.
// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
	console.error(error);
});
