import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "mapbox-gl": "./node_modules/mapbox-gl/dist/mapbox-gl.js",
    },
  },
  images: {
    // Flickr and ImageKit already serve the site's media. Sending those files
    // through /_next/image creates a second optimization/cache layer and can
    // exhaust Vercel Hobby quotas. Keep next/image's layout and lazy-loading
    // behavior, but deliver every source directly from its existing host.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "beibozwdtawltlsguoef.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "divovzeyblkexoqlwiqy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "hwjdohokbbiswetzhsoy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/travEM/**",
      },
    ],
  },
};

export default nextConfig;
