export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/profile",
          "/cart",
        ],
      },
    ],
    sitemap: "https://maahshopsite.ir/sitemap.xml",
  };
}
