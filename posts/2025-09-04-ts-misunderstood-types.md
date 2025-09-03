---
title: 'TypeScript: commonly misused types'
slug: ts-misunderstood-types
type: posts
code_langs:
    - typescript
---

<style>
h2 {
    padding-top: 1.5rem;
}
</style>

# {{title}}

## Table of Contents

- [`boolean`/`number`/`string` vs Boolean/Number/String](#booleannumberst)
- [void](#void)
- [never](#never)
- [The empty interface `{}`](#theemptyinterfa)
- [Class instance types](#classinstancety)
- [JSON](#json)

## `boolean`/`number`/`string` vs Boolean/Number/String

The first three covert primitives values, such as `true`, `false`, `123`, `"hello"`, and so on.

The latter three, on the other hand, are interfaces. For an object to be assignable to `Boolean`,
it just needs a `valueOf(): boolean` method:

```ts
const example1: Boolean = {
    valueOf() {
        return true;
    }
};

const example2: Number = {
    valueOf() {
        return  0;
    },
    toExponential() {
        return '';
    },
    toFixed() {
        return '';
    },
    toPrecision() {
        return '';
    }
};
```

In most cases, Boolean/Number/String are used by mistake where `boolean`/`number`/`string` was the intention.

## void

Any value can be assigned to void, it indicates that the return value of a function will not be used by the caller.

It's used to support one-liner callbacks, like so:

```ts
function forEach(items: string[], fn: (value: string) => undefined) {
    for (const item of items) {
        fn(item);
    }
}

let joined = '';
const words = ['hello', 'world'];

forEach(words, word => joined += ' ' + word)
//                     ^^^^^^^^^^^^^^^^^^^^
// Type 'string' is not assignable to type 'undefined'.
```

We can fix the error by changing the signature to `fn: (value: string) => void`. Another valid option is `fn: (value: string) => unknown`, but `void` signals that `forEach` won't use the callback's result.

## never

`never` is also commonly used as a return type, this time signalling that a function never returns.

It's should be used in functions that always throw, call `process.exit()`, or terminate execution somehow.

```ts
function fail(message: string) {
    console.error(`Failure:`, message);
    throw new Error(message);
}

function example(data: { url?: string }): string {
    if (data.url === undefined) {
        fail('url missing');
    }
    return data.url;
//  ^^^^^^
//  Type 'string | undefined' is not assignable to type 'string'.
}
```

We can fix the above snippet by changing `fail`'s signature to `function fail(message: string): never`. Now TypeScript can see that if `data.url` is undefined, the return statement is never reached.

## The empty interface `{}`

This is sometimes misunderstood as "an object with no properties". In reality, TypeScript allows excess properties (otherwise it wouldn't be possible for a single object to satisfy multiple interfaces). Therefore, `{}` is any value that **can** have properties, which only excludes `null` and `undefined`.

```ts
const user = { name: 'john', role: 'admin' };

// Both of these typecheck
const user2: { name: string } = user;
const user3: {} = user;
```

TypeScript only complains about excess properties in a few scenarios, when it's likely a mistake:

```ts
function example(data: { name: string, role?: string }) {}

example({ name: 'john', title: 'admin' });
//                      ^^^^^
// Object literal may only specify known properties, and 'title' does not exist in type '{ name: string; role: string; }'.
```

## Class instance types

```ts
class Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

const person: Person = { name: 'john' };
```

The above snippet typechecks is intended behavior. TypeScript is a structurally typed-language, which means that for two types to be compatible, they just need to have the same properties.

In this case, an object is assignable to `Person` as long as it has the same properties. It doesn't need to have been created via `new Person()`.

This is in stark constrast to languages like Java, where even two identical classes aren't assignable to each other.



## JSON

I've seen this type being misused a few times this way:

```ts
function fetchInfo(): Promise<JSON> {
    return fetch('/info').then(res => res.json())
}
```

The `JSON` type is just the type of the global `JSON` object, as in `{ parse(data: string): any, stringify(data: any): string }`.
There's really no value in using it.

```ts
// This typechecks, but makes no sense and probably isn't what was intended.
const info = await fetchInfo();
info.stringify(123);
info.parse("123");
```

There isn't a "JSON data" type, simply because JSON is a way encoding JS objects, and not a type in itself.

The correct way to declare the previous function would be:

```ts
function fetchInfo(): Promise<unknown> {
    return fetch('/info').then(res => res.json())
}

// or

interface Info {
    // ...
}

function fetchInfo(): Promise<Info> {
    return fetch('/info').then(res => res.json())
}
```