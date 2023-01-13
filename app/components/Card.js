import { useMedia } from "react-use";
import styles from "./Card.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function Card({ item, isFirst, isLast }) {
  const isMedium = useMedia("(min-width: 600px)", false);

  const classes = [
    "Card",
    isFirst ? "CardFirst" : null,
    isLast ? "CardLast" : null,
    isMedium && isFirst ? "CardLarge" : null
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
