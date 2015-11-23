/// <reference path="./typings/bundle.d.ts" />

import { task, src, dest } from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
const babel = require('gulp-babel');

task('build', ['build:ts']);

task('build:ts', () => {
	const project = ts.createProject('tsconfig.json', {
		typescript: require('typescript')
	});

	return project.src()
		.pipe(ts(project))
		.pipe(babel())
		.pipe(dest('./built'));
});

task('lint', () => {
	return src('./src/**/*.ts')
		.pipe(tslint(<any>{
			tslint: require('tslint')
		}))
		.pipe(tslint.report('verbose'));
});

task('test', ['build', 'lint']);
