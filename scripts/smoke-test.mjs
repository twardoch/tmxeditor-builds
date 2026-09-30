// this_file: scripts/smoke-test.mjs
// Exercise the real TMX import worker, SQLite model, and save/reopen path.
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const source = resolve(process.argv[2] || join(here, 'TMXEditor'));
const { TMXModel } = await import(pathToFileURL(join(source, 'js/tmx/tmxModel.js')));
const scratch = mkdtempSync(join(tmpdir(), 'tmxeditor-builds-tmx-smoke-'));
let model;
try {
    for (const [index, input] of [join(here, 'smoke-test.tmx'), join(scratch, 'saved.tmx')].entries()) {
        model = await TMXModel.open(input, join(scratch, `${index}.db`),
            join(source, 'js/tmx/tmxImportWorker.js'), join(source, 'catalog/catalog.xml'), () => {});
        assert.equal(model.getCount(), 2, 'Both translation units must survive import/save');
        assert.deepEqual(model.getLanguages().sort(), ['en', 'pl'], 'Both languages must survive');
        assert.ok(model.getSegments(0, 2).join('').includes('Rodzina fontów'), 'Polish Unicode text must survive');
        if (index === 0) model.saveFile(join(scratch, 'saved.tmx'));
        model.close();
        model = undefined;
    }
    console.log('PASS: TMX import, two languages, Unicode, save and reopen');
} finally {
    model?.close();
    rmSync(scratch, { recursive: true, force: true });
}
