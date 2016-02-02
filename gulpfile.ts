/// <reference path="./typings/bundle.d.ts" />

import {task, src, dest, watch} from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
import * as babel from 'gulp-babel';

task('build', ['build:ts']);

function buildTypeScript(): ts.CompilationStream {
	const project = ts.createProject('tsconfig.json', {
		typescript: require('typescript')
	});

	return project.src().pipe(ts(project));
}

task('build:ts', () =>
	buildTypeScript()
		.pipe(babel())
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
