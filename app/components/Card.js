import { useMedia } from "react-use";
import styles from "./Card.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function Card({ item, isFirst, isLast }) {
  // CSS-in-JS media query (`window.matchMedia`)
  const isMedium = useMedia("(min-width: 600px)", false);

  const classes = [
    "Card",
    isFirst ? "CardFirst" : null, // Known on server side
    isLast ? "CardLast" : null, // Known on server side
    isMedium && isFirst ? "CardLarge" : null // May change client-side, when JS initializes
  ]
    .filter(c => c)
    .join(" ");

  return (
    <div className={classes}>
      <h2 className="CardTitle">{item.title}</h2>
      <p className="CardBody">{item.body}</p>
    </div>
  );
}
