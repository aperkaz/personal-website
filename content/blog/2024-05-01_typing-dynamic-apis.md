---
title: "Typing dynamic API responses"
date: "2024-05-01"
description: "With runtime assurances"
banner: "/images/blog/2024-05-01_typing-dynamic-apis/banner.png"
---

When working with exteral APIs, I am a big fan of typing them in the client through schemas and runtime validation (with tools such as [zod](https://github.com/colinhacks/zod)).

With said tools, its possible to generate TypeScript types for dynamic objects (such as HTTP responses), with runtime assurances.
Seriously, check [zod](https://github.com/colinhacks/zod) if you havent! 🦸‍♂️

Those types provide great DX, making the debugging of issues such as unexpected breaking changes in API responses, a breeze.

_`📁 example.ts`_

```typescript
import { z } from "zod";

// the schema for user object
const userSchema = z.object({
	age: z.number(),
	name: z.string(),
});

// untyped and dynamic objects (such as HTTP response)
const validResponse = { name: "Bob", age: 43 } as any;
const invalidResponse = 12 as any;

userSchema.parse(invalidResponse);
// => throws ZodError ❌

const user = userSchema.parse(validResponse);
// 👆 `user` will be automatically typed in TypeScript
```

On a recent project, I encountered an API whose response was dynamically contructed based on the query parameters.

This provided example is a simplification, but it hopefully showcases the complexity if there where 100s of query parameters affecting the response payload shape.

_`📁 dynamic-API.ts`_

```typescript
const responseA = await fetch("https://example.com/animals?q=dogs").then((r) =>
	r.json()
);
// 👆 {dogs: ['Alfie', 'Rudolf']}

const responseB = await fetch("https://example.com/animals?q=cats").then((r) =>
	r.json()
);
// 👆 {cats: [{name: 'Mit', age: 4}}

const responseC = await fetch("https://example.com/animals?q=dogs,cats").then(
	(r) => r.json()
);
// 👆 {dogs: ['Alfie', 'Rudolf'], cats: [{name: 'Mit', age: 4}]}
```

One could allways return back to not typing the response through schemas, but its would be a poor DX.
So not an option 🤣

It turns out that an elegant solution is possible with zod's [pick](https://zod.dev/?id=pickomit) functionality (dynamically picking schema parts to apply):

_`📁 typed-dynamic-API.ts`_

```typescript
/** Unique source of truth, typing the shape of all the API responses */
const responseSchema = z.object({
	cats: z.array(z.string()),
	dogs: z.array(
		z.object({
			name: z.string(),
			age: z.number(),
		})
	),
});
export type QueryParams = keyof z.infer<typeof responseSchema>;
// 👆 "cats" | "dogs"

/** Will return a partial schema, based on schema's projerties named as `queryParams` */
export function getPartialSchema<T extends QueryParams[]>(queryParams: T) {
	const zodQuerySelector = queryParams.reduce(
		(previousValue, cur) => ({
			...previousValue,
			[cur]: true,
		}),
		{}
	) as { [Param in (typeof queryParams)[number]]: true };

	return responseSchema.pick(zodQuerySelector);
}
```

_`📁 usage-typed-dynamic-API.ts`_

```typescript
import { QueryParams, getPartialSchema } from "./typed-dynamic-API.ts";

const queryParams = ["dogs"] satisfies QueryParams[];

const response = await fetch(
	`https://example.com/animals?q=${queryParams.toString()}`
).then((r) => r.json());
// `response` is typed as `any` since its only known at runtime

const partialSchema = getPartialSchema(queryParams);
const animals = partialSchema.parse(response);
// 👆 `animals` will be automatically typed
```

Happy codding! 🎉
