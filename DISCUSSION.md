# Discussion points

## Observations from this demo

When your browser's viewport is greater than 600px wide and you refresh the page, you'll notice that the first card's heading is initially smaller, then suddenly becomes larger (which may cause CLS). This happens because `window.matchMedia` dictates whether the card should appear in its default or "large" display style, but this can't happen until JavaScript becomes active on the page.

## Best practices

Conditionally rendering markup/components or adding classes to elements should only be done based on information that's available server-side, at compile time. Otherwise, there will be a percievable shift when components re-render differently on the client side (as described above). For example:

```jsx
// Good! The number of cards is known at build-time and doesn't change.
<Card isLast={index === cards.length - 1} />

// Bad! The width of the user's viewport cannot be known until client-side JavaScript is available.
<Card isLarge={isDesktop} />
```

> For the first card in the above example, CSS `:last-child` would be sufficient for styling purposes. However, the `isLast` prop would be required in order to conditionally render different markup within the card.

Traditional CSS should be used for things that aren't defined/known until client-side JavaScript becomes available, because CSS doesn't need to wait for JavaScript.

## Challenges

Since it isn't always possible to tell a component how to display itself via conditional JSX (for reasons described above) and it's often necessary to rely on CSS instead, how can we write components that aren't littered with context-specific media queries? Because, in an ideal world, the following design pattern would be far nicer to maintain than the one after it:

### Design pattern: JSX dictates everything

#### Package.jsx

```jsx
// This file renders the same Card component in different contexts ("home page" vs. other pages).
// These cards are explicitly told how to display themselves via conditionally-applied classes
// and/or props. Unfortunatelty, `isDesktop` and `isTablet` will be `false` on the server, then
// may become `true` on the client, resulting in visible jankiness.
{
  isHomePage ? (
    <Card className={isDesktop ? "card--large" : "card--normal"} />
  ) : (
    <Card className={isTablet ? "card--large" : "card--normal"} />
  );
}
```

#### Card.css

```css
/* This CSS module doesn't need to know anything about
its parent components or the width of the viewport! */
.card--normal { … }
.card--large { … }
```

### Design pattern: Separate JSX and CSS responsibilities

#### Package.jsx

```jsx
// The same Card component is used in multiple contexts ("home page" vs. other pages), but the
// Package component must override the cards' CSS in order to achieve the desired effect.
<Package className={isHomePage ? "package--home" : "package--normal"}>
  <Card className="card" />
</Package>
```

#### Card.css

```css
/* Styles are straightforward but get overridden by other files, violating encapsulation */
.card { … }
```

#### Package.css

```css
/* Card overrides for "normal" packages */
.package--normal .card { … }

@media (min-width: 768px) {
  .package--normal .card { … } /* "Large" card styles */
}

/* Card overrides for "home page" packages */
.package--home .card { … }

@media (min-width: 1280px) {
  .package--home .card { … } /* "Large" card styles */
}
```

#### Problems

- Card styles are overridden, violating CSS module encapsulation.
- It's necessary to manage CSS selector specificity and consider the order in which styles are applied, since other files may override card styles as well. These overrides become difficult to keep track of as more files employ them.
- Viewport widths are baked into the CSS, making it harder to re-use these styles elsewhere.
- Additional contexts/scenarios may need to be supported in the future, which would further bloat this file.

> The above file could be broken up into separate files (e.g. `PackageNormal.css` and `PackageHome.css`), but they'd still suffer from the same problems described above.

Side note: moving the parent selectors into the child `Card` component would be equally detrimental:

#### Card.css

```css
/* All of the card styles are now in a single file, but the `.package--normal`
styles aren't needed on the home page, so users will be served dead code */
.card { … }
.package--normal .card { … }
.package--home .card { … }
/* etc… */
```

## Possible solutions

### Using Container Queries

#### Package.jsx

```jsx
<Package className="package">
  <Card className={isHomePage ? "card--home" : "card--normal"} />
</Package>
```

#### Package.css

```css
.package {
  container-type: inline-size;
}
```

#### Card.css

```css
/* When the "normal" cards' container reaches a certain width */
@container (min-width: 768px) {
  .card--normal { … } /* "Large" card styles */
}

/* When the "home page" cards' container reaches a certain width */
@container (min-width: 1280px) {
  .card--home { … } /* "Large" card styles */
}
```

#### Problems

- Once again, users may end up being served dead code because the `card--normal` styles aren't needed on the home page.
- Ideally, context-specific classes like `--home` shouldn't be applied to the card because it shouldn't need to be aware of its parent context. This undermines CSS encapsulation.
- Container widths are baked into the CSS, making it harder to re-use these styles elsewhere. However, container queries are more versatile than media queries due to their non-global scope.
- Additional contexts/scenarios may need to be supported in the future, which would further bloat this file.

### Using Style Queries

#### Package.jsx

```jsx
<Package className={`package ${isHomePage ? "package--home" : "package--normal"}`}>
  <Card className="card" />
</Package>
```

#### Package.css

```css
/* A CSS custom property dictates what size the package's cards should be */
.package {
  --card-size: small;
}

/* Media queries and viewport widths are defined here, in the parent module,
and none of the child module's styles are overridden */
@media (min-width: 768px) {
  .package--normal {
    --card-size: large;
  }
}

@media (min-width: 1280px) {
  .package--home {
    --card-size: large;
  }
}
```

#### Card.css

```css
/* This module doesn't know anything about its parent modules or the width of the viewport */
.card { … }

/* Different styles are conditionally applied based on the parent context, without
violating encapsulation or baking in any width values */
@container style(--card-size: small) {
  .card { … }
}

@container style(--card-size: large) {
  .card { … }
}
```

### Using Style Queries with Container Queries

#### Package.jsx

```jsx
<Package className="package">
  {/* An extra wrapper `div` is required */}
  <div className={`package-inner ${isHomePage ? "package-inner--home" : "package-inner--normal"}`}>
    <Card className="card" />
  </div>
</Package>
```

#### Package.css

```css
.package {
  container-type: inline-size;
}

.package-inner {
  --card-size: small;
}

/* When `.package` reaches a certain width, cards within the "--normal" container will become large */
@container (min-width: 768px) {
  .package-inner--normal {
    --card-size: large;
  }
}

/* When `.package` reaches a certain width, cards within the "--home" container will become large */
@container (min-width: 1280px) {
  .package-inner--home {
    --card-size: large;
  }
}
```

#### Card.css

```css
/* Same outcome as the previous example */
.card { … }

@container style(--card-size: small) {
  .card { … }
}

@container style(--card-size: large) {
  .card { … }
}
```

## Variables in CSS media queries

Unfortunately, it [isn't possible to use CSS custom properties in media queries](https://bholmes.dev/blog/alternative-to-css-variable-media-queries/), like this:

```css
@media (min-width: var(--breakpoint-wide)) {
  /* styles */
}
```

However, it may [eventually be possible to use CSS environment variables in media queries](https://drafts.csswg.org/css-env-1/), like this:

```css
@media (min-width: env(--breakpoint-wide)) {
  /* styles */
}
```

> Because environment variables don’t depend on the value of anything drawn from a particular
> element, they can be used in places where there is no obvious element to draw from, such as
> in @media rules, where the var() function would not be valid.

For a while, it was possible to polyfill the above functionality using PostCSS, via [postcss-env-function](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-env-function). Unfortunately, this feature was [removed from `postcss-preset-env` in version 8](https://github.com/csstools/postcss-plugins/wiki/PostCSS-Preset-Env-8).

Fortunately, it's still possible to achieve something similar in PostCSS via [postcss-design-tokens](https://github.com/csstools/postcss-plugins/tree/postcss-preset-env--v8/plugins/postcss-design-tokens). It isn't quite as nice
but it works. Here's an example:

```css
@design-tokens url("../design-tokens.json") format("style-dictionary3");

@media (min-width: token("breakpoints.wide" to rem)) {
  /* styles */
}
```

## Further reading

- [Why We're Breaking Up with CSS-in-JS](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b)
- [Avoiding CSS overrides in responsive components](https://gist.github.com/OliverJAsh/1ebecee004e1bbc816e0b65086c7abee)
- [Inheritance media queries and css variables](https://www.samdawson.dev/article/css-variables-inheritance-media-queries)
- [Why you should use CSS env()](https://blog.logrocket.com/why-you-should-use-css-env-9ee719ce0f24/) (outdated)
