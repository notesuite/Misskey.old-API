//////////////////////////////////////////////////
// MISSKEY-API ENTORY POINT
//////////////////////////////////////////////////

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2016 syuilo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as cluster from 'cluster';
import {logInfo, logWarn} from 'log-cool';
import forkForEachCpu from 'fork-for-each-cpu';
import argv from './argv';
import checkDependencies from './check-dependencies';
import startServer from './server';

(<any>Error).stackTraceLimit = Infinity;

const env = process.env.NODE_ENV;

forkForEachCpu({
	master: (): void => {
		logInfo('Welcome to Misskey API');

		if (!argv.options.hasOwnProperty('skip-check-dependencies')) {
			checkDependencies();
		}

		if (env !== 'production') {
			logWarn('Productionモードではありません。本番環境で使用しないでください。');
		}
	},
	worker: (): void => {
		startServer();
	}
});

// Fork when a worker died.
cluster.on('exit', worker => {
	logInfo(`(cluster: ${worker.id}) Died`);
	cluster.fork();
});

// Dying away...
process.on('exit', () => {
	console.log('Bye.');
});
