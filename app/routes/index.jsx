import styles from "~/styles/global.css";
import { Layout, links as LayoutLinks } from "~/components/Layout";

// See: https://remix.run/docs/en/v1/guides/styling

export function links() {
  return [...LayoutLinks(), { rel: "stylesheet", href: styles }];
}

const items = [
  { title: "Post 1", body: "First post" },
  { title: "Post 2", body: "Second post" },
  { title: "Post 3", body: "Third post" },
  { title: "Post 4", body: "Fourth post" },
  { title: "Post 5", body: "Fifth post" }
];

export default function Index() {
  return (
    <div>
      <h1>Demo</h1>
      <Layout items={items} />
    </div>
  );
}
