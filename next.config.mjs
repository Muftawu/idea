/** @type {import('next').NextConfig} */

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    reactStrictMode: true,
    transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;
