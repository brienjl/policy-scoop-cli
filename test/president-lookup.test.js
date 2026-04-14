import test from "node:test";
import assert from "node:assert/strict";
import { presidentLookup } from '../src/utils/president-lookup.js';

test("returns Joe Biden for a date inside his term", () => {
    const result = presidentLookup("2024-07-04");

    assert.ok(result);
    assert.equal(result.id, 46);
    assert.equal(result.first_name, "Joe");
    assert.equal(result.last_name, "Biden");
});

test("returns Donald Trump for a date inside his second term", () => {
    const result = presidentLookup("2025-02-01");

    assert.ok(result);
    assert.equal(result.id, 47);
    assert.equal(result.first_name, "Donald");
    assert.equal(result.last_name, "Trump");
});

test("returns Donald Trump for a date inside his first term", () => {
    const result = presidentLookup("2020-06-01");

    assert.ok(result);
    assert.equal(result.id, 45);
    assert.equal(result.first_name, "Donald");
    assert.equal(result.last_name, "Trump");
});

test("returns Grover Cleveland for his first nonconsecutive term", () => {
    const result = presidentLookup("1886-06-01");

    assert.ok(result);
    assert.equal(result.id, 22);
    assert.equal(result.first_name, "Grover");
    assert.equal(result.last_name, "Cleveland");
});

test("returns Grover Cleveland for his second nonconsecutive term", () => {
    const result = presidentLookup("1894-06-01");

    assert.ok(result);
    assert.equal(result.id, 24);
    assert.equal(result.first_name, "Grover");
    assert.equal(result.last_name, "Cleveland");
});

test("returns the correct president on an inauguration boundary date", () => {
    const result = presidentLookup("2025-01-20");

    assert.ok(result);
    assert.equal(result.id, 47);
    assert.equal(result.first_name, "Donald");
    assert.equal(result.last_name, "Trump");
});

test("returns null for missing input", () => {
    const result = presidentLookup();

    assert.equal(result, null);
});

test("returns null for invalid input", () => {
    const result = presidentLookup("banana");

    assert.equal(result, null);
});

test("returns null for a date before the first presidential term in the dataset", () => {
    const result = presidentLookup("1776-07-04");

    assert.equal(result, null);
});