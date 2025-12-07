import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar structure following book hierarchy
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Part 1: Introduction to AI & Robotics',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 1: Foundations of Physical AI & Robotics',
          collapsed: false,
          items: [
            'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics',
            {
              type: 'category',
              label: 'English Versions',
              collapsed: false,
              items: [
                {
                  type: 'category',
                  label: 'Beginner Level',
                  collapsed: true,
                  items: [
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics.en.beginner',
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/1.1-what-is-physical-ai.en.beginner',
                  ],
                },
                {
                  type: 'category',
                  label: 'Advanced Level',
                  collapsed: true,
                  items: [
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics.en.advanced',
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/1.1-what-is-physical-ai.en.advanced',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Urdu Versions',
              collapsed: false,
              items: [
                {
                  type: 'category',
                  label: 'Beginner Level',
                  collapsed: true,
                  items: [
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics.ur.beginner',
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/1.1-what-is-physical-ai.ur.beginner',
                  ],
                },
                {
                  type: 'category',
                  label: 'Advanced Level',
                  collapsed: true,
                  items: [
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/introduction-ai-robotics.ur.advanced',
                    'part1-introduction-ai-robotics/chapter1-foundations-physical-ai/1.1-what-is-physical-ai.ur.advanced',
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Chapter 2: Robotics Fundamentals',
          collapsed: false,
          items: [
            'part1-introduction-ai-robotics/chapter2-robotics-fundamentals/robotics-fundamentals',
            'part1-introduction-ai-robotics/chapter2-robotics-fundamentals/2.1-basic-robotics-concepts',
            'part1-introduction-ai-robotics/chapter2-robotics-fundamentals/2.2-robot-configurations',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Core Technologies',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 3: Sensors & Actuators',
          collapsed: false,
          items: [
            'part2-core-technologies/sensors-actuators',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 4: ROS2 Essentials',
          collapsed: false,
          items: [
            'part2-core-technologies/ros2-essentials',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 5: Simulation Environments',
          collapsed: false,
          items: [
            'part2-core-technologies/chapter5-simulation-environments/gazebo-simulation',
            'part2-core-technologies/chapter5-simulation-environments/nvidia-isaac-sim',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 3: Perception & Intelligence',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 6: Perception & Vision',
          collapsed: false,
          items: [
            'part3-perception-intelligence/chapter6-perception-vision/perception-vision',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 7: Vision-Language-Action (VLA) Models',
          collapsed: false,
          items: [
            'part3-perception-intelligence/chapter7-vla-models/vla-models',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 8: Machine Learning for Robotics',
          collapsed: false,
          items: [
            'part3-perception-intelligence/chapter8-machine-learning/machine-learning-for-robotics',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Advanced Topics',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 9: Deep Learning Architectures',
          collapsed: false,
          items: [
            'part4-advanced-topics/chapter9-deep-learning/deep-learning-architectures',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 10: Reinforcement Learning Principles',
          collapsed: false,
          items: [
            'part4-advanced-topics/chapter10-reinforcement-learning/reinforcement-learning-principles',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 11: AI Agents for Robotics',
          collapsed: false,
          items: [
            'part4-advanced-topics/chapter11-ai-agents/ai-agents-for-robotics',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Implementation & Deployment',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 12: Humanoid Robotics',
          collapsed: false,
          items: [
            'part5-implementation-deployment/chapter12-humanoid-robotics/humanoid-robotics',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 13: Jetson Edge Deployment',
          collapsed: false,
          items: [
            'part5-implementation-deployment/chapter13-jetson-deployment/jetson-edge-deployment',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 14: Ethics and Future of AI',
          collapsed: false,
          items: [
            'part5-implementation-deployment/chapter14-ethics-future/ethics-and-future-of-ai',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 6: Practical Applications',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Chapter 15: Hands-on Labs',
          collapsed: false,
          items: [
            'part6-practical-applications/chapter15-hands-on-labs',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 16: Quizzes & Assessments',
          collapsed: false,
          items: [
            'part6-practical-applications/chapter16-quizzes-assessments',
          ],
        },
        {
          type: 'category',
          label: 'Chapter 17: Specialized Systems',
          collapsed: false,
          items: [
            'part6-practical-applications/chapter17-specialized-systems',
            'part6-practical-applications/chapter17-specialized-systems/17.1-urdu-translation-layer',
            'part6-practical-applications/chapter17-specialized-systems/17.2-personalization-layer',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
