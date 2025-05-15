/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-icons-png.flaticon.com'],
  },
  webpack(config) {
    config.module.rules.forEach((rule) => {
      if (Array.isArray(rule.use)) {
        rule.use.forEach((useItem) => {
          if (
            typeof useItem === 'object' &&
            useItem.loader &&
            useItem.loader.includes('css-loader')
          ) {
            // Modify loader options here if needed
          }
        });
      }
    });

    return config;
  },
};

module.exports = nextConfig;
