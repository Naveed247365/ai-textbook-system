import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--5')}>
            <h1 className={clsx('hero__title', styles.heroTitle)}>
              {siteConfig.title}
            </h1>
            <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
              {siteConfig.tagline}
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics">
                Start Reading
              </Link>
            </div>
          </div>
          <div className={clsx('col col--5 col--offset-2')}>
            <div className={styles.heroImageContainer}>
              <img
                src="/img/book-cover-page.svg"
                alt="Physical AI & Humanoid Robotics Book Cover"
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NewsletterSignup() {
  return (
    <div className={styles.newsletter}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className={styles.newsletterTitle}>
              Stay Updated with Physical AI & Robotics Content
            </Heading>
            <p className={styles.newsletterSubtitle}>
              Subscribe to receive updates on new chapters, labs, and insights in AI-driven robotics
            </p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.newsletterInput}
              />
              <button className="button button--primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Your Guide to Physical AI & Humanoid Robotics">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <NewsletterSignup />
      </main>
    </Layout>
  );
}
