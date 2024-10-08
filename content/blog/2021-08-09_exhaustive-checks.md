---
title: "Improving error handling in TypeScript"
description: "Using exhaustive type checking for a better error controll in TS."
date: 2021-08-09
banner: "/images/blog/2021-08-09_exhaustive-checks/banner.png"
externalUrl: "https://blog.logrocket.com/improve-error-handling-typescript-exhaustive-type-checking/"
---

There are very few programs that work in complete isolation. Even if developers always write perfect code, there is a high likelihood of encountering errors when code interacts with external components like databases, REST APIs, and even that trendy npm package that has a bunch of stars!

Instead of sitting back while the server crashes, a responsible developer thinks defensively and prepares for when a malformed request comes in. In this article, we’ll cover a few of the most common approaches for error handling in TypeScript. We’ll learn how each method is used, see how each method could be improved, and finally, propose a cleaner way to manage errors.

Let’s get started!

_Note: If you’re not familiar with TypeScript, good news. The conditions that cause errors and the solutions also apply to JavaScript._

# Popular TypeScript error handling approaches

Before we dig in, keep in mind that the following list is by no means exhaustive. The errors and solutions presented here are based on my subjective experience, so your mileage may vary. 🏎️

## Returning null

Returning null is a common way to indicate that something in your code went wrong. It is best used when a function only has one way to fail, however, some developers use it when a function has many errors.

Returning null forces null checks everywhere in your code, causing specific information about the cause of the error to be lost. Returning null is an arbitrary representation of an error, so if you try returning `0`, `-1`, or `false`, you’ll end up with the same result.

In the code block below, we’ll write a function that retrieves data about the temperature and humidity of a given city. The `getWeather` function interacts with two external APIs through two functions, `externalTemperatureAPI` and `externalHumidityAPI`, and aggregates the results:

```typescript
const getWeather = async (
	city: string
): Promise<{ temp: number; humidity: number } | null> => {
	const temp = await externalTemperatureAPI(city);
	if (!temp) {
		console.log(`Error fetching temperature for ${city}`);
		return null;
	}
	const humidity = await externalHumidityAPI(city);
	if (!humidity) {
		console.log(`Error fetching humidity for ${city}`);
		return null;
	}
	return { temp, humidity };
};

const weather = await getWeather("Berlin");
if (weather === null) console.log("getWeather() failed");
```

We can see that on entering `Berlin`, we receive the error messages `Error fetching temperature for ${city}` and `Error fetching humidity for ${city}`.

Both of our external API functions can fail, so `getWeather` is forced to check for null for both functions. Although checking for null is better than not handling errors at all, it forces the caller to make some guesses. If a function is extended to support a new error, the caller won’t know it unless they check the inners of the function.

Let’s say that `externalTemperatureAPI` initially throws a null when the temperature API returns `HTTP code 500`, which indicates an internal server error. If we extend our function to check the structural and type validity of the API response (i.e., check that the response is of `type number`), the caller will not know if the function returns null due to `HTTP code 500` or an unexpected API response structure.

## Throwing custom errors using try...catch

Creating custom errors and throwing them is a better option than returning null because we can achieve error granularity, which enables a function to throw distinct errors and allows the caller of the function to handle the distinct errors separately.

However, any function that throws an error will be stopped and propagated up, disrupting the regular flow of the code. Although this may not seem like a big deal, especially for smaller applications, as your code continues to layer `try...catch` after `try...catch`, readability and overall performance will decline.

Let’s try to solve the error in our weather example with the `try...catch` method:

```typescript
const getWeather = async (
	city: string
): Promise<{ temp: number; humidity: number }> => {
	try {
		const temp = await externalTemperatureAPI(city);
		try {
			const humidity = await externalHumidityAPI(city);
		} catch (error) {
			console.log(`Error fetching humidity for ${city}`);
			return new Error(`Error fetching humidity for ${city}`);
		}
		return { temp, humidity };
	} catch (error) {
		console.log(`Error fetching temperature for ${city}`);
		return new Error(`Error fetching temperature for ${city}`);
	}
};

try {
	const weather = await getWeather("Berlin");
} catch (error) {
	console.log("getWeather() failed");
}
```

In the code block above, when we try to access the `externalTemperatureAPI` and the `externalHumidityAPI`, we are met with two errors in the `console.log`, which are then stopped and propagated up several times.

# The Result class

When you use either of the two error handling approaches discussed above, a simple mistake can add unnecessary complexity on top of the original error. The problems that arise when returning null and throwing a `try...catch` are common in other frontend languages like [Kotlin](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/), Rust, and C#. These three languages use the `Result` class as a fairly generalized solution.

Regardless of whether execution succeeds or fails, the `Result` class will encapsulate the results of the given function, allowing the function callers to handle errors as part of the normal execution flow instead of as an exception.

When paired with TypeScript, the `Result` class provides [type safety](https://blog.logrocket.com/pattern-matching-and-type-safety-in-typescript-1da1231a2e34/) and detailed information about the possible errors that a function could result in. When we modify the error results of a function, the `Result` class provides us with compile-time errors in the affected places of our codebase.

Let’s look back at our weather example. We’ll use a TypeScript implementation of Rust’s Result and Option objects, [ts-results](https://github.com/vultix/ts-results):

_There are other packages for TypeScript with very similar APIs, like [NeverThrow](https://github.com/supermacro/neverthrow), so feel free to play around._

```typescript
import { Ok, Err, Result } from "ts-results";

type Errors = "CANT_FETCH_TEMPERATURE" | "CANT_FETCH_HUMIDITY";

const getWeather = async (
	city: string
): Promise<Result<{ temp: number; humidity: number }, Errors>> => {
	const temp = await externalTemperatureAPI(city);
	if (!temp) return Err("CANT_FETCH_TEMPERATURE");

	const humidity = await externalHumidityAPI(city);
	if (!humidity) return Err("CANT_FETCH_HUMIDITY");

	return Ok({ temp, humidity });
};

const weatherResult = await getWeather("Berlin"); // `weatherResult` is fully typed

if (weatherResult.err) console.log(`getWeather() failed: ${weatherResult.val}`);
if (weatherResult.ok) console.log(`Weather is: ${JSON.stringify(weather.val)}`);
```

Adding type-safe results from the function and prioritizing error handling in our code is an improvement from our previous examples, however, we still have work to do. Let’s explore how we can make our type checks exhaustive.

It is important to note that favoring the `Result` class doesn’t mean that you won’t use `try...catch` structures. `try...catch` structures are still required when you are working with external packages.

If you think the `Result` class is worth following, you can try encapsulating those touchpoints in modules and using the `Result` class internally.

# Adding exhaustive type checking

When handing functions that can return multiple errors, it can be helpful to provide type checks for covering all error cases. Doing so ensures that the caller of the function can react dynamically to the type of error, and it provides certainty that no error case is overlooked.

We can achieve this with an exhaustive switch:

```typescript
// Exhaustive switch helper
class UnreachableCaseError extends Error {
	constructor(val: never) {
		super(`Unreachable case: ${val}`);
	}
}

// ...

const weatherResult = getWeather("Berlin");
if (weatherResult.err) {
	// handle errors
	const errValue = weatherResult.val;
	switch (errValue) {
		case "CANT_FETCH_TEMPERATURE":
			console.error("getWeather() failed with: CANT_FETCH_TEMPERATURE");
			break;
		case "CANT_FETCH_HUMIDITY":
			console.error("getWeather() failed with: CANT_FETCH_HUMIDITY");
			break;
		default:
			// 👇 runtime type check for catching all errors
			throw new UnreachableCaseError(errValue);
	}
}
```

Running our weather example with the exhaustive switch will provide compile-time errors under two sets of circumstances. One is when all error cases are not handled, and the other is when the errors in the original function change.

# Summary

Now, you know an improved solution for handling common errors in TypeScript! Knowing how important error handling is, I hope you’ll use this method to get the most specific information about any errors in your application.

In this tutorial, we covered the downsides of some widespread approaches like returning null and the `try...catch` method. Finally, we learned how to use the TypeScript Result class with an exhaustive switch for error catching.
