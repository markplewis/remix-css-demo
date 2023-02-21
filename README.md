# CSS server-side vs client-side rendering demo

This demo was built using Remix because it offers server-side rendering out-of-the-box.

## Purpose

The purpose of this repo is twofold:

- To demonstrate some of the pitfalls of runtime CSS-in-JS, specifically
  `window.matchMedia` media queries.
- To introduce CSS Style Queries and demonstrate how they may be useful.

## Files

Take a look at `app/routes/index.jsx`, the `Layout` and `Card` components that it renders, and
their respective CSS files. Everything else in this repo is boilerplate Remix configuration.

## Enabling CSS Style Queries

In Google Chrome, you'll need to:

1. Navigate to `about://flags/#enable-experimental-web-platform-features`.
2. Set it to Enabled.
3. Restart the browser.

## Discussion points

See the following notes for demo-specific information. See `DISCUSSION.md` for more in-depth thoughts.

## VSCode plugins

You may want to install the following VSCode plugins:

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

### Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!
