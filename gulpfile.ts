/// <reference path="./typings/bundle.d.ts" />

import {task, src, dest, watch} from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';

task('build', ['build:ts']);

const project = ts.createProject('tsconfig.json', {
	typescript: require('typescript')
});

function buildTypeScript(): ts.CompilationStream {
	return project.src().pipe(ts(project));
}

task('build:ts', () =>
	buildTypeScript()
		.pipe(dest('./built'))
);

task('lint', () =>
	src('./src/**/*.ts')
		.pipe(tslint({
			tslint: require('tslint')
		}))
		.pipe(tslint.report('verbose'))
);

task('test', ['build', 'lint']);

task('watch', ['build'], () =>
	watch('./src/**/*.ts', ['build:ts'])
);
