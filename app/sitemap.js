import Categorymodel from "@/model/Categorymodel";
import ConnectToDB from "./lib/mongodb";

export default async function sitemap() {
  const baseUrl = "https://maahshopsite.ir";

  await ConnectToDB();

  const categories = await Categorymodel.find({
    isActive: true,
  })
    .select("slug")
    .lean();

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aboutus`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },

    ...categoryUrls,
  ];
}