import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'Your Guide to Building Intelligent Physical AI Systems with Humanoid Robots',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://physicalai-textbook.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'physical-ai', // Usually your GitHub org/user name.
  projectName: 'humanoid-robotics-textbook', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-google-analytics',
      {
        trackingID: 'UA-XXXXX-Y', // Placeholder: User needs to provide their actual GA tracking ID
        anonymizeIP: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docusaurus-chapters', // Point to the chapters directory
          routeBasePath: '/docs', // Use /docs to match the reference book structure
          sidebarPath: require.resolve('./sidebars.ts'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/panaversity/ai-native-book/tree/main/', // Consider updating this to your actual repo
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/panaversity/ai-native-book/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Robotics',
      logo: {
        alt: 'Physical AI & Humanoid Robotics Textbook Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Chapters',
          to: '/docs/introduction-ai-robotics',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/physical-ai/humanoid-robotics-textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook Parts',
          items: [
            {
              label: 'Part 1: Introduction to AI & Robotics',
              to: '/docs/part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics',
            },
            {
              label: 'Part 2: Core Technologies',
              to: '/docs/part2-core-technologies/sensors-actuators',
            },
            {
              label: 'Part 3: Perception & Intelligence',
              to: '/docs/part3-perception-intelligence/chapter6-perception-vision/perception-vision',
            },
            {
              label: 'Part 4: Advanced Topics',
              to: '/docs/part4-advanced-topics/chapter9-deep-learning/deep-learning-architectures',
            },
            {
              label: 'Part 5: Implementation & Deployment',
              to: '/docs/part5-implementation-deployment/chapter12-humanoid-robotics/humanoid-robotics',
            },
            {
              label: 'Part 6: Practical Applications',
              to: '/docs/part6-practical-applications/chapter15-hands-on-labs',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'AI-Powered Features',
              to: '/docs/part6-practical-applications/chapter17-specialized-systems', // This would contain the AI features
            },
            {
              label: 'GitHub',
              href: 'https://github.com/physical-ai/humanoid-robotics-textbook',
            },
            {
              label: 'Hands-on Labs',
              to: '/docs/part6-practical-applications/chapter15-hands-on-labs',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: '/privacy',
            },
            {
              label: 'Terms of Service',
              to: '/tos',
            },
            {
              label: 'Cookie Policy',
              to: '/cookies',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
