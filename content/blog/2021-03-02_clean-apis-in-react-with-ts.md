---
title: Clean APIs in React with TypeScript
description: Designing cleaner type APIs for React components.
date: 2021-03-02
---

I hope this article shares some light on how to build better React components leveraging TypeScript. This post is an outcome of the efforts of building [taggr](https://taggr.ai/), the privacy-focused AI gallery.

---

> While building [taggr](https://taggr.ai/), I got deeper into TypeScript, and so far I am loving the added capabilities for annotating types and catching errors at compile time, instead off at runtime.

> It can feel daunting and extra work to annotate each component and function at first, but as the codebase grows in size and complexity, the benefits start to shine.

> Having the components and business-logic code properly typed, keeps a unique source of truth for the entities of a domain, minimizing the human errors across the application layers.

> Plus, TypeScript definitions can be automatically generated from [OpenAPI](https://github.com/drwpow/openapi-typescript), [GraphQL schemas](https://graphql-code-generator.com/docs/plugins/typescript)… A total win-win 🎉

---

When building React components, I try to keep their APIs as tight and as clean as possible. 🧹💨

Components with clear boundaries are easy to re-use, extend and overall nice to work with.

Let’s analyze a concrete example of how we can do cleaner component APIs using TypeScript, shall we?

<br/>

## Don’t expose Prop types from a component 😧

_`📁 paragraph.tsx`_

```tsx
export type Props = {
	text: string;
};

const Paragraph = ({ text }: Props) => <p>{text}</p>;
```

_`📁 title.tsx`_

```tsx
// Title is now tightly coupled to paragraph.txs > Props
import { Props } from "./paragraph";

const Title = ({ text }: Props) => <h1>{text}</h1>;
```

### Why is this bad?

- When exposing the Prop types directly, nothing stops other developers (even your future self 😂) from importing and extending those types in other parts of the application. This breaks component’s encapsulation and creates unnecessary dependencies between components.
- Changes to the Prop types of the original component can potentially break other parts of the app 💥
- A cluttered API, the module exports the component and types. This can quickly turn into component files exporting multiple types, so be careful 🧐

<br/>

## A better way ✅

Do not directly expose component Props types. **Don’t**.

_What if want to access the Props of another component, so I don’t have to re-declare domain-specific types?_

A component’s **Props** define the interface of the component with the rest of your application (or the world 🌎).

If you have a `UserProfile` component and the **Props** declare a `User` type that you want to use somewhere else in your app, it should be extracted out of the `UserProfile`.

Extract domain-specific types into `./types` so that they can be reused across the app.

_`📁 user-types.ts`_

```tsx
export interface User {
	name: string;
	age: number;
}
```

_`📁 user-profile.tsx`_

```tsx
import {User} from './user-types';

type Props = {
  user: User,
  date: string, // other props
};

const UserProfile = ({user, date}: Props) => ...
export default UserProfile;
```

_`📁 user-list.tsx`_

```tsx
import {User} from './user-types';

type Props = {
  users: User[],
};

const UserList = ({users}: Props) => ...
export default UserList;
```

**What if I need to get access to a component’s properties from somewhere else?**

They are valid reasons for wanting to access a component’s types, such as enhancing a component with [HOC](https://medium.com/javascript-scene/do-react-hooks-replace-higher-order-components-hocs-7ae4a08b7b58)s.

Lets check the next section to solve this!

<br/>

## Prop type lookup ✨

We can leverage TypeScript’s type resolution, to enable Prop type lookup.

Setup prop type lookup helper, `GetComponentProps`:

_`📁 utils.ts`_

```tsx
export type GetComponentProps<T> = T extends
	| React.ComponentType<infer P>
	| React.Component<infer P>
	? P
	: never;
```

Define the component that we want to extend, `Title`:

_`📁 title.tsx`_

```tsx
type Color = "RED" | "BLUE" | "GREEN";

type Props = {
	title: string;
	color: Color;
};

const Title = ({ title, color }: Props) => <h1 style={{ color }}>{title}</h1>;
export default Title;
```

Extend the Title component, while keeping full type safety:

_`📁 title-wrapper.tsx`_

```tsx
import Title from "./title";
import { GetComponentProps } from "./utils";

type Props = GetComponentProps<typeof Title> & {
	onClick: () => void;
};

const TitleWrapper = ({ onClick, ...rest }: Props) => (
	<button onClick={onClick}>
		<Title {...rest} />
	</button>
);
export default TitleWrapper;
```

_`📁 index.tsx`_

```tsx
import TitleWrapper from "title-wrapper"; // Full type safety and autocompletion! 🎉

const App = () => (
	<TitleWrapper
		title="Hello there"
		color="GREEN"
		onClick={() => window.alert("title pressed")}
	/>
);
```

<br/>

We managed to access the properties of `Title` from `TitleWrapper` , without manually exposing them and breaking encapsulation, great! 🎉
