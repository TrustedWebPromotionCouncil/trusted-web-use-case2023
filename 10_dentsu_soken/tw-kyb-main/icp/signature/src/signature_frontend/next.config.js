/** @type {import('next').NextConfig} */

const canisterIds = require('../../canisterIds');
canisterIds.exportEnv('NEXT_PUBLIC_');

const nextConfig = {
  // experimental: {
  //   appDir: true,
  // },
  output: 'export',
};

module.exports = nextConfig;
