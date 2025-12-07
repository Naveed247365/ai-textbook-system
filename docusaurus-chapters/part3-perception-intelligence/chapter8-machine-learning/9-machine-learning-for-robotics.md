---
title: "Machine Learning for Robotics"
sidebar_position: 9
---

# Machine Learning for Robotics

## Table of Contents
- [Introduction to ML in Robotics](#introduction-to-ml-in-robotics)
- [Supervised Learning in Robotics](#supervised-learning-in-robotics)
- [Unsupervised Learning Applications](#unsupervised-learning-applications)
- [Reinforcement Learning for Robots](#reinforcement-learning-for-robots)
- [Deep Learning for Perception](#deep-learning-for-perception)
- [Imitation Learning](#imitation-learning)
- [Transfer Learning in Robotics](#transfer-learning-in-robotics)
- [Online Learning and Adaptation](#online-learning-and-adaptation)
- [Learning from Demonstration](#learning-from-demonstration)
- [Safety and Robustness in ML for Robotics](#safety-and-robustness-in-ml-for-robotics)
- [Implementation Considerations](#implementation-considerations)
- [Quiz](#quiz)
- [Hands-on Lab](#hands-on-lab)

## Introduction to ML in Robotics

Machine Learning (ML) in robotics applies computational methods to enable robots to acquire new skills and adapt to environments without explicit programming for every possible situation. Unlike general ML, robot learning must consider the robot's embodiment, sensorimotor capabilities, and real-time constraints.

### Role of ML in Robotics
- **Perception**: Understanding the environment from sensor data
- **Control**: Learning optimal control strategies
- **Adaptation**: Adjusting to new environments and tasks
- **Planning**: Learning to make better decisions
- **Human-Robot Interaction**: Understanding and responding to human behavior

### Key Characteristics of Robot Learning
- **Embodied Learning**: Learning is tied to physical interactions with the world
- **Real-time Requirements**: Learning and decision-making under time constraints
- **Multi-modal Data**: Integration of diverse sensor streams
- **Safety-Critical**: Learning systems must maintain operational safety
- **Sample Efficiency**: Learning quickly with minimal physical trials

### Challenges in Robot Learning
- **Reality Gap**: Discrepancy between simulation and real-world performance
- **Safety During Learning**: Ensuring safe exploration in physical environments
- **Sample Inefficiency**: Physical trials are expensive and time-consuming
- **Distribution Shift**: Environments change during deployment
- **Embodiment Constraints**: Robot's physical form affects learning process

## Supervised Learning in Robotics

### Classification for Perception
Supervised classification is fundamental for robot perception systems:

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import cv2

class ObjectClassifier:
    """Classifies objects for robotic manipulation tasks"""
    def __init__(self, model_type='random_forest'):
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        elif model_type == 'svm':
            self.model = SVC(kernel='rbf', random_state=42)
        
        self.feature_extractor = FeatureExtractor()
    
    def extract_features(self, image):
        """Extract relevant features from image for classification"""
        # Color features
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        color_features = [
            np.mean(hsv[:, :, 0]),  # Hue mean
            np.std(hsv[:, :, 0]),   # Hue std
            np.mean(hsv[:, :, 1]),  # Saturation mean
            np.std(hsv[:, :, 1]),   # Saturation std
            np.mean(hsv[:, :, 2]),  # Value mean
            np.std(hsv[:, :, 2])    # Value std
        ]
        
        # Shape features
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest_contour)
            perimeter = cv2.arcLength(largest_contour, True)
            circularity = 4 * np.pi * area / (perimeter ** 2) if perimeter > 0 else 0
        else:
            area, perimeter, circularity = 0, 0, 0
        
        shape_features = [area, perimeter, circularity]
        
        return np.concatenate([color_features, shape_features])
    
    def train(self, images, labels):
        """Train the classifier on labeled image data"""
        # Extract features from all images
        X = []
        for img in images:
            features = self.extract_features(img)
            X.append(features)
        
        X = np.array(X)
        
        # Train the model
        self.model.fit(X, labels)
    
    def predict(self, image):
        """Predict object class from image"""
        features = self.extract_features(image).reshape(1, -1)
        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        
        return {
            'class': prediction,
            'confidence': np.max(probabilities),
            'probabilities': dict(zip(self.model.classes_, probabilities))
        }

class FeatureExtractor:
    """Extracts relevant features for robotic tasks"""
    def __init__(self):
        pass
    
    def extract_visual_features(self, image):
        """Extract visual features relevant for robot perception"""
        features = {}
        
        # Texture features using Local Binary Patterns (simplified)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        features['texture_energy'] = np.mean(gray)  # Simplified texture descriptor
        
        # Edge density
        edges = cv2.Canny(gray, 50, 150)
        features['edge_density'] = np.sum(edges > 0) / edges.size
        
        # Dominant color (histogram peak)
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        features['dominant_intensity'] = np.argmax(hist)
        
        return features
    
    def extract_spatial_features(self, object_pose, robot_pose):
        """Extract spatial relationship features"""
        rel_pos = np.array(object_pose[:3]) - np.array(robot_pose[:3])
        distance = np.linalg.norm(rel_pos)
        
        return {
            'distance': distance,
            'relative_x': rel_pos[0],
            'relative_y': rel_pos[1],
            'relative_z': rel_pos[2],
            'angle_to_object': np.arctan2(rel_pos[1], rel_pos[0])
        }
```

### Regression for Motion Planning
Regression models predict continuous values for robot control:

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

class MotionRegressor:
    """Predicts robot motion parameters from environmental state"""
    def __init__(self, model_type='random_forest'):
        if model_type == 'random_forest':
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        elif model_type == 'linear':
            self.model = LinearRegression()
    
    def prepare_features(self, env_state, robot_state):
        """Prepare features for motion prediction"""
        # Robot current state
        features = [
            robot_state['linear_velocity'],
            robot_state['angular_velocity'],
            robot_state['battery_level']
        ]
        
        # Environmental features
        target_distance = env_state.get('target_distance', 0)
        obstacle_distances = env_state.get('obstacle_distances', [10.0] * 8)  # 8 directions
        features.append(target_distance)
        features.extend(obstacle_distances)
        
        # Robot capabilities
        features.append(robot_state['max_linear_vel'])
        features.append(robot_state['max_angular_vel'])
        
        return np.array(features)
    
    def predict_motion(self, env_state, robot_state):
        """Predict optimal motion parameters"""
        X = self.prepare_features(env_state, robot_state).reshape(1, -1)
        motion_params = self.model.predict(X)[0]
        
        return {
            'linear_velocity': motion_params[0],
            'angular_velocity': motion_params[1],
            'steering_angle': motion_params[2]
        }

class GraspingPosePredictor:
    """Predicts optimal grasping poses for objects"""
    def __init__(self):
        self.pose_model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.contact_points_model = RandomForestRegressor(n_estimators=50, random_state=42)
    
    def predict_grasp(self, object_properties):
        """Predict optimal grasp pose for object"""
        # Object properties: shape, size, mass, friction, etc.
        features = self.encode_object_features(object_properties)
        
        # Predict grasp pose (position and orientation)
        grasp_pose = self.pose_model.predict(features.reshape(1, -1))[0]
        
        # Predict contact points
        contact_points = self.contact_points_model.predict(features.reshape(1, -1))[0]
        
        return {
            'grasp_pose': grasp_pose,
            'contact_points': contact_points,
            'success_probability': self.estimate_success_probability(features)
        }
    
    def encode_object_features(self, obj_props):
        """Encode object properties into features"""
        # Encode object properties into numerical features
        features = []
        
        # Size features
        dimensions = obj_props.get('dimensions', [1, 1, 1])
        features.extend(dimensions)
        features.append(np.prod(dimensions))  # Volume
        
        # Shape features
        shape_type = obj_props.get('shape', 'unknown')
        shape_encoding = {
            'box': [1, 0, 0, 0],
            'cylinder': [0, 1, 0, 0],
            'sphere': [0, 0, 1, 0],
            'unknown': [0, 0, 0, 1]
        }
        features.extend(shape_encoding.get(shape_type, shape_encoding['unknown']))
        
        # Physical properties
        features.append(obj_props.get('mass', 1.0))
        features.append(obj_props.get('friction', 0.5))
        features.append(obj_props.get('fragility', 0.5))
        
        return np.array(features)
    
    def estimate_success_probability(self, features):
        """Estimate probability of successful grasp"""
        # In practice, this would be a more sophisticated model
        # based on training data of successful/failed grasps
        size = features[3]  # Volume is index 3
        fragility = features[8]  # Fragility is index 8
        
        # Larger, less fragile objects have higher success probability
        size_factor = min(size * 2, 1.0)  # Normalize
        fragility_factor = (1 - fragility)  # Lower fragility = higher success
        
        return min(size_factor * fragility_factor * 1.5, 1.0)  # Clamp to [0, 1]
```

## Unsupervised Learning Applications

### Clustering for Environment Understanding
```python
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler

class EnvironmentSegmenter:
    """Segments environment into meaningful regions using unsupervised learning"""
    def __init__(self, method='kmeans', n_clusters=5):
        self.method = method
        self.n_clusters = n_clusters
        self.scaler = StandardScaler()
        
        if method == 'kmeans':
            self.clusterer = KMeans(n_clusters=n_clusters, random_state=42)
        elif method == 'dbscan':
            self.clusterer = DBSCAN(eps=0.5, min_samples=5)
    
    def segment_environment(self, sensor_data):
        """Segment environment based on sensor data"""
        # Extract features from sensor data
        features = self.extract_environment_features(sensor_data)
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Cluster the data
        if self.method == 'kmeans':
            clusters = self.clusterer.fit_predict(features_scaled)
        elif self.method == 'dbscan':
            clusters = self.clusterer.fit_predict(features_scaled)
        
        # Map clusters back to environment locations
        segmentation = self.map_clusters_to_environment(clusters, sensor_data)
        
        return segmentation
    
    def extract_environment_features(self, sensor_data):
        """Extract features for environment segmentation"""
        features = []
        
        # Process LiDAR or depth data for obstacles
        if 'point_cloud' in sensor_data:
            points = sensor_data['point_cloud']
            for point in points:
                # Features: xyz position, density around point, surface normal
                x, y, z = point[:3]
                
                # Calculate local density (simplified)
                nearby_points = [p for p in points 
                               if np.linalg.norm(np.array(p[:3]) - np.array([x, y, z])) < 0.5]
                density = len(nearby_points)
                
                features.append([x, y, z, density])
        
        return np.array(features)
    
    def map_clusters_to_environment(self, clusters, sensor_data):
        """Map cluster labels to environmental semantic labels"""
        # Convert clustering results to meaningful environmental segments
        # e.g., floor, wall, furniture, objects, etc.
        unique_clusters = set(clusters)
        environment_map = {}
        
        for cluster_id in unique_clusters:
            if cluster_id == -1:  # DBSCAN noise points
                continue
                
            cluster_points = [i for i, c in enumerate(clusters) if c == cluster_id]
            
            # Analyze cluster properties to determine semantic meaning
            if len(cluster_points) < 10:  # Small cluster
                label = 'object'
            elif np.mean([sensor_data['point_cloud'][i][2] for i in cluster_points]) < 0.2:  # Low elevation
                label = 'floor'  
            elif np.std([sensor_data['point_cloud'][i][0] for i in cluster_points]) < 0.5:  # Narrow x-span
                label = 'wall'
            else:
                label = 'structure'
            
            environment_map[cluster_id] = label
        
        return {
            'clusters': clusters,
            'semantics': environment_map,
            'confidence': 0.8  # Placeholder confidence
        }

class BehaviorAnalyzer:
    """Analyzes robot behavior patterns using unsupervised learning"""
    def __init__(self):
        self.activity_clusterer = KMeans(n_clusters=8, random_state=42)
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
    
    def analyze_behavior(self, robot_logs):
        """Analyze robot behavior patterns"""
        # Extract behavioral features
        features = self.extract_behavioral_features(robot_logs)
        
        # Scale features
        scaled_features = self.scaler.fit_transform(features)
        
        # Detect anomalies in behavior
        anomaly_scores = self.anomaly_detector.decision_function(scaled_features)
        anomalies = self.anomaly_detector.predict(scaled_features)
        
        # Cluster to identify regular behavior patterns
        activity_patterns = self.activity_clusterer.fit_predict(scaled_features)
        
        return {
            'activity_patterns': activity_patterns,
            'anomalies': anomalies,
            'anomaly_scores': anomaly_scores,
            'pattern_counts': np.bincount(activity_patterns + 1)[1:].tolist()  # Handle -1 labels
        }
    
    def extract_behavioral_features(self, logs):
        """Extract features from robot logs for pattern analysis"""
        features = []
        
        # For each time segment in logs
        for segment in logs:
            segment_features = []
            
            # Movement statistics
            linear_velocities = [entry.get('linear_velocity', 0) for entry in segment]
            angular_velocities = [entry.get('angular_velocity', 0) for entry in segment]
            segment_features.extend([
                np.mean(linear_velocities),
                np.std(linear_velocities),
                np.mean(angular_velocities),
                np.std(angular_velocities),
                len([v for v in linear_velocities if v > 0.1]) / len(linear_velocities)  # Movement frequency
            ])
            
            # Sensor activity
            if 'sensor_readings' in segment[0] if segment else {}:
                proximity_readings = [entry['sensor_readings'].get('proximity', [1.0]) for entry in segment]
                avg_proximity = np.mean([np.min(read) for read in proximity_readings if len(read) > 0])
                segment_features.extend([
                    avg_proximity,
                    np.std([np.min(read) for read in proximity_readings if len(read) > 0])
                ])
            else:
                segment_features.extend([1.0, 0.0])  # Default values
            
            features.append(segment_features)
        
        return np.array(features)

class IsolationForest:
    """Simplified isolation forest implementation for anomaly detection"""
    def __init__(self, contamination=0.1, random_state=None):
        self.contamination = contamination
        self.random_state = random_state
        if random_state:
            np.random.seed(random_state)
    
    def fit(self, X):
        """Fit the isolation forest to data"""
        self.n_samples, self.n_features = X.shape
        return self
    
    def predict(self, X):
        """Predict anomaly labels (1 for inliers, -1 for anomalies)"""
        scores = self.decision_function(X)
        threshold = np.percentile(scores, self.contamination * 100)
        return np.where(scores < threshold, -1, 1)
    
    def decision_function(self, X):
        """Compute anomaly scores"""
        # Simplified implementation - in practice would build isolation trees
        # For now, use a statistical approach
        means = np.mean(X, axis=0)
        stds = np.std(X, axis=0) + 1e-8  # Prevent division by zero
        
        # Calculate z-scores
        z_scores = np.abs((X - means) / stds)
        # Anomaly score as mean of z-scores for each sample
        return np.mean(z_scores, axis=1)
```

## Reinforcement Learning for Robots

### Q-Learning for Navigation
```python
import numpy as np

class QLearningNavigator:
    """Simple Q-learning implementation for robot navigation"""
    def __init__(self, action_space, state_space, learning_rate=0.1, discount=0.95, epsilon=1.0):
        self.action_space = action_space  # ['forward', 'backward', 'left', 'right']
        self.state_space = state_space    # Discretized environment states
        self.learning_rate = learning_rate
        self.discount = discount
        self.epsilon = epsilon
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01
        
        # Initialize Q-table
        self.q_table = np.zeros((state_space, len(action_space)))
    
    def discretize_state(self, continuous_state):
        """Convert continuous state to discrete state index"""
        # This is a simplified approach - in practice, you'd use more sophisticated discretization
        # For example, discretizing x,y position into grid cells
        
        # Assuming continuous_state contains [x, y, theta, obstacle_distances...]
        x, y = continuous_state[0], continuous_state[1]
        
        # Discretize into 10x10 grid (0-9 for each dimension)
        grid_size = 10
        x_disc = min(int(x * grid_size / 10.0), grid_size - 1)  # Assuming 10m range
        y_disc = min(int(y * grid_size / 10.0), grid_size - 1)
        
        # Convert to single state index (assuming 10x10 grid)
        state_index = x_disc * grid_size + y_disc
        return min(state_index, self.state_space - 1)
    
    def select_action(self, state_index):
        """Epsilon-greedy action selection"""
        if np.random.random() < self.epsilon:
            # Explore: random action
            return np.random.choice(len(self.action_space))
        
        # Exploit: best known action
        return np.argmax(self.q_table[state_index])
    
    def update_q_value(self, state, action, reward, next_state):
        """Update Q-value using Bellman equation"""
        current_q = self.q_table[state, action]
        
        # Calculate maximum future reward
        max_future_q = np.max(self.q_table[next_state])
        
        # Calculate new Q-value
        new_q = (1 - self.learning_rate) * current_q + self.learning_rate * (reward + self.discount * max_future_q)
        
        # Update Q-table
        self.q_table[state, action] = new_q
    
    def train_episode(self, env):
        """Train for one episode of navigation"""
        current_state_continuous = env.reset()
        current_state_discrete = self.discretize_state(current_state_continuous)
        
        done = False
        total_reward = 0
        steps = 0
        
        while not done and steps < 1000:  # Max steps to prevent infinite loops
            # Select action
            action_index = self.select_action(current_state_discrete)
            action = self.action_space[action_index]
            
            # Execute action in environment
            next_state_continuous, reward, done, info = env.step(action)
            next_state_discrete = self.discretize_state(next_state_continuous)
            
            # Update Q-value
            self.update_q_value(current_state_discrete, action_index, reward, next_state_discrete)
            
            # Move to next state
            current_state_discrete = next_state_discrete
            total_reward += reward
            steps += 1
        
        # Decay exploration rate
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
        
        return total_reward, steps

class DeepQLearningRobot:
    """Deep Q-Learning for continuous state/action spaces"""
    def __init__(self, state_dim, action_dim, learning_rate=0.001):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.learning_rate = learning_rate
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01
        self.gamma = 0.95  # Discount factor
        self.tau = 0.005  # Target network update rate
        
        # Neural networks (simplified)
        self.q_network = self.build_network()
        self.target_network = self.build_network()
        self.update_target_network()
        
        # Replay buffer for experience replay
        self.buffer = []
        self.buffer_size = 10000
        self.batch_size = 32
    
    def build_network(self):
        """Build neural network for Q-function approximation"""
        # This is a simplified representation
        # In practice, you'd use a deep learning framework
        import tensorflow as tf
        from tensorflow import keras
        
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(self.state_dim,)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(self.action_dim, activation='linear')
        ])
        
        model.compile(optimizer=keras.optimizers.Adam(learning_rate=self.learning_rate),
                     loss='mse')
        
        return model
    
    def update_target_network(self):
        """Update target network weights (soft update)"""
        # Copy weights from main network to target network
        self.target_network.set_weights(self.q_network.get_weights())
    
    def select_action(self, state):
        """Select action using epsilon-greedy policy"""
        if np.random.random() < self.epsilon:
            return np.random.choice(self.action_dim)
        
        # Get Q-values from network
        q_values = self.q_network.predict(np.expand_dims(state, axis=0), verbose=0)
        return np.argmax(q_values[0])
    
    def remember(self, state, action, reward, next_state, done):
        """Store experience in replay buffer"""
        self.buffer.append((state, action, reward, next_state, done))
        
        # Maintain buffer size
        if len(self.buffer) > self.buffer_size:
            self.buffer.pop(0)
    
    def replay(self):
        """Experience replay training step"""
        if len(self.buffer) < self.batch_size:
            return
        
        # Sample random batch from buffer
        batch_indices = np.random.choice(len(self.buffer), self.batch_size, replace=False)
        batch = [self.buffer[i] for i in batch_indices]
        
        # Extract batch components
        states = np.array([e[0] for e in batch])
        actions = np.array([e[1] for e in batch])
        rewards = np.array([e[2] for e in batch])
        next_states = np.array([e[3] for e in batch])
        dones = np.array([e[4] for e in batch])
        
        # Get current Q values
        current_q_values = self.q_network.predict(states, verbose=0)
        
        # Get target Q values
        future_q_values = self.target_network.predict(next_states, verbose=0)
        target_q_values = current_q_values.copy()
        
        # Update target Q values for non-terminal states
        for i in range(self.batch_size):
            if dones[i]:
                target_q_values[i][actions[i]] = rewards[i]
            else:
                target_q_values[i][actions[i]] = rewards[i] + self.gamma * np.max(future_q_values[i])
        
        # Train the network
        self.q_network.fit(states, target_q_values, verbose=0, epochs=1)
        
        # Decay epsilon
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
    
    def update_epsilon(self):
        """Update exploration parameter"""
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
```

### Policy Gradient Methods
```python
class PolicyGradientAgent:
    """Policy gradient method for continuous action spaces"""
    def __init__(self, state_dim, action_dim, learning_rate=0.001):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.learning_rate = learning_rate
        
        # Actor-Critic networks (simplified)
        self.actor = self.build_actor_network()
        self.critic = self.build_critic_network()
        
        self.buffer = {'states': [], 'actions': [], 'rewards': [], 'next_states': [], 'dones': []}
    
    def build_actor_network(self):
        """Build actor network (policy)"""
        import tensorflow as tf
        from tensorflow import keras
        
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(self.state_dim,)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(self.action_dim, activation='tanh')  # Actions in [-1, 1]
        ])
        
        model.compile(optimizer=keras.optimizers.Adam(learning_rate=self.learning_rate),
                     loss='mse')
        
        return model
    
    def build_critic_network(self):
        """Build critic network (value function)"""
        import tensorflow as tf
        from tensorflow import keras
        
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(self.state_dim,)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(1, activation='linear')  # Value output
        ])
        
        model.compile(optimizer=keras.optimizers.Adam(learning_rate=self.learning_rate),
                     loss='mse')
        
        return model
    
    def select_action(self, state):
        """Select action based on current policy"""
        action_probs = self.actor.predict(np.expand_dims(state, axis=0), verbose=0)
        # For continuous actions, we might add noise or use a probability distribution
        return action_probs[0]
    
    def compute_advantage(self, rewards, values, dones, gamma=0.99, lam=0.95):
        """Compute advantage using Generalized Advantage Estimation (GAE)"""
        advantages = []
        gae = 0
        
        for i in reversed(range(len(rewards))):
            if i == len(rewards) - 1:
                next_value = 0 if dones[i] else values[i]
            else:
                next_value = values[i + 1]
            
            delta = rewards[i] + gamma * next_value * (1 - dones[i]) - values[i]
            gae = delta + gamma * lam * (1 - dones[i]) * gae
            advantages.insert(0, gae)
        
        return advantages

class RobotEnvironment:
    """Simulated robot environment for RL training"""
    def __init__(self):
        self.size = 10  # 10x10 grid world
        self.robot_pos = [0, 0]
        self.goal_pos = [8, 8]
        self.obstacles = [[2, 2], [3, 3], [4, 4], [5, 5]]
        self.max_steps = 100
    
    def reset(self):
        """Reset environment to initial state"""
        self.robot_pos = [0, 0]
        self.step_count = 0
        return self.get_state()
    
    def get_state(self):
        """Get current state vector"""
        # State: [x, y, goal_x, goal_y, obstacle_0_x, obstacle_0_y, ..., battery_level]
        state = [self.robot_pos[0], self.robot_pos[1], 
                self.goal_pos[0], self.goal_pos[1]]
        
        # Add obstacle positions (pad if fewer than expected)
        for obs in self.obstacles[:4]:  # Only first 4 obstacles
            state.extend(obs)
        # Pad with default values if less than 4 obstacles
        while len(state) < 12:  # 2 pos + 2 goal + 4*2 obs + 2 pad
            state.extend([-1, -1])  # -1 indicates no obstacle
        
        # Add step count as proxy for battery
        battery = 1.0 - (self.step_count / self.max_steps)
        state.append(battery)
        
        return np.array(state)
    
    def step(self, action):
        """Execute action and return (next_state, reward, done, info)"""
        self.step_count += 1
        
        # Convert action to movement (simplified mapping)
        # Assuming action is [0, 1, 2, 3] -> [up, down, left, right]
        if isinstance(action, (int, np.integer)):
            action_map = {0: [0, 1], 1: [0, -1], 2: [-1, 0], 3: [1, 0]}
            delta = action_map.get(action, [0, 0])
        else:
            # If action is continuous, discretize it
            if action[0] > action[1]:  # Move right vs left
                dx = 1 if action[0] > 0.5 else -1
            else:
                dx = 0
            if action[1] > action[2] if len(action) > 2 else action[1]:  # Move up vs down
                dy = 1 if action[1] > 0.5 else -1
            else:
                dy = 0
            delta = [dx, dy]
        
        # Calculate new position
        new_pos = [
            np.clip(self.robot_pos[0] + delta[0], 0, self.size - 1),
            np.clip(self.robot_pos[1] + delta[1], 0, self.size - 1)
        ]
        
        # Check if new position is obstacle
        if new_pos in self.obstacles:
            # Collision, don't move
            reward = -10
        else:
            self.robot_pos = new_pos
            
            # Calculate reward
            distance_to_goal = np.sqrt((self.goal_pos[0] - self.robot_pos[0])**2 + 
                                     (self.goal_pos[1] - self.robot_pos[1])**2)
            
            # Dense reward based on distance to goal
            reward = -distance_to_goal * 0.1  # Negative because closer is better
            
            # Bonus for getting closer to goal
            if distance_to_goal < getattr(self, '_prev_distance', float('inf')):
                reward += 0.1  # Small bonus for improving
            
            self._prev_distance = distance_to_goal
            
            # Big reward for reaching goal
            if distance_to_goal < 1.0:
                reward += 100
                done = True
            else:
                done = False
        
        # Check if max steps reached
        if self.step_count >= self.max_steps:
            done = True
            reward -= 10  # Penalty for not completing in time
        
        next_state = self.get_state()
        info = {'distance_to_goal': distance_to_goal}
        
        return next_state, reward, done, info
```

## Deep Learning for Perception

### Convolutional Neural Networks for Robot Vision
```python
import tensorflow as tf
from tensorflow import keras
import numpy as np

class PerceptionCNN:
    """CNN for robot visual perception tasks"""
    def __init__(self, input_shape, num_classes, task_type='classification'):
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.task_type = task_type
        self.model = self.build_model()
    
    def build_model(self):
        """Build CNN model based on task type"""
        model = keras.Sequential()
        
        # Shared convolutional base
        model.add(keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=self.input_shape))
        model.add(keras.layers.MaxPooling2D((2, 2)))
        model.add(keras.layers.Conv2D(64, (3, 3), activation='relu'))
        model.add(keras.layers.MaxPooling2D((2, 2)))
        model.add(keras.layers.Conv2D(64, (3, 3), activation='relu'))
        
        model.add(keras.layers.Flatten())
        model.add(keras.layers.Dense(64, activation='relu'))
        
        if self.task_type == 'classification':
            model.add(keras.layers.Dense(self.num_classes, activation='softmax'))
            model.compile(optimizer='adam',
                         loss='categorical_crossentropy',
                         metrics=['accuracy'])
        elif self.task_type == 'regression':
            model.add(keras.layers.Dense(1))  # Single output for regression
            model.compile(optimizer='adam',
                         loss='mse',
                         metrics=['mae'])
        
        return model
    
    def train(self, X_train, y_train, X_val=None, y_val=None, epochs=10, batch_size=32):
        """Train the perception model"""
        validation_data = (X_val, y_val) if X_val is not None and y_val is not None else None
        
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=validation_data,
            verbose=1
        )
        
        return history
    
    def predict(self, X):
        """Make predictions on input data"""
        return self.model.predict(X)

class ObjectDetector:
    """Object detection specialized for robotics applications"""
    def __init__(self, input_shape=(416, 416, 3)):
        self.input_shape = input_shape
        self.model = self.build_yolo_style_model()
    
    def build_yolo_style_model(self):
        """Build a YOLO-style model for real-time detection"""
        inputs = keras.Input(shape=self.input_shape)
        
        # Darknet backbone (simplified)
        x = self._conv_block(inputs, 32, 3)
        x = keras.layers.MaxPooling2D(2)(x)
        
        x = self._conv_block(x, 64, 3)
        x = keras.layers.MaxPooling2D(2)(x)
        
        x = self._conv_block(x, 128, 3)
        x = self._conv_block(x, 64, 1)
        x = self._conv_block(x, 128, 3)
        x = keras.layers.MaxPooling2D(2)(x)
        
        # Additional layers for detection head
        x = self._conv_block(x, 256, 3)
        x = self._conv_block(x, 128, 1)
        x = self._conv_block(x, 256, 3)
        
        # Detection head
        x = keras.layers.Conv2D(255, (1, 1), activation='sigmoid')(x)  # 3*(4+1+80) for 80 classes
        
        model = keras.Model(inputs, x)
        model.compile(optimizer='adam', loss=self.yolo_loss)
        
        return model
    
    def _conv_block(self, x, filters, kernel_size, strides=1):
        """Convolution block with batch normalization and activation"""
        x = keras.layers.Conv2D(filters, kernel_size, strides=strides, padding='same')(x)
        x = keras.layers.BatchNormalization()(x)
        x = keras.layers.LeakyReLU(alpha=0.1)(x)
        return x
    
    def yolo_loss(self, y_true, y_pred):
        """YOLO loss function"""
        # Simplified YOLO loss computation
        # In practice, this would be much more complex
        return tf.reduce_mean(tf.square(y_true - y_pred))
    
    def detect_objects(self, image):
        """Detect objects in image"""
        # Preprocess image
        img_processed = self.preprocess_image(image)
        
        # Run detection
        predictions = self.model.predict(img_processed)
        
        # Post-process to extract bounding boxes
        detections = self.post_process_predictions(predictions)
        
        return detections
    
    def preprocess_image(self, image):
        """Preprocess image for detection"""
        # Resize and normalize
        img_resized = tf.image.resize(image, self.input_shape[:2])
        img_normalized = img_resized / 255.0  # Normalize to [0,1]
        return tf.expand_dims(img_normalized, 0)  # Add batch dimension
    
    def post_process_predictions(self, predictions):
        """Extract final detections from model output"""
        # Decode YOLO output format
        # This is a simplified version - real implementation would be more complex
        batch_size, grid_h, grid_w, channels = predictions.shape
        num_anchors = 3
        boxes_per_cell = channels // (num_anchors * 5)  # 5 = x,y,w,h,conf + classes
        
        # In practice, you'd decode the YOLO format properly
        # For now, return a placeholder
        return [
            {'class': 'person', 'confidence': 0.92, 'bbox': [100, 100, 200, 200]},
            {'class': 'chair', 'confidence': 0.85, 'bbox': [300, 250, 400, 350]}
        ]

class SegmentationNetwork:
    """Semantic segmentation for robot navigation"""
    def __init__(self, input_shape, num_classes):
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = self.build_unet_model()
    
    def build_unet_model(self):
        """Build U-Net style segmentation model"""
        inputs = keras.Input(self.input_shape)
        
        # Contracting path
        c1 = self._conv2d_block(inputs, 64)
        p1 = keras.layers.MaxPooling2D((2, 2))(c1)
        
        c2 = self._conv2d_block(p1, 128)
        p2 = keras.layers.MaxPooling2D((2, 2))(c2)
        
        c3 = self._conv2d_block(p2, 256)
        p3 = keras.layers.MaxPooling2D((2, 2))(c3)
        
        # Bottleneck
        c4 = self._conv2d_block(p3, 512)
        
        # Expanding path
        u5 = keras.layers.UpSampling2D((2, 2))(c4)
        u5 = keras.layers.Concatenate()([u5, c3])
        c5 = self._conv2d_block(u5, 256)
        
        u6 = keras.layers.UpSampling2D((2, 2))(c5)
        u6 = keras.layers.Concatenate()([u6, c2])
        c6 = self._conv2d_block(u6, 128)
        
        u7 = keras.layers.UpSampling2D((2, 2))(c6)
        u7 = keras.layers.Concatenate()([u7, c1])
        c7 = self._conv2d_block(u7, 64)
        
        outputs = keras.layers.Conv2D(self.num_classes, (1, 1), activation='softmax')(c7)
        
        model = keras.Model(inputs, outputs)
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def _conv2d_block(self, x, n_filters, kernel_size=3, batchnorm=True):
        """Conv2d -> BatchNormalization -> Activation"""
        x = keras.layers.Conv2D(
            n_filters, 
            kernel_size, 
            padding='same', 
            activation='relu'
        )(x)
        if batchnorm:
            x = keras.layers.BatchNormalization()(x)
        return x
    
    def segment_image(self, image):
        """Segment image into semantic classes"""
        # Preprocess
        img_proc = self.preprocess_image(image)
        
        # Predict
        segmentation = self.model.predict(img_proc)
        
        # Post-process
        segmented_map = np.argmax(segmentation, axis=-1)[0]  # Remove batch dimension
        
        return segmented_map

def preprocess_robot_data(images, labels=None):
    """Preprocess robot sensor data for ML models"""
    # Normalize images
    if images.dtype == np.uint8:
        images = images.astype(np.float32) / 255.0
    
    # Handle different image formats
    if len(images.shape) == 3:  # Single grayscale image
        images = images.reshape(1, *images.shape, 1)
    elif len(images.shape) == 4 and images.shape[-1] not in [1, 3]:  # Channels not in last dim
        # Reorder if needed (some datasets have channels first)
        if images.shape[1] in [1, 3]:  # Channels first
            images = np.transpose(images, (0, 2, 3, 1))
    
    return images
```

## Imitation Learning

### Learning from Demonstration
```python
class ImitationLearningAgent:
    """Agent that learns to perform tasks by imitating demonstrations"""
    def __init__(self, state_dim, action_dim):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.demonstrations = []
        self.behavioral_clone = self.build_behavioral_cloning_model()
        self.daagger_enabled = True
        self.daagger_data = []
    
    def build_behavioral_cloning_model(self):
        """Build model for behavioral cloning"""
        model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(self.state_dim,)),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(self.action_dim, activation='tanh')  # Actions in [-1, 1]
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def add_demonstration(self, states, actions):
        """Add expert demonstration to training data"""
        for state, action in zip(states, actions):
            self.demonstrations.append((state, action))
    
    def train_behavioral_clone(self, epochs=50, batch_size=32, validation_split=0.2):
        """Train behavioral cloning model on collected demonstrations"""
        if not self.demonstrations:
            print("No demonstrations available for training")
            return
        
        # Separate states and actions
        states = np.array([demo[0] for demo in self.demonstrations])
        actions = np.array([demo[1] for demo in self.demonstrations])
        
        # Train the model
        history = self.behavioral_clone.fit(
            states, actions,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            verbose=1
        )
        
        return history
    
    def predict_action(self, state):
        """Predict action based on current state"""
        state_tensor = np.expand_dims(state, axis=0)
        action = self.behavioral_clone.predict(state_tensor, verbose=0)[0]
        return action
    
    def collect_demonstration(self, env, expert_policy):
        """Collect expert demonstration"""
        states = []
        actions = []
        
        state = env.reset()
        done = False
        
        while not done:
            states.append(state)
            
            # Get action from expert policy
            action = expert_policy(state)
            actions.append(action)
            
            # Execute action in environment
            state, reward, done, _ = env.step(action)
        
        return states, actions
    
    def dagger_algorithm(self, env, expert_policy, iterations=5):
        """Implement DAgger (Dataset Aggregation) algorithm"""
        for iteration in range(iterations):
            print(f"DAgger iteration {iteration + 1}/{iterations}")
            
            # Collect trajectories using current policy
            states, actions = self.collect_trajectory_with_current_policy(env)
            
            # Get expert actions for the same states
            expert_actions = []
            for state in states:
                expert_action = expert_policy(state)
                expert_actions.append(expert_action)
            
            # Add to training set
            for state, expert_action in zip(states, expert_actions):
                self.daagger_data.append((state, expert_action))
            
            # Retrain model on aggregated data
            if self.daagger_data:
                agg_states = np.array([x[0] for x in self.daagger_data])
                agg_actions = np.array([x[1] for x in self.daagger_data])
                
                self.behavioral_clone.fit(agg_states, agg_actions, epochs=10, verbose=0)
    
    def collect_trajectory_with_current_policy(self, env):
        """Collect trajectory using current learned policy"""
        states = []
        actions = []
        
        state = env.reset()
        done = False
        
        while not done:
            states.append(state)
            
            # Get action from current learned policy
            action = self.predict_action(state)
            actions.append(action)
            
            # Execute action in environment
            state, reward, done, info = env.step(action)
        
        return states, actions

class ExpertPolicy:
    """Example expert policy for generating demonstrations"""
    def __init__(self):
        self.navigation_model = self.train_navigation_expert()
    
    def train_navigation_expert(self):
        """Train an expert policy (in practice, this would be a human or well-tuned controller)"""
        # Placeholder for expert policy
        # This could be a MPC controller, A* planner, or human demonstrations
        return lambda state: self.optimal_navigation_action(state)
    
    def optimal_navigation_action(self, state):
        """Compute optimal navigation action"""
        # Extract state components
        robot_x = state[0]
        robot_y = state[1]
        goal_x = state[2]
        goal_y = state[3]
        
        # Compute direction to goal
        dx = goal_x - robot_x
        dy = goal_y - robot_y
        distance = np.sqrt(dx**2 + dy**2)
        
        # Normalize direction
        if distance > 0.1:  # If not close to goal
            dx /= distance
            dy /= distance
        
        # Map to action space (for a differential drive robot)
        # Convert direction to linear and angular velocities
        linear_vel = min(0.5, distance) * 0.3  # Move faster when farther
        angular_vel = np.arctan2(dy, dx) * 0.2  # Turn toward goal
        
        return np.array([linear_vel, angular_vel, 0, 0])  # Additional action dimensions if needed

class RobotKinestheticTeacher:
    """System for kinesthetic teaching of robot behaviors"""
    def __init__(self, robot_interface):
        self.robot = robot_interface
        self.demo_buffer = []
        self.teaching_mode = False
    
    def enable_kinesthetic_teaching(self):
        """Enable the robot to be moved by human demonstrator"""
        # Set robot to compliant/impedance control mode
        self.robot.set_control_mode('compliant')
        self.teaching_mode = True
        self.demo_buffer = []
        
        print("Kinesthetic teaching enabled. Move the robot to demonstrate the task.")
    
    def record_demonstration(self):
        """Record robot's current state as part of demonstration"""
        if self.teaching_mode:
            state = self.robot.get_state()
            timestamp = time.time()
            
            self.demo_buffer.append({
                'timestamp': timestamp,
                'joint_positions': state['joint_positions'],
                'joint_velocities': state['joint_velocities'],
                'end_effector_pose': state['end_effector_pose'],
                'gripper_state': state['gripper_state']
            })
    
    def disable_kinesthetic_teaching(self):
        """Disable kinesthetic teaching mode"""
        self.teaching_mode = False
        self.robot.set_control_mode('normal')
        
        print("Kinesthetic teaching disabled.")
        print(f"Recorded {len(self.demo_buffer)} demonstration steps.")
        
        return self.get_demonstration_data()
    
    def get_demonstration_data(self):
        """Get the collected demonstration data in ML-ready format"""
        if not self.demo_buffer:
            return [], []
        
        states = []
        actions = []
        
        for i, step in enumerate(self.demo_buffer):
            # Create state representation
            state = np.concatenate([
                step['joint_positions'],
                step['joint_velocities'],
                step['end_effector_pose'],
                [step['gripper_state']]
            ])
            
            # Create action (next state - current state, or direct control command)
            if i < len(self.demo_buffer) - 1:  # Not the last step
                next_step = self.demo_buffer[i + 1]
                action = next_step['joint_positions'] - step['joint_positions']
            else:
                action = np.zeros_like(step['joint_positions'])
            
            states.append(state)
            actions.append(action)
        
        return np.array(states), np.array(actions)
```

## Transfer Learning in Robotics

### Domain Randomization
```python
class DomainRandomization:
    """Technique for improving sim-to-real transfer"""
    def __init__(self, base_env):
        self.base_env = base_env
        self.randomization_params = {
            'lighting': {'range': [0.5, 2.0], 'type': 'uniform'},  # Lighting intensity
            'textures': {'options': ['wood', 'metal', 'concrete'], 'type': 'choice'},
            'object_colors': {'range': [[0,0,0], [1,1,1]], 'type': 'uniform'},  # RGB
            'physics': {'range': [0.8, 1.2], 'type': 'uniform'},  # Friction coefficients
            'sensor_noise': {'range': [0.0, 0.1], 'type': 'uniform'}  # Noise levels
        }
    
    def randomize_environment(self):
        """Randomize environment parameters"""
        randomized_env = self.base_env.copy()
        
        # Apply randomizations
        for param_name, param_spec in self.randomization_params.items():
            if param_spec['type'] == 'uniform':
                if isinstance(param_spec['range'][0], (list, tuple)):
                    # Multi-dimensional range
                    random_value = [np.random.uniform(low, high) 
                                  for low, high in zip(param_spec['range'][0], param_spec['range'][1])]
                else:
                    random_value = np.random.uniform(param_spec['range'][0], param_spec['range'][1])
            elif param_spec['type'] == 'choice':
                random_value = np.random.choice(param_spec['options'])
            else:
                random_value = None
            
            # Apply randomization to environment
            self.apply_randomization(randomized_env, param_name, random_value)
        
        return randomized_env
    
    def apply_randomization(self, env, param_name, value):
        """Apply specific randomization to environment"""
        if param_name == 'lighting':
            env.set_lighting_intensity(value)
        elif param_name == 'textures':
            env.set_surface_texture(value)
        elif param_name == 'object_colors':
            env.set_object_color(value)
        elif param_name == 'physics':
            env.set_friction_coefficient(value)
        elif param_name == 'sensor_noise':
            env.set_sensor_noise_level(value)

class SimToRealTransferAgent:
    """Agent designed to work across simulation and real environments"""
    def __init__(self, sim_model, real_model=None):
        self.sim_model = sim_model
        self.real_model = real_model or sim_model  # Initially use same model
        self.simulator = DomainRandomization(self.create_sim_env())
        self.adaptation_network = self.build_adaptation_network()
        self.domain_classifier = self.build_domain_classifier()
    
    def create_sim_env(self):
        """Create simulation environment"""
        # This would be your actual sim environment
        return RobotEnvironment()
    
    def build_adaptation_network(self):
        """Build network to adapt sim features to real features"""
        # Input: simulation features, output: adapted features
        inputs = keras.Input(shape=(256,))  # Sim feature dimension
        x = keras.layers.Dense(512, activation='relu')(inputs)
        x = keras.layers.Dense(512, activation='relu')(x)
        adapted_features = keras.layers.Dense(256, activation='linear')(x)  # Real feature dimension
        
        return keras.Model(inputs, adapted_features)
    
    def build_domain_classifier(self):
        """Build classifier to distinguish sim vs real features"""
        inputs = keras.Input(shape=(256,))  # Feature dimension
        x = keras.layers.Dense(128, activation='relu')(inputs)
        x = keras.layers.Dense(64, activation='relu')(x)
        domain_output = keras.layers.Dense(1, activation='sigmoid')(x)  # Sim (0) vs Real (1)
        
        return keras.Model(inputs, domain_output)
    
    def train_domain_adaptation(self, sim_features, real_features):
        """Train the domain adaptation network"""
        # Labels for domain classifier: 0 for sim, 1 for real
        sim_labels = np.zeros((len(sim_features), 1))
        real_labels = np.ones((len(real_features), 1))
        
        # Combine data
        all_features = np.concatenate([sim_features, real_features])
        all_labels = np.concatenate([sim_labels, real_labels])
        
        # Alternate training: domain classifier and adaptation network
        for epoch in range(100):
            # Train domain classifier
            self.domain_classifier.train_on_batch(all_features, all_labels)
            
            # Train adaptation network to confuse domain classifier (reverse gradient trick)
            # This is a simplified version - in practice, gradient reversal layer is used
            sim_adapted = self.adaptation_network.predict(sim_features)
            real_preds = self.domain_classifier.predict(real_features)
            sim_preds = self.domain_classifier.predict(sim_adapted)
            
            # Update adaptation network to make sim features look like real ones
            # This is conceptually correct but implementation would need gradient reversal
            pass
    
    def adapt_action(self, sim_action, env_state):
        """Adapt action from simulation to real environment"""
        # Apply learned corrections
        adapted_action = self.correct_for_real_world(sim_action, env_state)
        return adapted_action
    
    def correct_for_real_world(self, sim_action, env_state):
        """Apply corrections based on real-world conditions"""
        # Adjust for real-world factors:
        # - Slower movements to account for real-world delays
        # - Compensate for sensor noise
        # - Account for model inaccuracies
        
        correction_factor = self.estimate_real_world_offset(env_state)
        
        if isinstance(sim_action, np.ndarray) and len(sim_action) > 0:
            corrected_action = sim_action * correction_factor
            # Ensure action stays within real-world constraints
            max_real_action = np.array([0.5, 0.5])  # Example: max velocity limits
            corrected_action = np.clip(corrected_action, -max_real_action, max_real_action)
        else:
            corrected_action = sim_action
        
        return corrected_action
    
    def estimate_real_world_offset(self, env_state):
        """Estimate offset between sim and real"""
        # This could be learned or heuristically determined
        # For now, return a simple learned correction
        return 0.9  # Simple scaling factor
```

## Online Learning and Adaptation

### Adaptive Control
```python
class OnlineLearningAgent:
    """Robot agent that continuously learns and adapts from experience"""
    def __init__(self, state_dim, action_dim):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.model = self.build_online_model()
        self.experience_buffer = []
        self.buffer_size = 1000
        self.update_freq = 10  # Update every 10 experiences
        self.experience_count = 0
        self.performance_monitor = PerformanceTracker()
    
    def build_online_model(self):
        """Build model suitable for online learning"""
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(self.state_dim,)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(self.action_dim, activation='tanh')
        ])
        
        # Use a faster optimizer suitable for online updates
        model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001),
                     loss='mse')
        
        return model
    
    def add_experience(self, state, action, reward, next_state, done):
        """Add new experience to buffer"""
        experience = (state, action, reward, next_state, done)
        self.experience_buffer.append(experience)
        
        # Maintain buffer size
        if len(self.experience_buffer) > self.buffer_size:
            self.experience_buffer.pop(0)
        
        self.experience_count += 1
        
        # Update model periodically
        if self.experience_count % self.update_freq == 0:
            self.update_model()
    
    def update_model(self):
        """Update model with recent experiences"""
        if len(self.experience_buffer) < 10:  # Need minimum samples
            return
        
        # Use most recent experiences
        recent_experiences = self.experience_buffer[-min(100, len(self.experience_buffer)):]
        
        states = np.array([exp[0] for exp in recent_experiences])
        actions = np.array([exp[1] for exp in recent_experiences])
        
        # Update using a smaller learning rate for online updates
        self.model.fit(states, actions, epochs=1, verbose=0)
    
    def predict_adaptive_action(self, state, context_info=None):
        """Predict action with potential adaptation based on context"""
        # Get base prediction
        base_action = self.model.predict(np.expand_dims(state, axis=0), verbose=0)[0]
        
        # If context is provided, adapt the action
        if context_info:
            adapted_action = self.adapt_action_to_context(base_action, context_info, state)
        else:
            adapted_action = base_action
        
        return adapted_action
    
    def adapt_action_to_context(self, base_action, context, state):
        """Adapt action based on contextual information"""
        # Context could include environment conditions, task changes, etc.
        adaptation = np.zeros_like(base_action)
        
        # Example adaptations based on common contextual factors:
        if 'surface_type' in context:
            # Different behavior for slippery surfaces
            surface_coef = {
                'normal': 1.0,
                'slippery': 0.7,
                'rough': 1.1
            }.get(context['surface_type'], 1.0)
            adaptation = base_action * (1 - surface_coef)
        
        if 'dynamics_changed' in context and context['dynamics_changed']:
            # Adapt to changed robot dynamics
            adaptation *= 0.2  # Conservative adaptation
        
        if 'task_phase' in context:
            # Different behavior based on task phase
            if context['task_phase'] == 'approach':
                # Emphasize accuracy over speed
                adaptation = -0.1 * np.sign(base_action)  # Reduce velocity slightly
        
        return base_action + adaptation

class PerformanceTracker:
    """Track and evaluate robot learning performance"""
    def __init__(self):
        self.episode_rewards = []
        self.success_rates = []
        self.adaptation_speeds = []
        self.performance_history = []
    
    def update_performance(self, episode_reward, success, steps_to_completion):
        """Update performance metrics"""
        self.episode_rewards.append(episode_reward)
        self.success_rates.append(success)
        
        # Calculate adaptation speed (simplified)
        if len(self.episode_rewards) > 1:
            recent_improvement = episode_reward - self.episode_rewards[-2]
            self.adaptation_speeds.append(recent_improvement)
        
        # Store full episode data
        self.performance_history.append({
            'episode_reward': episode_reward,
            'success': success,
            'steps': steps_to_completion,
            'timestamp': time.time()
        })
    
    def get_performance_report(self):
        """Generate performance report"""
        if not self.performance_history:
            return "No performance data available"
        
        recent_episodes = self.performance_history[-10:]  # Last 10 episodes
        
        avg_reward = np.mean([ep['episode_reward'] for ep in recent_episodes])
        success_rate = np.mean([ep['success'] for ep in recent_episodes])
        avg_steps = np.mean([ep['steps'] for ep in recent_episodes if ep['success']])
        
        # Detect trends
        if len(self.episode_rewards) > 5:
            recent_rewards = self.episode_rewards[-5:]
            trend = "Improving" if np.polyfit(range(len(recent_rewards)), recent_rewards, 1)[0] > 0 else "Declining"
        else:
            trend = "Insufficient data"
        
        return {
            'average_reward': avg_reward,
            'success_rate': success_rate,
            'average_completion_steps': avg_steps,
            'learning_trend': trend,
            'total_episodes': len(self.performance_history)
        }
    
    def detect_performance_degradation(self):
        """Detect if performance is degrading"""
        if len(self.episode_rewards) < 10:
            return False
        
        # Compare recent performance to earlier performance
        recent_avg = np.mean(self.episode_rewards[-5:])
        earlier_avg = np.mean(self.episode_rewards[-10:-5])
        
        # Performance degradation: significant drop in rewards
        return (earlier_avg - recent_avg) / (earlier_avg + 1e-8) > 0.2  # 20% drop threshold

class AdaptiveRobotController:
    """Adaptive controller that adjusts parameters based on performance"""
    def __init__(self, base_controller):
        self.base_controller = base_controller
        self.performance_tracker = PerformanceTracker()
        self.adaptation_rules = self.define_adaptation_rules()
        self.controller_params = {
            'kp': 1.0,  # Proportional gain
            'ki': 0.1,  # Integral gain  
            'kd': 0.05, # Derivative gain
            'learning_rate': 0.01,  # For adaptation
            'exploration_rate': 0.1  # For behavior exploration
        }
    
    def define_adaptation_rules(self):
        """Define rules for controller parameter adaptation"""
        return [
            {
                'condition': lambda perf: perf['success_rate'] < 0.7,
                'action': lambda params: {**params, 'kp': min(params['kp'] * 1.1, 2.0)},
                'priority': 1
            },
            {
                'condition': lambda perf: perf['average_completion_steps'] > 100,
                'action': lambda params: {**params, 'exploration_rate': min(params['exploration_rate'] * 1.2, 0.5)},
                'priority': 2
            },
            {
                'condition': lambda perf: perf['learning_trend'] == 'Declining',
                'action': lambda params: {**params, 'learning_rate': max(params['learning_rate'] * 0.9, 0.001)},
                'priority': 0
            }
        ]
    
    def adapt_controller(self, performance_report):
        """Adapt controller parameters based on performance"""
        for rule in sorted(self.adaptation_rules, key=lambda x: x['priority'], reverse=True):
            if rule['condition'](performance_report):
                self.controller_params = rule['action'](self.controller_params)
                print(f"Adapted controller parameters: {self.controller_params}")
    
    def get_adapted_control_params(self):
        """Get current adapted control parameters"""
        return self.controller_params.copy()
```

## Learning from Demonstration

### Programming by Demonstration
```python
class ProgrammingByDemonstration:
    """System that learns robot behaviors from human demonstrations"""
    def __init__(self):
        self.task_library = {}  # Learned tasks
        self.demonstration_buffer = []
        self.grammar_learner = TaskGrammarLearner()
        self.abstraction_level = 'motion_primitive'  # 'trajectory', 'motion_primitive', 'task_goal'
    
    def start_demonstration_capture(self):
        """Start capturing human demonstration"""
        print("Starting demonstration capture...")
        self.demonstration_buffer = []
        self.is_capturing = True
    
    def capture_demonstration_step(self, robot_state, human_action):
        """Capture one step of the demonstration"""
        if self.is_capturing:
            step_data = {
                'robot_state': robot_state,
                'human_action': human_action,
                'timestamp': time.time()
            }
            self.demonstration_buffer.append(step_data)
    
    def end_demonstration_capture(self, task_name):
        """End demonstration capture and process the task"""
        self.is_capturing = False
        print(f"Captured demonstration with {len(self.demonstration_buffer)} steps")
        
        # Process the demonstration
        processed_task = self.process_demonstration(self.demonstration_buffer)
        
        # Store the learned task
        self.task_library[task_name] = processed_task
        
        print(f"Task '{task_name}' learned and stored in task library")
        return processed_task
    
    def process_demonstration(self, demonstration):
        """Process raw demonstration into reusable task"""
        # Extract task structure based on abstraction level
        if self.abstraction_level == 'trajectory':
            return self.extract_trajectory(demonstration)
        elif self.abstraction_level == 'motion_primitive':
            return self.extract_motion_primitives(demonstration)
        elif self.abstraction_level == 'task_goal':
            return self.extract_task_goals(demonstration)
    
    def extract_motion_primitives(self, demonstration):
        """Extract motion primitives from demonstration"""
        # Identify key poses and transitions
        key_poses = self.identify_key_poses(demonstration)
        transitions = self.identify_transitions(demonstration)
        
        # Create motion primitive sequence
        motion_sequence = []
        for i in range(len(transitions)):
            primitive = {
                'type': 'move_to_pose',
                'start_pose': key_poses[i]['pose'],
                'end_pose': key_poses[i+1]['pose'],
                'constraints': transitions[i]['constraints'],
                'parameters': self.extract_motion_parameters(transitions[i])
            }
            motion_sequence.append(primitive)
        
        return {
            'type': 'motion_sequence',
            'primitives': motion_sequence,
            'key_poses': key_poses,
            'learned_from_demo': True
        }
    
    def identify_key_poses(self, demonstration):
        """Identify key poses in the demonstration"""
        poses = []
        
        # For each step in the demonstration, track end-effector pose
        for step in demonstration:
            ee_pose = step['robot_state']['end_effector_pose']
            joint_angles = step['robot_state']['joint_positions']
            
            pose_info = {
                'pose': ee_pose,
                'joints': joint_angles,
                'timestamp': step['timestamp'],
                'phase': self.classify_manipulation_phase(step)  # approach, grasp, lift, place, etc.
            }
            poses.append(pose_info)
        
        # Cluster similar poses to identify key poses
        key_poses = self.cluster_poses(poses)
        return key_poses
    
    def classify_manipulation_phase(self, step):
        """Classify the manipulation phase based on gripper state and position"""
        gripper_state = step['robot_state']['gripper_state']
        ee_pose = step['robot_state']['end_effector_pose']
        
        if gripper_state == 'open' and self.near_object(ee_pose):
            return 'approach_object'
        elif gripper_state == 'closed':
            return 'grasping'
        elif gripper_state == 'open' and self.at_destination(ee_pose):
            return 'release'
        else:
            return 'transit'
    
    def near_object(self, ee_pose):
        """Check if end-effector is near an object"""
        # This would compare against known object positions
        # Placeholder implementation
        return False
    
    def at_destination(self, ee_pose):
        """Check if end-effector is at destination"""
        # This would compare against target positions
        # Placeholder implementation
        return False
    
    def cluster_poses(self, poses):
        """Cluster poses to identify key poses"""
        if not poses:
            return []
        
        # Simple clustering: identify significantly different poses
        key_poses = [poses[0]]  # Start with first pose
        
        for pose in poses[1:]:
            last_key_pose = key_poses[-1]
            
            # Calculate distance between poses
            pos_diff = np.linalg.norm(np.array(pose['pose'][:3]) - np.array(last_key_pose['pose'][:3]))
            orient_diff = np.linalg.norm(np.array(pose['pose'][3:]) - np.array(last_key_pose['pose'][3:]))
            
            # If pose is significantly different, add to key poses
            if pos_diff > 0.05 or orient_diff > 0.1:  # Thresholds
                key_poses.append(pose)
        
        return key_poses
    
    def execute_learned_task(self, task_name, task_parameters):
        """Execute a learned task with given parameters"""
        if task_name not in self.task_library:
            raise ValueError(f"Task '{task_name}' not found in library")
        
        learned_task = self.task_library[task_name]
        
        # Apply parameters to the task
        specialized_task = self.specialize_task(learned_task, task_parameters)
        
        # Execute the specialized task
        return self.executed_specialized_task(specialized_task)
    
    def specialize_task(self, learned_task, parameters):
        """Apply task-specific parameters to the learned task template"""
        # For example, adapt a "pick object" task to pick a specific object
        if learned_task['type'] == 'motion_sequence':
            specialized = {
                'primitives': learned_task['primitives'].copy(),
                'parameters': parameters
            }
            
            # Adjust poses based on parameters (object position, etc.)
            for primitive in specialized['primitives']:
                if 'object_position' in parameters:
                    # Adjust primitive to work with specific object position
                    primitive['start_pose'] = self.adjust_pose_for_object(
                        primitive['start_pose'], parameters['object_position']
                    )
                    primitive['end_pose'] = self.adjust_pose_for_object(
                        primitive['end_pose'], parameters['object_position']
                    )
            
            return specialized
        
        return learned_task

class TaskGrammarLearner:
    """Learn task structures and grammars from demonstrations"""
    def __init__(self):
        self.task_grammars = {}
        self.primitive_combinations = {}
    
    def learn_grammar_from_demonstrations(self, demonstrations):
        """Learn task grammar from multiple demonstrations of the same task"""
        # Extract common patterns across demonstrations
        patterns = self.find_common_patterns(demonstrations)
        
        # Build grammar rules
        grammar = self.build_grammar_from_patterns(patterns)
        
        return grammar
    
    def find_common_patterns(self, demonstrations):
        """Find recurring patterns across demonstrations"""
        # For each demonstration, extract the sequence of motion primitives
        primitive_sequences = []
        
        for demo in demonstrations:
            seq = self.extract_primitive_sequence(demo)
            primitive_sequences.append(seq)
        
        # Find common subsequences across all demonstrations
        common_patterns = self.find_common_subsequences(primitive_sequences)
        
        return common_patterns
    
    def extract_primitive_sequence(self, demonstration):
        """Extract motion primitive sequence from demonstration"""
        # This would implement the logic to identify motion primitives
        # from the demonstration trajectory
        return []  # Placeholder
```

## Safety and Robustness in ML for Robotics

### Safe Exploration
```python
class SafeExploration:
    """Framework for safe exploration in robot learning"""
    def __init__(self, robot, env):
        self.robot = robot
        self.env = env
        self.safety_constraints = []
        self.safe_action_space = []  # Actions proven safe
        self.uncertainty_estimator = UncertaintyEstimator()
        self.risk_assessor = RiskAssessmentModule()
    
    def add_safety_constraint(self, constraint_function, description=""):
        """Add a safety constraint function"""
        self.safety_constraints.append({
            'function': constraint_function,
            'description': description
        })
    
    def safe_action_filter(self, action, state):
        """Filter actions to ensure safety"""
        # Check if action violates any safety constraints
        for constraint in self.safety_constraints:
            if not constraint['function'](action, state):
                # Action is unsafe, find a safe alternative
                return self.find_safe_alternative(action, state)
        
        # Action is safe
        return action
    
    def find_safe_alternative(self, unsafe_action, state):
        """Find a safe alternative to an unsafe action"""
        # Project unsafe action onto safe set
        # This could involve multiple approaches:
        
        # 1. Conservative action: return safe default
        if self.is_state_safe(state):
            return self.get_default_safe_action()
        
        # 2. Optimized projection: find closest safe action
        safe_action = self.project_to_safe_set(unsafe_action, state)
        
        return safe_action
    
    def is_state_safe(self, state):
        """Check if current state is safe"""
        # Check if state is far enough from danger zones
        # Check robot health and limits
        # Check environment safety
        return True  # Placeholder
    
    def get_default_safe_action(self):
        """Get a default safe action (e.g., stop, retract)"""
        # For a mobile robot: stop all motion
        # For a manipulator: move to safe joint configuration
        return np.zeros(self.robot.action_dim)
    
    def project_to_safe_set(self, action, state):
        """Project action to nearest safe action"""
        # This would involve solving an optimization problem
        # to find the closest safe action to the desired one
        # For now, return a conservative scaled version
        safety_margin = 0.5  # Reduce action magnitude by 50%
        return action * safety_margin
    
    def uncertainty_aware_exploration(self, policy_action, state):
        """Modify exploration based on model uncertainty"""
        # Estimate uncertainty at current state
        uncertainty = self.uncertainty_estimator.estimate(state)
        
        # When uncertainty is high, be more conservative
        if uncertainty > 0.7:  # High uncertainty threshold
            # Reduce exploration
            safe_action = self.scale_action_for_uncertainty(policy_action, uncertainty)
        else:
            # Normal exploration
            safe_action = self.safe_action_filter(policy_action, state)
        
        return safe_action
    
    def scale_action_for_uncertainty(self, action, uncertainty):
        """Scale action based on uncertainty level"""
        # Higher uncertainty -> more conservative action
        safety_scale = (1 - uncertainty)  # 0.3 if uncertainty=0.7
        return action * max(safety_scale, 0.1)  # At least 10% action strength

class UncertaintyEstimator:
    """Estimate model uncertainty for safe exploration"""
    def __init__(self):
        self.ensemble_size = 5
        self.ensemble_models = []
        self.build_ensemble()
    
    def build_ensemble(self):
        """Build an ensemble of models for uncertainty estimation"""
        for i in range(self.ensemble_size):
            model = self.build_single_model()
            self.ensemble_models.append(model)
    
    def build_single_model(self):
        """Build a single model for the ensemble"""
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(10,)),  # Adjust input shape
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='linear')
        ])
        model.compile(optimizer='adam', loss='mse')
        return model
    
    def estimate(self, state):
        """Estimate uncertainty at given state"""
        # Get predictions from all models in ensemble
        predictions = []
        for model in self.ensemble_models:
            pred = model.predict(np.expand_dims(state, axis=0), verbose=0)[0]
            predictions.append(pred)
        
        # Calculate uncertainty as variance across ensemble predictions
        predictions = np.array(predictions)
        uncertainty = np.var(predictions)  # Variance as uncertainty measure
        
        # Normalize uncertainty to [0, 1]
        max_expected_variance = 1.0  # This would need to be determined empirically
        normalized_uncertainty = min(uncertainty / max_expected_variance, 1.0)
        
        return normalized_uncertainty

class RiskAssessmentModule:
    """Assess risks of robot actions for safety"""
    def __init__(self):
        self.risk_models = {}  # Different risk models for different scenarios
        self.risk_threshold = 0.8  # Maximum acceptable risk
    
    def assess_action_risk(self, action, state, context=None):
        """Assess the risk of executing an action in given state"""
        risks = {}
        
        # Collision risk
        risks['collision'] = self.assess_collision_risk(action, state)
        
        # Kinematic risk (joint limits, singularities)
        risks['kinematic'] = self.assess_kinematic_risk(action, state)
        
        # Dynamic risk (excessive forces/torques)
        risks['dynamic'] = self.assess_dynamic_risk(action, state)
        
        # Environmental risk (fragile objects, humans)
        risks['environmental'] = self.assess_environmental_risk(action, state)
        
        # Overall risk score
        weights = {'collision': 0.4, 'kinematic': 0.2, 'dynamic': 0.2, 'environmental': 0.2}
        overall_risk = sum(risks[key] * weights[key] for key in risks)
        
        return {
            'individual_risks': risks,
            'overall_risk': overall_risk,
            'acceptable': overall_risk <= self.risk_threshold,
            'suggested_modifications': self.suggest_risk_reduction(action, risks)
        }
    
    def assess_collision_risk(self, action, state):
        """Assess collision risk"""
        # Simulate action to see if it leads to collision
        # This would require access to collision checking system
        return 0.1  # Placeholder
    
    def assess_kinematic_risk(self, action, state):
        """Assess kinematic risk"""
        # Check if action drives joints toward limits or singularities
        return 0.05  # Placeholder
    
    def assess_dynamic_risk(self, action, state):
        """Assess dynamic risk"""
        # Check if action requires excessive forces/torques
        return 0.15  # Placeholder
    
    def assess_environmental_risk(self, action, state):
        """Assess environmental risk"""
        # Check for risks to environment (humans, objects)
        return 0.1  # Placeholder
    
    def suggest_risk_reduction(self, action, risks):
        """Suggest modifications to reduce risks"""
        suggestions = []
        
        if risks['collision'] > 0.5:
            suggestions.append({'type': 'modify_trajectory', 'reason': 'collision risk'})
        
        if risks['kinematic'] > 0.5:
            suggestions.append({'type': 'reduce_speed', 'reason': 'kinematic risk'})
        
        if risks['dynamic'] > 0.5:
            suggestions.append({'type': 'reduce_force', 'reason': 'dynamic risk'})
        
        return suggestions

class RobustControlSystem:
    """Control system designed for robustness and reliability"""
    def __init__(self, robot_model):
        self.robot = robot_model
        self.nominal_controller = PDController()
        self.robutness_module = RobustnessEnhancer()
        self.fault_detector = FaultDetectionSystem()
        self.backup_controllers = []
        self.current_controller = 'nominal'
    
    def compute_robust_control(self, state, reference, disturbances=None):
        """Compute robust control action"""
        # Check if system is operating normally
        fault_status = self.fault_detector.check_system_status(state)
        
        if fault_status['fault_detected']:
            # Switch to backup/fault-tolerant controller
            control_action = self.execute_backup_control(state, reference, fault_status)
        else:
            # Normal robust control
            control_action = self.nominal_controller.compute(state, reference)
            
            # Enhance robustness
            control_action = self.robutness_module.enhance_robustness(
                control_action, state, disturbances
            )
        
        return control_action
    
    def execute_backup_control(self, state, reference, fault_status):
        """Execute backup control in case of faults"""
        # Select appropriate backup controller based on fault type
        if 'actuator_fault' in fault_status['fault_types']:
            return self.backup_controllers['actuator_backup'].compute(state, reference)
        elif 'sensor_fault' in fault_status['fault_types']:
            return self.backup_controllers['sensor_backup'].compute(state, reference)
        else:
            # Default safe mode: move to safe pose slowly
            return self.get_safe_mode_action(state)

class PDController:
    """Simple PD controller as nominal controller"""
    def __init__(self, kp=1.0, kd=0.1):
        self.kp = kp  # Proportional gain
        self.kd = kd  # Derivative gain
    
    def compute(self, state, reference):
        """Compute control action using PD law"""
        error = reference - state
        control = self.kp * error + self.kd * (-state)  # Assuming state is velocity for second term
        return control

class RobustnessEnhancer:
    """Add robustness enhancements to control"""
    def __init__(self):
        self.sliding_surface_gain = 1.0
        self.uncertainty_compensation = 0.1
    
    def enhance_robustness(self, control_action, state, disturbances):
        """Enhance control for robustness"""
        # Add robustness terms
        robust_enhancement = self.compute_robust_enhancement(state, disturbances)
        
        enhanced_control = control_action + robust_enhancement
        
        return enhanced_control
    
    def compute_robust_enhancement(self, state, disturbances):
        """Compute robustness enhancement terms"""
        # Sliding mode control term for robustness to uncertainties
        sliding_term = -self.sliding_surface_gain * np.sign(state) if state != 0 else 0
        
        # Uncertainty compensation
        if disturbances is not None:
            uncertainty_term = -self.uncertainty_compensation * disturbances
        else:
            uncertainty_term = 0
        
        return sliding_term + uncertainty_term

class FaultDetectionSystem:
    """Detect system faults for robust control"""
    def __init__(self):
        self.residual_thresholds = {
            'position': 0.1,
            'velocity': 0.5,
            'torque': 10.0
        }
        self.residual_history = []
    
    def check_system_status(self, state):
        """Check if system is operating normally"""
        residuals = self.compute_residuals(state)
        fault_detected = False
        fault_types = []
        
        for res_type, value in residuals.items():
            if abs(value) > self.residual_thresholds.get(res_type, 1.0):
                fault_detected = True
                fault_types.append(f"{res_type}_fault")
        
        self.residual_history.append({
            'residuals': residuals,
            'timestamp': time.time()
        })
        
        # Keep history bounded
        if len(self.residual_history) > 100:
            self.residual_history = self.residual_history[-100:]
        
        return {
            'fault_detected': fault_detected,
            'fault_types': fault_types,
            'residuals': residuals
        }
    
    def compute_residuals(self, state):
        """Compute system residuals for fault detection"""
        # In practice, this would compare expected vs actual behavior
        # Here's a simplified example:
        return {
            'position': 0.05,  # Placeholder
            'velocity': 0.02,  # Placeholder
            'torque': 0.5     # Placeholder
        }
```

## Implementation Considerations

### Real-time Learning Constraints
```python
class RealTimeLearningConstraints:
    """Handle constraints for real-time learning in robot systems"""
    def __init__(self):
        self.max_compute_time = 0.01  # 10ms for real-time control
        self.min_safety_checks_per_second = 100  # 100Hz safety monitoring
        self.data_buffer_size = 1000  # Maximum buffered data
        self.learning_rate_schedule = self.define_learning_schedule()
    
    def define_learning_schedule(self):
        """Define appropriate learning rates for real-time operation"""
        return {
            'online_learning': 0.001,  # Very slow online updates
            'batch_learning': 0.1,     # Faster learning during breaks
            'safety_adjustment': 0.01  # Moderate safety parameter updates
        }
    
    def time_bounded_learning_step(self, model, data_batch, max_time):
        """Execute learning step with time constraint"""
        start_time = time.time()
        
        # Perform learning step (with possible early stopping)
        try:
            model.train_on_batch(data_batch[0], data_batch[1])
        except Exception as e:
            print(f"Learning interrupted: {e}")
        
        elapsed_time = time.time() - start_time
        
        if elapsed_time > max_time:
            print(f"Warning: Learning exceeded time budget by {elapsed_time - max_time:.3f}s")
        
        return min(elapsed_time, max_time)
    
    def adaptive_learning_rate(self, current_performance, target_performance):
        """Adjust learning rate based on current vs target performance"""
        performance_gap = target_performance - current_performance
        
        if performance_gap > 0.3:  # Significant room for improvement
            return self.learning_rate_schedule['batch_learning']
        elif performance_gap > 0.1:  # Moderate improvement needed
            return self.learning_rate_schedule['online_learning']
        else:  # Near target, very slow updates
            return self.learning_rate_schedule['safety_adjustment'] * 0.5

def optimize_robot_ml_pipeline():
    """Optimization strategies for ML in robotics"""
    optimizations = {
        'model_optimization': {
            'quantization': 'Reduce model precision from FP32 to INT8 for efficiency',
            'pruning': 'Remove redundant network connections to reduce compute',
            'knowledge_distillation': 'Train smaller student models to mimic large teachers',
            'neural_architecture_search': 'Automatically design efficient model architectures'
        },
        'hardware_optimization': {
            'edge_computing': 'Deploy models on robot with specialized AI chips (Jetson, Coral)',
            'model_partitioning': 'Split heavy models across edge and cloud',
            'sensor_fusion': 'Combine data from multiple sensors efficiently'
        },
        'algorithmic_optimization': {
            'experience_replay': 'Re-use past experiences to improve sample efficiency', 
            'curriculum_learning': 'Start with simple tasks and increase difficulty',
            'meta_learning': 'Learn to learn quickly across different tasks'
        },
        'safety_optimization': {
            'formal_verification': 'Mathematically prove safety properties of learned behaviors',
            'run_time_assurance': 'Monitor and intervene in learned behaviors',
            'shield_generation': 'Generate safety shields for learned controllers'
        }
    }
    
    return optimizations
```

## Quiz

1. What is the key difference between supervised learning and reinforcement learning in robotics?
2. Explain how experience replay improves sample efficiency in deep reinforcement learning for robots.
3. What are the main challenges in applying domain randomization for sim-to-real transfer?
4. Describe the role of uncertainty estimation in safe robot exploration.
5. How does programming by demonstration differ from traditional robot programming approaches?

## Hands-on Lab

### Lab: Implementing ML for Robotic Manipulation
- Create a simulated robotic arm environment
- Implement a CNN for object detection in robot workspace
- Train a reinforcement learning agent for pick-and-place tasks
- Implement imitation learning to replicate human demonstrations
- Apply domain randomization to improve sim-to-real transfer
- Evaluate the learned policies in terms of success rate, efficiency, and safety

### Objectives:
- Implement supervised learning for robot perception
- Apply reinforcement learning for robot control tasks
- Use imitation learning for skill acquisition
- Implement domain randomization techniques
- Evaluate ML models for robotics applications
- Consider safety and robustness in learned behaviors