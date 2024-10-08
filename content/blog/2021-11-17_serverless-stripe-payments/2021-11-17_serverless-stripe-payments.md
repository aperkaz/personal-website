---
title: "Serverless payments with Netlify and Stripe"
date: "2021-11-17"
description: "How to set up serverless online payments with Netlify and Stripe."
banner: "/images/blog/2021-11-17_serverless-stripe-payments/banner.png"
externalUrl: "https://www.freecodecamp.org/news/serverless-online-payments/"
---

One of the first steps many young startups take is setting up a static web page, perhaps with an email newsletter, to help them build an audience.

As the weeks go by and the MVP is getting further along, the subject of how to handle payments will eventually emerge.

From one-time payments to SaaS subscriptions, supporting online payments can be daunting and time-consuming. This post will introduce you to an easy way to process online payments with Stripe, without any extra infrastructure other than a static web page.

You don't need a custom backend to store the payment information, or cron jobs to send invoices, and there's no need to track customers in a separate database. This is perfect if you are a single-founder or early-stage startup that wants to validate the idea without creating a custom solution.

Sounds good? Let's dive in! 🤿

# High-level overview of the project

For the sake of this article, we'll define an early-stage startup use case, where this kind of serverless online payment setup will bring the most value (low cost and fast to implement).

Let's imagine our startup idea is to self-publish a book. As the book is being finalized, we would like to open the lifetime access to the book as a pre-sale.

We will need a way to process payments for lifetime access to the book. For this, we'll need a payment processor and perhaps a way to run some logic away from the client (for example, leveraging the payment processor's API).

## Payment processor

There are plenty of payment processors available, each with different terms, support for payment methods, and public APIs. For our serverless online payment processor, we'll use [Stripe](https://stripe.com/). I chose to use Stripe for two reasons:

First, Stripe is an industry-leading payment processor with an excellent API. Their API is extensively documented, and they offer integration SDKs for many languages (JS included). Setting it up is entirely free, and you only pay a small commission per processed transaction.

Second, Stripe offers Stripe Checkout, a free product specifically built to boost conversions and support various payment options. It's dead-simple to integrate and comes with a great UI.

## What about the server?

To be clear, Stripe requires some server-side code to generate a session once a user inputs their payment data. The session is available to the developer to perform payment-related operations (without exposing the sensitive payment details).

Before you get really upset with me, let me clarify that we won't need to set up a dedicated server 😅. It may seem a bit contradictory, but Stripe requires that some of the interaction code is in a server-like environment (serverless computing to the rescue!).

Luckily for us, this is 2021, and there are quite a few options to execute on-demand server-side code. Most cloud providers offer this functionality (AWS lambdas, Google Cloud cloud functions, Azure functions…you name it).

Since our startup already has a web page, we'll use [Netlify functions](https://www.netlify.com/products/functions/). It will allow us to run the server-side code with almost no extra configuration, and it plays nicely with the existing web page statics.

The paradigm of combining static web assets with on-demand serverless functions is part of the [JAM Stack](https://jamstack.org/) (we'll leave that for another post). Keep reading for the detailed instruction on how to set up serverless payments.

{% image "./image1.png", "Image" %}

# Step-by-step project setup

Great, now that you have a clear picture of the problem space and the tools we'll use to build our solution, let's build it. 🛠

The complete code example is available at https://github.com/aperkaz/serverless-payments.

## How to set up Netlify

First, create a [Netlify](https://www.netlify.com/) account (if you don't have one already). The free tier is enough for moderate usage, so no need to worry about that.

Netlify provides CI/CD for automated deployments of our webpage and serverless functions by connecting to a Git repo in Github / Gitlab / Bitbucket. So, let's create a repo in one of those providers with your website assets.

Next, install the [Netlify CLI](https://cli.netlify.com/getting-started/). It will ask you some questions and request access to your Netlify and Git repo provider (GitHub in my case).

{% image "./image2.png", "Image" %}

👆 output of installing the CLI with `npm install netlify-cli -g`.

At this point, we can push to the repository’s `main` / `master` branch, and Netlify will automatically deploy. You can run `netlify open` in the console to open Netlify’s admin panel, and visit the deployed URL.

{% image "./image3.png", "Image" %}

Excellent, with the auto-deploy ready, now let's set up Stripe. 💸

## How to set up Stripe

Create an account in Stripe, validate the email, and sign in. Then, [generate a set of API keys](https://stripe.com/docs/keys) (Secret key and Publishable key).

You have to be careful with those keys and never commit the Secret key in the code. Since we will need it in our server-side code, we'll keep it as an [environment variable](https://www.netlify.com/blog/2021/07/12/managing-environment-variables-from-your-terminal-with-netlify-cli/).

```bash
# Create a new env variable in Netlify
netlify env:set STRIPE*SECRET "sk*\*\*\*\*"

# We can access it on our server-side JS code by:
process.env.STRIPE_SECRET
```

For the sake of this tutorial, we will use the [example API keys](https://stripe.com/docs/payments/accept-a-payment?integration=checkout#set-up-stripe), but feel free to use your own. If you use your keys, you will need to add products and prices ([documentation](https://support.stripe.com/questions/how-to-create-products-and-prices)).

## How to add the serverless functions

Hang on tight – we are almost there! We only need the server-side code to create Stripe Checkout sessions and complete our demo.

First, to make our function accessible from https://serverless-payments.netlify.app/api/stripe, we need to add some configurations. Let's start by creating the `netlify.toml` file, on the root of our repo.

```yaml
[build]
command = "# no build command"
functions = "netlify/functions"
publish = "."

[[redirects]]
from = '/api/\*'
to = '/.netlify/functions/:splat'
status = 200
```

Then, we can add the session creator function. It’s explained here.

_`📁 netlify/function/stripe.js`_

```javascript
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async (event, context) => {
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "T-shirt",
					},
					unit_amount: 2000,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: "https://serverless-payments.netlify.app/success",
		cancel_url: "https://serverless-payments.netlify.app/cancel",
	});
	return {
		statusCode: 200,
		body: JSON.stringify({
			id: session.id,
		}),
	};
};
```

Now we can call the serverless functions from our JS body with `fetch("/api/stripe")`. It will scale depending on the load and you only paid for the invocations. Then it will be deployed on every push to `main`. Sweet! 🍬

For the sake of brevity, I skipped the remaining code in the HTML files that handles the Stripe Checkout callbacks. The code is available [here](https://github.com/aperkaz/serverless-payments).

The complete example is available at https://serverless-payments.netlify.app . You can test a successful payment flow by using `4242 4242 4242 4242` as a credit card number.

{% image "./image4.png", "Image" %}

👆 Stripe Checkout in all its glory, accessible from our page.

# Conclusion

Online payments are critical to many online businesses but are often implemented in a rush or are over-engineered. The solution presented above applies to single-page applications, so you may not need a fully-fledged server for handling payments just yet. 🙂

I hope this article helps shed some light on adding payment processing to your existing web pages easily. Sell your product quickly and make customers happy!
