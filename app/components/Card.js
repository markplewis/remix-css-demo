import { useMedia } from "react-use";

import styles from "./Card.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function Card({ item, index, isLast }) {
  const isMedium = useMedia("(min-width: 600px)", false);
  // const isWide = useMedia("(min-width: 800px)", false);

  const isFirst = index === 0;
  const classes = [
    "Card",
    isMedium && isFirst ? "CardLarge" : null,
    isFirst ? "CardFirst" : null,
    isLast ? "CardLast" : null
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
