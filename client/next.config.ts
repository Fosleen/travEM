import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "mapbox-gl": "./node_modules/mapbox-gl/dist/mapbox-gl.js",
    },
  },
  images: {
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
    ],
  },
};

export default nextConfig;
