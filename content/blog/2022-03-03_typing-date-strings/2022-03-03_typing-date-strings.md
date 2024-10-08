---
title: 'Date-strings in TypeScript'
date: '2022-03-03'
description: 'How to handle date-strings safely in TypeScript.'
banner: '/images/blog/2022-03-03_typing-date-strings/banner.png'
externalUrl: 'https://blog.logrocket.com/handing-date-strings-typescript/'
---

Lately, I have had to deal with multiple custom representations of dates as strings in one of my projects, such as `YYYY-MM-DD` and `YYYYMMDD`.

Since those dates are string variables, TypeScript infers the `string` type by default.
This is not wrong, but such type definition is broad, making working effectively with those date-strings hard.

`const dog = 'alfie'` is also inferred as a `string` type! 🤔

Here is how I approached the typing of those date strings to improve the developer experience and reduce the surface for bugs! 🐞

**TL:DR**; the recipe on how to type date stings is available in [this Gist](https://gist.github.com/aperkaz/580e72b98eba5afac30549387562655d).

# Some context first...

Before jumping into the code, I would like to briefly mention the TypeScript features leveraged to achieve the goal: [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) and [narrowing through type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

## Template literal types

Introduced in TypeScript 4.1, they share the syntax with JavaScript template literals but are used as types.

The type template literals resolve to a union of all the string combinations for a given template. This may sound a little abstract, so let's see it in action:

```typescript
type Person = 'Jeff' | 'Maria'
type Greeting = `hi ${Person}!` // 👈  Template literal type

const validGreeting: Greeting = `hi Jeff!` // ✅
// 👆 note that the type of `validGreeting` is the union `"hi Jeff!" | "hi Maria!`

const invalidGreeting: Greeting = `bye Jeff!` // ❌
// Type '"bye Jeff!"' is not assignable to type '"hi Jeff!" | "hi Maria!"
```

This feature is very powerful, as you can perform generic type operations over those types.
For example, [capilatization](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype):

```typescript
type Person = 'Jeff' | 'Maria'
type Greeting = `hi ${Person}!`
type LoudGreeting = Uppercase<Greeting> // 👈  Capitalization of template literal type

const validGreeting: LoudGreeting = `HI JEFF!` // ✅

const invalidGreeting: LoudGreeting = `hi jeff!` // ❌
// Type '"hi Jeff!"' is not assignable to type '"HI JEFF!" | "HI MARIA!"
```

## Type predicate narrowing

TypeScript does a phenomenal job at narrowing types, for example, in the following example:

```typescript
let age: string | number = getAge();
// `age` is of type `string` | `number`

if (typeof age === 'number') {
  // `age` is narrowed to type `number`
} else {
  // `age` is narrowed to type `string`
}
```

That said, when dealing with custom types, it can be helpful to tell the TypeScript compiler how to perform the narrowing.
For example, when we want to narrow to a type after performing a runtime validation.

Here is where the type predicate narrowing (aka user-defined type guards) comes in handy!

In the following example, the `isDog` type-guard helps narrow down the types for the `animal` variable by checking the type property:

```typescript
type Dog = { type: 'dog' };
type Horse = { type: 'horse' };

// 👇 custom type guard, `pet is Dog` is the type predicate
function isDog(pet: Dog | Horse): pet is Dog {
  return pet.type === 'dog';
}

let animal: Dog | Horse = getAnimal();
// `animal` is of type `Dog` | `Horse`

if (isDog(animal)) {
  // `animal` is narrowed to type `Dog`
} else {
  // `animal` is narrowed to type `Horse`
}
```

# Typing the date-strings

Now that we presented the TypeScript building blocks, let's bulletproof our date strings! 🚀
For the sake of brevity, this example will only contain the code for `YYYYMMDD` date strings.

All the code is available in the [following Gist](https://gist.github.com/aperkaz/580e72b98eba5afac30549387562655d).

First, we'll need to define the template literal types to represent the union of all the date-like stings:

```typescript
type oneToNine = 1|2|3|4|5|6|7|8|9
type zeroToNine = 0|1|2|3|4|5|6|7|8|9

/**
 * Years
 */
type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`
/**
 * Months
 */
type MM = `0${oneToNine}` | `1${0|1|2}`
/**
 * Days
 */
type DD = `${0}${oneToNine}` | `${1|2}${zeroToNine}` | `3${0|1}`

/**
 * YYYYMMDD
 */
type RawDateString = `${YYYY}${MM}${DD}`;

const date: RawDateString = '19990223' // ✅
const dateInvalid: RawDateString = '19990231' //✅ 31st of February is not a valid date, but the template literal doesnt know!
const dateWrong: RawDateString = '19990299' // ❌ Type error, 99 is not a valid day
```

As you saw in the example above, the template literal types help specify the shape of date-strings, but there is no actual validation for those dates.
That's why the compiler flags `19990231` as a valid date (even if it is not), as it fulfils the type of the template 😢

Also, when inspecting the variables above (`date`, `dateInvalid` and `dateWrong`), you will find that the editor displays the union of all valid strings for those template literals.

While useful, I prefer setting [nominal typing](https://michalzalecki.com/nominal-typing-in-typescript/#approach-4-intersection-types-and-brands), so that the type for valid date-string is `DateString` instead of `"19000101" | "19000102" | "19000103" | ...`.

The nominal type will also come in handy when adding user-defined type guards.

```typescript
type Brand<K, T> = K & { __brand: T };
type DateString = Brand<RawDateString, 'DateString'>;

const aDate: DateString = '19990101'; // ❌
// Type 'string' is not assignable to type 'DateString'
```

To ensure that our `DateString` type also represents valid dates, well set up a user-defined type guard to validate the dates and narrow the types.

```typescript
/**
 * Use `moment`, `luxon` or other date library
 */
const isValidDate = (str: string): boolean => {
  // ...
};

// 👇 User-defined type guard
function isValidDateString(str: string): str is DateString {
  return str.match(/^\d{4}\d{2}\d{2}$/) !== null && isValidDate(str);
}
```

Awesome, now let's see the date string types in a couple of examples:

```typescript
/**
 *  👇 Usage in type narrowing
 */

// 1️⃣ valid string format, valid date
const date: string = '19990223';

if (isValidDateString(date)) {
  // evaluates to true, `date` is narrowed to type `DateString` ✅
}

// 2️⃣ valid string format, invalid date (February doenst have 31 days)
const dateWrong: string = '19990231';

if (isValidDateString(dateWrong)) {
  // evaluates to false, `dateWrong` is not a valid date, even if its shape is YYYYMMDD ❌
}
```

```typescript
/**
 *  👇 Usage in factory function
 */

function toDateString(str: RawDateString): DateString {
  if (isValidDateString(str)) return str;
  throw new Error(`Invalid date string: ${str}`);
}

// 1️⃣ valid string format, valid date
const date1 = toDateString('19990211');
// `date1`, is of type `DateString`

// 2️⃣ invalid string format
const date2 = toDateString('asdf');
// ❌ Type error: Argument of type '"asdf"' is not assignable to parameter of type '"19000101" | ...

// 3️⃣ valid string format, invalid date (February doenst have 31 days)
const date3 = toDateString('19990231');
// ❌ Throws Error: Invalid date string: 19990231
```

# Conclusion

Thanks for sticking to the end! 🎉

I hope this article shared some light on what TypeScript is capable of in the context of typing custom strings. Remember that this approach is also applicable to other custom strings, such as custom user-ids `user-XXXX`, and other date-strings `YYYY-MM-DD`.

The possibilities are endless when combining user-defined type guards, template literal strings, and nominals typings 😉
