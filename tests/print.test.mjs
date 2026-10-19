import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../content/catalog.mjs';
import {printGroups} from '../apps/web/print-ui.mjs';

const chapters=catalog.courses.flatMap(c=>c.chapters);
test('paper edition preserves selection, questions and professor corrections without changing the catalog',()=>{
 const before=JSON.stringify(catalog),groups=printGroups(chapters);
 assert.equal(groups.filter(g=>g.id.startsWith('C')).length,21);
 assert.equal(groups.filter(g=>g.id.startsWith('review')).length,7);
 assert.equal(groups.flatMap(g=>g.blocks).join('').match(/class="print-answer"/g).length,63);
 const text=groups.flatMap(g=>g.blocks).join('');
 assert.equal((text.match(/★ /g)??[]).length,18);
 for(const term of ['2GiB','5분 평균','Template Specs','Deployment Stacks','Container Apps','Stopped (Allocated)','112,000'])assert(text.includes(term));
 for(const term of ['채점 관점','필수 논점','DataCamp 강의 확인 내용','출처 확인','source-ref'])assert(!text.includes(term));
 assert.equal(JSON.stringify(catalog),before);
 const one=printGroups([chapters[0]]);assert.equal(one.length,1);assert.equal(one[0].id,'C01-1');
 const selected=printGroups([chapters.find(ch=>ch.id==='C06-2')]);assert(!selected.some(g=>g.id==='review-5'));assert(selected.some(g=>g.id==='review-2'));
});
test('private notes are excluded by default and escaped when explicitly included',()=>{
 const options={notes:{'C01-1':'<img src=x onerror=alert(1)>\nsecret'}};
 assert(!printGroups([chapters[0]],options)[0].blocks.join('').includes('secret'));
 const text=printGroups([chapters[0]],{...options,includeNotes:true})[0].blocks.join('');
 assert(text.includes('&lt;img'));assert(!text.includes('<img'));assert(text.includes('<br>secret'));
});
