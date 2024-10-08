---
title: "Advanced Electron.js architecture"
description: An exploration of different Electron architectures.
date: 2021-07-14
banner: "/images/blog/2021-07-14_advanced-electron-architecture/banner.png"
externalUrl: "https://blog.logrocket.com/advanced-electron-js-architecture/"
---

> A while back, I began working on a side project called [taggr](https://taggr.ai/), a completely offline, interactive photo exploration app. Developing taggr required me to navigate up from the lowest level of app complexity, trying out multiple architectural approaches and exploring the limitations of each.

In this article, we’ll discuss the trade-offs of different architectural approaches for building desktop applications with [Electron](https://blog.logrocket.com/building-cross-platform-desktop-apps-with-svelte-electron-and-reloadly/). We’ll analyze the shortcomings of each and introduce an architecture that aims to tackle them.

The blueprint presented in this article is the outcome of an ongoing effort to find an approach that enables me, a solo developer, to manage the complexity of the app and meet performance requirements by leveraging standard web tooling. Let’s dive in!

_Note: You can follow along with this [GitHub repository](https://github.com/aperkaz/yarn-workspaces-electron)._

# Introduction to Electron.js

In the last few years, JavaScript usage has dramatically increased within the browser realm, largely with the help of libraries and frameworks like React, Vue, and Angular. Similarly, we’ve seen JavaScript grow beyond the browser with Node.js, Deno, and React Native.

Electron.js is one of these frameworks. Since its release in 2013, [Electron](https://www.electronjs.org/) has grown to become one of the most-used frameworks for building cross-platform desktop applications. VS Code, Slack, Twitch, and many other popular desktop applications are built using Electron.

## How Electron works

Electron embeds Chromium and Node.js in its binary, enabling web developers to write desktop applications without writing native code. Electron implements a multi-process model composed of the main and renderer processes, which is similar to the Chromium browser.

Each application’s window is a render process, which isolates the code execution at window level. The main process is responsible for the application lifecycle management, window management or render process, and native APIs like system menus, notifications, and tray icons.

Each app is composed of one main process and a variable number of render processes. Render processes can be used for JavaScript code execution and can be hidden without a UI.

{% image "./image1.png", "Image 1" %}

_Note: Electron is not the only option for building cross-platform desktop applications. Other [alternatives](https://github.com/sudhakar3697/electron-alternatives) offer less resource consumption and lighter executables, but none share the community, learning resources, or the widespread adoption of Electron._

# Getting started with Electron

If you aren’t already familiar with Electron, it’s pretty easy to get started, especially because knowledge of Node.js and JavaScript is transferrable.

Electron provides abstractions and a familiar language, reducing the time to market and development costs. Essentially, what Electron does for desktop app development is similar to what React Native does for mobile development.

Electron also manages building and deploying app updates, making it easy to keep cross-platform apps in a synced version. You can achieve this with auto-updates and by loading remote assets at runtime.

However, the benefits of Electron are not without their trade-offs. Electron ships with Chromium and Node.js environments, causing an Electron app to consume more resources than its natively implemented counterparts. As a result, there are mixed opinions about Electron’s viability.

In addition, complex Electron apps present performance and developer experience challenges related to the underlying architecture. Let’s consider these trade-offs in depth by analyzing three different app examples.

# App-specific tradeoffs

Let’s examine the high-level architectures of three fictional apps with varying complexity. Bear in mind that our app analysis does not aim to be exhaustive, rather, it aims to tease potential apps that you can build with Electron.

## Low-complexity app

Let’s start with a low-complexity app. For our example, we’ll consider packaging a webpage as a desktop application. Examples could include instant messaging apps, data analysis dashboards, and online streaming apps.

Many businesses provide desktop versions of their successful web-based apps, making ours a common use case. We’ll use Electron to run the app on Chromium, [eliminating unnecessary polyfills](https://www.electronjs.org/docs/tutorial/performance#5-unnecessary-polyfills) and providing a unified UI instead of a heterogeneous browser landscape.

### Low-complexity app main features:

- Code will be shared between the web app and the desktop app
  The update cycle will be shared between the web app and desktop app
- The desktop app will load the same assets as the web app and render them within Chromium
- The backend (if applicable) will stay unchanged
- The backend will be accessed the same way from both the desktop and web app
- Features dependent on browser support, like WebWorkers and WebGL, will function cross-platform without changes
- We’ll use standard web development tooling

### High-level architecture for low-complexity app

As an example architecture, we’ll use a desktop app for the [Telegram chat](https://web.telegram.org/) web app. Electron will act as a wrapper for the existing web app without requiring any changes to the backend.

{% image "./image2.png", "Image" %}

Setting up Electron is easy for this type of app! There are no changes needed at the web app codebase level.

## Medium-complexity app

A music streaming app like Spotify, which offers offline streaming support using a local cache, is a typical example of an app with a medium level of complexity. The desktop app can use Electron to build a local cache layer.

Similar to low-complexity apps, a medium-complexity app may also complement a web app. The main difference is the ability to provide offline support. Therefore, these apps are conceptually related to progressive web apps ([PWAs](https://blog.logrocket.com/why-you-should-turn-your-app-into-a-pwa/)) with offline support.

### Main features:

- Most of the code can be shared between web and desktop apps (i.e., in a UI layer)
- The desktop app will have a local cache implementation that will intercept the backend requests, populate the cache, and serve cached results when offline
- We need to use high-level Electron APIs to check if the desktop app is online or offline
- The update cycle is not necessarily shared between the web and desktop. The desktop will load the UI from static files using its offline UI and create a custom request layer with the cache
- You can leverage standard web development tooling with the exception of the custom request module, which must be developed and adjusted for Electron.

### High-level architecture

Let’s imagine that our streaming app plays a song of the day. If there is no internet connection, it will serve the available cached song.

{% image "./image3.png", "Image" %}

As outlined in the schema above, the UI will be served from local assets instead of a CDN, and the request layer has to be customized to support caching. While the example is relatively simple, the code-sharing and caching requirements will eventually increase in complexity, requiring custom Electron code.

## High-complexity app

For the highest level of complexity, let’s look at a batch image processing app like [sharp](https://github.com/lovell/sharp). The app must be able to process thousands of images and work entirely offline.

Offline apps are significantly different from the previous two examples. Specifically, the typical backend workloads, like image processing, will execute within Electron by creating an offline application.

### Main features:

- Most of our code will be custom for the desktop app
- The app will have its own release cycle
- The backend will run from within Electron (i.e., from a render process)
- Standard web development tooling can be used, but it depends on the defined architecture
- We may need to use native modules like database access, image processing, or machine learning
- Lower-level Electron API access may be needed from multiple processes, especially for [interprocess communications](https://blog.logrocket.com/handling-interprocess-communications-in-electron-applications-like-a-pro/) (IPC)

### High-level architecture

For the architecture proposal, let’s consider the offline image processing app described above.

{% image "./image4.png", "Image" %}

The schema structures the app following the Electron documentation, which brings some limitations. For one, there is noticeable performance degradation when running the long-lived, CPU-intensive operations in a hidden renderer process.

Note that you should never run the operations in the [main process](https://www.electronjs.org/docs/tutorial/performance#3-blocking-the-main-process). Doing so may block the main process, causing your application to freeze or crash.

Additionally, coupling the business logic and transport layers to Electron APIs limits the options to reuse standard web development tooling. Communications between the main processes and renderer processes use IPC, which requires a main process roundtrip when communicating between two render processes.

If your app falls in the low or medium-complexity categories, congrats! Many of the headaches that arise in offline apps won’t apply to you. However, if your app requirements fall in the high complexity range, there is still hope!

## Advanced architecture proposal

When we consider issues in offline apps like performance degradation, roundtrip communication between render processes, and the overall developer experience, we need a specialized architecture:

{% image "./image5.png", "Image" %}

The proposed architecture is built on the following pillars:

- The code shared between the frontend and the backend is extracted into a single module
- The UI code is Electron agnostic, so web development best practices can be applied
- The UI and page routing are built using controlled components and a centralized app state
- The backend is run from a separate Node.js process
- The frontend and backend modules communicate through message passing

Let’s go through each of the modules in detail!

_Note: parts of the stack are chosen purely due to personal preference and are interchangeable. For example, you can swap TypeScript for JavaScript, React for Vue, Redux for MobX, or npm packages for code sharing instead of Yarn workspaces. As long as the pillars mentioned above are respected, you have freedom of choice across the stack._

### Shared module

The shared module is responsible for the code and types shared by both the frontend and backend modules. It enables you to develop both modules as separate entities while still sharing the domain-relevant code and types.

Codesharing is achieved using Yarn workspaces, a simple alternative to publishing the module as an npm package, releasing, and versioning it.

**Main features:**

- Typescript codebase
- Typings for message passing communication: contains payloads and message handlers required in both the frontend and backend
- Domain models and entities
- Shared utilities like logging and event reporting

### Frontend module

The frontend module is responsible for all things UI. It contains the components and animations of our app but not the business logic. In production, Electron serves it from generated static files.

**Main features:**

- Typescript codebase with access to the shared module
- Uses React for building the user interface with Create React App as a template
- Uses Redux as the state manager, which deterministically defines the UI’s render state
- Communication with the backend through message passing: the frontend exposes a message handler that listens for messages from the backend and modifies the Redux store accordingly
- Component development in isolation using Storybook

### Backend with Electron module

The backend module contains the backend codebase and the Electron setup code. The business logic and long-running operations, like image processing, will run in a separate Node.js process so that the UI doesn’t suffer from degraded performance.

**Main features:**

- Typescript codebase, with access to the shared module
- The backend runs as a forked Node.js process, which improves performance for long-running and computationally expensive tasks
- Access to native dependencies
- Performs a pre-build step that matches native dependencies with the Electron version
- Contains the required Electron configuration and packaging scripts

### Communication layer

The frontend and backend communicate using interprocess message passing with [`node-ipc`](https://github.com/RIAEvangelist/node-ipc). The message passing allows for `async` and event-based communication.

`async` communication is best suited for short-lived operations. The frontend can wait until the backend processes the message to get the result right away.

Event-based communication is better suited for long-lived operations, like batch processing. As the task processes in the backend, it sends events that will modify the frontend’s app state in Redux. The backend can asynchronously complete long-running tasks and periodically update the progress displayed by the UI.

**Main features:**

- `node-ipc` as the communication library
- Fully typed message payloads and handlers in the shared module
- Async and message-based communication support

## Conclusion

Electron is a great choice for building cross-platform desktop applications using different web technologies. Although Electron is easy to use in low-complexity apps, performance and developer experience limitations will surface as the complexity increases.

The proposed architecture aims to provide a sound conceptual foundation for high complexity apps. Of course, it may need to be extended depending on the use case, but I’ve found that it serves as a good foundation for many types of apps.
