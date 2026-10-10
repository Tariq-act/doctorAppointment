const appwriteImagePattern = (() => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
    if (!endpoint) return null;
    const url = new URL(endpoint);
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/v1/storage/buckets/**",
    };
  } catch {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",
      },
      ...(appwriteImagePattern ? [appwriteImagePattern] : []),
    ],
  },
};

export default nextConfig;
