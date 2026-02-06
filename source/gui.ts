import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import open from 'open';
import api from './api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startGuiServer(options: {upload?: boolean; timeout?: number} = {}) {
    const fastifyInstance = Fastify({
        logger: false,
    });

    await fastifyInstance.register(fastifyWebsocket);

    // Serve the static web assets
    await fastifyInstance.register(fastifyStatic, {
        root: path.join(__dirname, 'web'),
        prefix: '/',
    });

    await fastifyInstance.register(async instance => {
        instance.get('/ws', {websocket: true}, socket => {
            (async () => {
                try {
                    console.log('  📡 Test session started...');
                    for await (const result of api({measureUpload: options.upload, timeout: options.timeout})) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        (socket as any).send(JSON.stringify(result));
                    }

                    console.log('  ✅ Test session finished.');
                } catch (error: unknown) {
                    console.error('GUI API Error:', error);
                }
            })().catch((error: unknown) => {
                console.error('Socket error:', error);
            });
        });
    });

    const port = 3000;
    try {
        await fastifyInstance.listen({port, host: '127.0.0.1'});
        const url = `http://127.0.0.1:${port}`;
        console.log(`\n  ✨ GUI Dashboard active at: ${url}`);
        console.log('  🚀 Opening your browser...\n');
        await open(url);
    } catch (error) {
        fastifyInstance.log.error(error);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
}
