# Discussion points

## Background

Conditionally rendering components or adding classes to elements should only be done based on information that's available server-side, at compile time. Otherwise, there will be a percievable shift when components re-render differently on the client side. For example:

```jsx
// Good! The number of cards is known at build-time and doesn't change.
<Card isLast={index === cards.length - 1} />

// Bad! The width of the user's viewport cannot be known until client-side JavaScript is available.
<Card isLarge={isDesktop} />
```

> In the above example, CSS `:last-child` would be sufficient for styling purposes, but the `isLast` prop would be required if we needed to render different markup within the card.

For things that aren't defined/known until client-side JavaScript becomes available, traditional CSS should be used because it doesn't need to wait for JavaScript to initialize.

## Challenges

Since it isn't always possible to tell a component how to display itself at the JSX level (for reasons described above), how can we write components that aren't littered with context-specific media queries? Because, in an ideal world, the following _"JSX dictates everything"_ design pattern would be far nicer to maintain than the _"Separate JSX and CSS responsibilities"_ design pattern.

### Design pattern: JSX dictates everything

#### Package.jsx

```jsx
// The same Card component is used in multiple contexts ("home page" vs. other pages) and is
// explicitly told how to display itself via conditionally-applied classes and/or props.
// Unfortunatelty, `isDesktop` and `isTablet` will be `false` on the server, then may become `true`
// on the client, resulting in visible jankiness.
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
/* Doesn't know anything about its parent components or the width of the viewport */
.card--normal { … }
.card--large { … }
```

### Design pattern: Separate JSX and CSS responsibilities

#### Package.jsx

```jsx
// The same Card component is used in multiple contexts, as dictated by the parent element's
// class (or some other kind of parent selector)
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

/*
Problems:
- Card styles are overridden, violating CSS module encapsulation.
- It's necessary to manage CSS selector specificity and consider the order in which
styles are applied, since other files may override card styles as well.
- Media queries are baked-in, making it harder to re-use these styles elsewhere.
- Additional contexts and scenarios may need to be supported in the future, further bloating this file.
*/
```

> The above file could be broken up into separate files (e.g. `Package-normal.css` and `Package-home.css`), but these files would still override styles in the child `Card` component and contain baked-in media queries.

Moving the parent selectors into the child `Card` component would be equally detrimental:

#### Card.css

```css
/* All of the card styles are in a single file now, but the `.package--normal`
styles aren't needed on the home page, so the user is being served dead code */
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

/* Once again, the user may end up being served dead code because
the `card--normal` styles aren't needed on the home page */
```

### Using Style Queries

#### Package.jsx

```jsx
<Package className={`package ${isHomePage ? "package--home" : "package--normal"}`}>
  <Card className="card" />
</Package>
```

#### Package.css

```css
/* CSS custom property dictates what size the package's cards should be */
.package {
  --card-size: small;
}

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
/* Doesn't know anything about its parent components or the width of the viewport */
.card { … }

/* Different styles are conditionally applied, based on the parent context, without
violating encapsulation or baking-in any media queries */
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

## Further reading

- [Why We're Breaking Up with CSS-in-JS](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b)
- [Avoiding CSS overrides in responsive components](https://gist.github.com/OliverJAsh/1ebecee004e1bbc816e0b65086c7abee)
- [Inheritance media queries and css variables](https://www.samdawson.dev/article/css-variables-inheritance-media-queries)
