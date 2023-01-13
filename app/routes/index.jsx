import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout, links as LayoutLinks } from "~/components/Layout";
import styles from "~/styles/global.css";

// See: https://remix.run/docs/en/v1/guides/styling
export function links() {
  return [{ rel: "stylesheet", href: styles }, ...LayoutLinks()];
}

// This isn't necessary for this demo but here's how server-side data fetching works.
// See: https://remix.run/docs/en/v1/guides/data-loading
export const loader = async () => {
  return json([
    { title: "Post 1", body: "First post" },
    { title: "Post 2", body: "Second post" },
    { title: "Post 3", body: "Third post" },
    { title: "Post 4", body: "Fourth post" },
    { title: "Post 5", body: "Fifth post" }
  ]);
};

export default function Index() {
  const items = useLoaderData();
  return (
    <div>
      <h1>Demo</h1>
      <Layout items={items} />
    </div>
  );
}
