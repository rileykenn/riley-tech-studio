/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.rileytechstudio.com.au',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/icon.png'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
