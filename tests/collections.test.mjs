import test from "node:test";
import assert from "node:assert/strict";
import { summarizeSkills } from "../src/lib/learning-collections.ts";
test("skills derive completions, XP and next unlocked lesson from actual course data", () => {
  const lessons=[{id:"one",topic:"travel",xp:41,locked:false},{id:"two",topic:"travel",xp:42,locked:false},{id:"three",topic:"food",xp:50,locked:true}];
  const skills=summarizeSkills(lessons,["one"]);
  const travel=skills.find(s=>s.id==="travel");
  assert.deepEqual({total:travel.total,completed:travel.completed,xp:travel.xp,percent:travel.percent,nextId:travel.nextId},{total:2,completed:1,xp:41,percent:50,nextId:"two"});
  assert.equal(skills.find(s=>s.id==="food").nextId,undefined);
  assert.equal(summarizeSkills(lessons,[]).every(s=>s.completed===0&&s.xp===0),true);
});
