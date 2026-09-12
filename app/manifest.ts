import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Suntrix Media",
    short_name: "Suntrix",
    description:
      "We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.",
    start_url: "/",
    display: "standalone",
    background_color: "#EE8019",
    theme_color: "#2A0C06",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
