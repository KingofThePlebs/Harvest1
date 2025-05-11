
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Remote patterns are no longer needed if all images are local.
    // If you still have other remote images, you can keep their patterns here.
    // For example:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'some-other-domain.com',
    //   },
    // ],
  },
};

export default nextConfig;
