import styles from "./Layout.css";
import { Card, links as CardLinks } from "./Card";

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...CardLinks()];
}

export function Layout({ items }) {
  return (
    <div className="Layout">
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        return (
          <div className="LayoutItem" key={item.title}>
            <Card item={item} isFirst={isFirst} isLast={isLast} />
          </div>
        );
      })}
    </div>
  );
}
