import styles from "./Layout.css";
import { Card, links as CardLinks } from "./Card";

export function links() {
  return [...CardLinks(), { rel: "stylesheet", href: styles }];
}

export function Layout({ items }) {
  return (
    <div className="Layout">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div className="LayoutItem" key={item.title}>
            <Card item={item} index={index} isLast={isLast} />
          </div>
        );
      })}
    </div>
  );
}
