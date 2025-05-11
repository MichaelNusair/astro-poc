import { experimental_AstroContainer } from "astro/container";
import { type APIRoute } from "astro";
import Gallery from "../components/Gallery.astro";

export const prerender = false; // dynamic endpoint

const SHOP = import.meta.env.SHOP_DOMAIN; // .env
const TOKEN = import.meta.env.SHOP_STOREFRONT_TOKEN; // .env

export const GET: APIRoute = async ({ url }) => {
  if (!SHOP || !TOKEN) {
    return new Response("Missing env vars", { status: 500 });
  }

  /* ─ 0. read params ─ */
  const productId = url.searchParams.get("product_id");
  const handle = url.searchParams.get("handle");

  /* ─ 1. Storefront API ─ */
  const gql = /* GraphQL */ `
    query ($gid: ID, $handle: String) {
      product(id: $gid, handle: $handle) {
        media(first: 10) {
          nodes {
            mediaContentType
            ... on MediaImage {
              image {
                url(transform: { maxWidth: 1200 })
              }
            }
            ... on Video {
              previewImage {
                url
              }
              sources {
                url
                mimeType
              }
            }
          }
        }
      }
    }
  `;
  const vars = productId
    ? { gid: `gid://shopify/Product/${productId}` }
    : { handle };

  const json = await fetch(`https://${SHOP}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query: gql, variables: vars }),
  }).then((r) => r.json());

  const items = (json.data?.product?.media?.nodes ?? []).map((n: any) => ({
    type: n.mediaContentType === "VIDEO" ? "video" : "image",
    thumb:
      n.image?.url ?? n.previewImage?.url ?? n.sources?.[0]?.url + "#t=0.1",
    src: n.image?.url ?? n.sources?.[0]?.url,
  }));

  /* ─ 2. Container render ─ */
  const container = await experimental_AstroContainer.create();
  const html = await container.renderToString(Gallery, { props: { items } });

  /* ─ 3. return to Shopify ─ */
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
};
