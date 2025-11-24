import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "mapbox-gl": "./node_modules/mapbox-gl/dist/mapbox-gl.js",
    },
  },
};

export default nextConfig;
