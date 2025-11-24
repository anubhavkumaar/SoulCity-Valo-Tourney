/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is the key change
  images: {
    unoptimized: true, // Required for static export since Next.js Image Optimization won't work on static hosting without a paid plan or custom loader
  },
};

export default nextConfig;