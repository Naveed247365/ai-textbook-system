import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: string; // Using string for emoji icons
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Physical AI Foundations',
    icon: '🤖',
    description: (
      <>
        Deep dive into Physical AI concepts, where AI systems interact with and operate in the physical world,
        going beyond traditional virtual AI applications.
      </>
    ),
  },
  {
    title: 'Interactive AI Learning',
    icon: '💬',
    description: (
      <>
        'Select Text → Ask AI' feature for instant clarifications, AI-powered explanations,
        and interactive learning experiences throughout the textbook.
      </>
    ),
  },
  {
    title: 'Hands-On Labs',
    icon: '🧪',
    description: (
      <>
        Practical lab exercises using Gazebo simulation, NVIDIA Isaac Sim,
        and Jetson edge deployment for real implementation.
      </>
    ),
  },
  {
    title: 'Advanced Technologies',
    icon: '🔬',
    description: (
      <>
        Explore cutting-edge technologies like Vision-Language-Action (VLA) models,
        ROS2, NVIDIA Isaac Sim, perception systems, and machine learning for robotics.
      </>
    ),
  },
  {
    title: 'Personalized Learning',
    icon: '🎯',
    description: (
      <>
        Chapter difficulty adjustment based on your learning pace and comprehension,
        with adaptive content delivery.
      </>
    ),
  },
  {
    title: 'Multilingual Support',
    icon: '🌐',
    description: (
      <>
        Content available in multiple languages including Urdu,
        making robotics education accessible to diverse audiences.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureItem)}>
      <div className={styles.featureIcon}>{icon}</div>
      <div className={styles.featureContent}>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDescription}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center padding-bottom--lg">
          <Heading as="h2" className={styles.featuresTitle}>
            Advanced Learning Features
          </Heading>
          <p className={styles.featuresSubtitle}>
            A comprehensive textbook with AI-powered learning tools to enhance your understanding of Physical AI & Humanoid Robotics
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
