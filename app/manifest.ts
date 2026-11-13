import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AADALA.MA — القانون المغربي",
    short_name: "AADALA",
    description: "منصة العدالة والذكاء القانوني المغربي",
    start_url: "/ar",
    display: "standalone",
    dir: "rtl",
    lang: "ar",
    background_color: "#F3EFE4",
    theme_color: "#0F5C52",
  };
}
