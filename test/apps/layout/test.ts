import * as assert from 'assert';
import { build } from '../../../api';
import { AppRunner } from '../AppRunner';

describe('layout', function() {
	this.timeout(10000);

	let r: AppRunner;

	// hooks
	before('build app', () => build({ cwd: __dirname }));
	before('start runner', async () => {
		r = await new AppRunner().start(__dirname);
	});

	after(() => r && r.end());

	// tests
	it('only recreates components when necessary', async () => {
		await r.load('/foo/bar/baz');

		const text1 = await r.text('#sapper');
		assert.deepEqual(text1.split('\n').map(str => str.trim()).filter(Boolean), [
			'y: bar 1',
			'z: baz 1',
			'click me',
			'child segment: baz'
		]);

		await r.sapper.start();
		const text2 = await r.text('#sapper');
		assert.deepEqual(text2.split('\n').map(str => str.trim()).filter(Boolean), [
			'y: bar 1',
			'z: baz 1',
			'click me',
			'child segment: baz'
		]);

		await r.page.click('[href="foo/bar/qux"]');
		await r.wait();

		const text3 = await r.text('#sapper');
		assert.deepEqual(text3.split('\n').map(str => str.trim()).filter(Boolean), [
			'y: bar 1',
			'z: qux 2',
			'click me',
			'child segment: qux'
		]);
	});

	it('survives the tests with no server errors', () => {
		assert.deepEqual(r.errors, []);
	});
});
