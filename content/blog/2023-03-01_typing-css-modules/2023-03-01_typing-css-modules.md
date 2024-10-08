---
title: "Typing CSS Modules"
date: "2023-03-01"
description: "By leaning into automation 🤖"
banner: "/images/blog/2023-03-01_typing-css-modules/banner.png"
externalUrl: "https://blog.logrocket.com/write-type-safe-css-modules/"
---

One of the great things about working with TypeScript is that it significantly reduces and even removes the occurrence of specific bugs (typos, accessing prototype methods, and eases refactoring). Bugs caught at compile time make for more uptime, happier customers, and less on-call stress for developers.

TypeScript makes it easy to type our applications business logic and control flows; what if we could make our CSS module classes safe too?

This article will briefly discuss what CSS modules are, their developer experience shortcomings, and how to address them using TypeScript and automation.

## What are CSS Modules?

[CSS Modules](https://css-tricks.com/css-modules-part-1-need/) are a way to write modular, scoped CSS specific to your application's particular component or module.

At build time (with [Vite](https://vitejs.dev/) or other tools), the CSS Modules generate unique class names for each class defined in the CSS files. The generated class names are then used in JavaScript to refer to the CSS.

This makes the CSS modular and reusable, without class name conflicts or unnecessary duplications. It solves many of the pains that methodologies such as [BEM](https://getbem.com/) were designed to solve, but without the manual effort (following BEM within CSS Modules can still bring benefits).

_`📁 button.module.css`_

```css
.green {
	background-color: "green";
}

.red {
	background-color: "red";
}
```

_`📁 Component.tsx`_

```typescript
import styles from "./button.module.css";

const Component = () => (
	<>
		<button className={styles.green}>I am green!</button>
		<button className={styles.red}>I am red!</button>
	</>
);
```

## Developer Experience improvements

CSS Modules are a great tool, but since the class names are generated at runtime (and change between builds), is hard to use them in a type-safe way.

Manually typing each CSS Module is possible (using a TypeScript definition files), but updating them is tedious. Suppose a class name is added or removed from the CSS Module. In that case, the types must be manually updated, or the type safety won't work as expected! 😅

_`📁 button.module.css`_

```css
.green {
	background-color: "green";
}

.blue {
	/* 👈 `red` classname is removed, and `blue` is added instead */
	background-color: "blue";
}
```

_`📁 button.module.css.d.ts`_

```typescript
declare const styles: {
	readonly green: string;
	readonly red: string; // 👈 we forgot to update the types! 😔
};
export default styles;
```

_`📁 Component.tsx`_

```typescript
import styles from "./button.module.css";

const Component = () => (
	<>
		<button className={styles.green}>I am green!</button>
		{/* 👇 `red` does not exist, but since we forgot to update the types, the compiler wont fail! */}
		<button className={styles.red}>Am I blue?</button>
	</>
);
```

This may be trivial on small projects, but as the codebase and number of contributors grow, this repetitive and error-prone process will hinder the trust in the type-system. Let's see how we can automate it!

## Automatic typings

In this case, the automation solution is straight forward: we will generate the types automatically (instead of manually), and provide a script to verify that the generated types are up-to-date (to avoid incorrect types leaking into the compilation).

We could build a CSS to TypeScript definition extractor. Still, in this case we will leverage the open source package [`typed-css-modules`](https://github.com/Quramy/typed-css-modules) (don't reinvent the wheel)!

1. Install the package into your project: `npm i typed-css-modules`
2. Add type-generation to your main development script (in the example, `watch`).
3. Add a script to check for up-to-date types, it will fail if the generated types are not correct (`check:up-to-date-types`).

_`📁 package.json`_

```json
"scripts": {
  "watch": "vite build --watch & tcm --watch .",
  "check:up-to-date-types": "tcm --listDifferent ."
}
```

With those two scripts, its now possible to automatically keep the CSS Module type definitions in sync and check in the CI if the types are kept up to date.

## Conclusion

Working within the TypeScript ecosystem provides great potential, but it's easy to blow the trust in the type-system or generate unnecessary friction when leaning too much on manual processes.

Automate the boring stuff so that your team can focus on building a great products instead!
