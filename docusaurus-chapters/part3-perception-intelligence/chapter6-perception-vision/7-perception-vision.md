---
title: "Perception & Vision"
sidebar_position: 7
---

# Perception & Vision

## Table of Contents
- [Introduction to Perception & Vision in Robotics](#introduction-to-perception--vision-in-robotics)
- [Vision Systems and Camera Models](#vision-systems-and-camera-models)
- [Image Processing and Analysis](#image-processing-and-analysis)
- [Object Detection and Recognition](#object-detection-and-recognition)
- [Sensor Fusion Fundamentals](#sensor-fusion-fundamentals)
- [Types of Sensors in Perception](#types-of-sensors-in-perception)
- [Fusion Techniques and Filtering](#fusion-techniques-and-filtering)
- [Multi-Sensor Integration](#multi-sensor-integration)
- [Visual SLAM](#visual-slam)
- [Deep Learning in Perception](#deep-learning-in-perception)
- [Applications in Robotics](#applications-in-robotics)
- [Quiz](#quiz)
- [Hands-on Lab](#hands-on-lab)

## Introduction to Perception & Vision in Robotics

Perception and vision are fundamental capabilities for autonomous robots, enabling them to understand and interact with their environment. These systems allow robots to identify objects, navigate spaces, recognize patterns, and make decisions based on sensory input.

### Importance of Perception in Robotics
Perception systems provide robots with the ability to:
- Sense and interpret the environment
- Navigate through complex spaces
- Identify and manipulate objects
- Interact safely with humans and other robots
- Make informed decisions based on sensory data

### Perception Challenges in Robotics
- **Real-time processing**: Need for fast, efficient algorithms
- **Environmental variability**: Changes in lighting, weather, and scene composition
- **Sensor limitations**: Noise, limited range, field of view constraints
- **Integration complexity**: Combining multiple sensor modalities
- **Uncertainty management**: Operating with incomplete and noisy information

### Perception vs. Computer Vision
While computer vision specifically refers to extracting information from visual data (images and video), perception in robotics encompasses:
- Computer vision techniques
- Integration with other sensor modalities (LiDAR, radar, IMU)
- Sensor fusion to improve reliability and accuracy
- Interpretation of sensor data in the context of robot tasks

## Vision Systems and Camera Models

### Image Formation
Understanding how images are formed is crucial for computer vision:

```python
import numpy as np
import cv2

class CameraModel:
    def __init__(self, fx, fy, cx, cy, k1=0, k2=0, p1=0, p2=0):
        """
        Initialize camera model with intrinsic parameters
        
        Args:
            fx, fy: Focal lengths in x and y directions
            cx, cy: Principal point coordinates
            k1, k2: Radial distortion coefficients
            p1, p2: Tangential distortion coefficients
        """
        self.K = np.array([
            [fx, 0, cx],
            [0, fy, cy],
            [0, 0, 1]
        ])
        self.distortion = np.array([k1, k2, p1, p2])
    
    def project_3d_to_2d(self, points_3d):
        """
        Project 3D points to 2D image coordinates
        """
        # Normalize by focal length and principal point
        points_2d = points_3d[:, :2] / points_3d[:, 2:3]  # Divide x, y by z
        
        # Apply distortion
        points_2d_distorted = self._apply_distortion(points_2d)
        
        # Apply intrinsic matrix
        points_2d_homogeneous = np.hstack([points_2d_distorted, np.ones((len(points_2d_distorted), 1))])
        image_points = (self.K @ points_2d_homogeneous.T).T
        
        return image_points[:, :2]  # Return x, y coordinates
    
    def _apply_distortion(self, points_2d):
        """Apply radial and tangential distortion to 2D points"""
        if not np.any(self.distortion):
            return points_2d
        
        x, y = points_2d[:, 0], points_2d[:, 1]
        
        r_squared = x**2 + y**2
        radial_distortion = 1 + self.distortion[0]*r_squared + self.distortion[1]*r_squared**2
        tangential_distortion_x = 2*self.distortion[2]*x*y + self.distortion[3]*(r_squared + 2*x**2)
        tangential_distortion_y = self.distortion[2]*(r_squared + 2*y**2) + 2*self.distortion[3]*x*y
        
        x_corrected = x*radial_distortion + tangential_distortion_x
        y_corrected = y*radial_distortion + tangential_distortion_y
        
        return np.column_stack([x_corrected, y_corrected])
```

### Camera Calibration
Determining camera parameters for accurate measurements:

```python
def calibrate_camera_from_checkerboard(images, pattern_size):
    """
    Calibrate camera using checkerboard pattern
    
    Args:
        images: List of images containing checkerboard
        pattern_size: Tuple (columns, rows) of checkerboard corners
    
    Returns:
        ret: Calibration success (bool)
        mtx: Camera matrix
        dist: Distortion coefficients
        rvecs: Rotation vectors
        tvecs: Translation vectors
    """
    # Prepare object points (3D coordinates of checkerboard corners)
    objp = np.zeros((pattern_size[0] * pattern_size[1], 3), np.float32)
    objp[:, :2] = np.mgrid[0:pattern_size[0], 0:pattern_size[1]].T.reshape(-1, 2)
    
    # Arrays to store object points and image points
    objpoints = []  # 3D points in real world space
    imgpoints = []  # 2D points in image plane
    
    for img in images:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Find checkerboard corners
        ret, corners = cv2.findChessboardCorners(gray, pattern_size, None)
        
        if ret:
            objpoints.append(objp)
            imgpoints.append(corners)
    
    if len(objpoints) > 0:
        # Calibrate camera
        ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(
            objpoints, imgpoints, gray.shape[::-1], None, None
        )
        return ret, mtx, dist, rvecs, tvecs
    
    return False, None, None, None, None

def undistort_image(img, camera_matrix, distortion_coeffs):
    """Remove distortion from image"""
    h, w = img.shape[:2]
    new_camera_mtx, roi = cv2.getOptimalNewCameraMatrix(camera_matrix, distortion_coeffs, (w,h), 1, (w,h))
    undistorted = cv2.undistort(img, camera_matrix, distortion_coeffs, None, new_camera_mtx)
    
    # Crop image if needed
    x, y, w, h = roi
    undistorted = undistorted[y:y+h, x:x+w]
    
    return undistorted
```

## Image Processing and Analysis

### Basic Image Processing Operations

```python
def apply_image_filters(img):
    """Apply various image processing filters"""
    # Convert to grayscale if needed
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()
    
    # Gaussian blur for noise reduction
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Threshold for binary image
    _, binary = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
    
    # Morphological operations
    kernel = np.ones((5,5), np.uint8)
    opening = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)  # Remove noise
    closing = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)  # Close gaps
    
    return {
        'original': img,
        'grayscale': gray,
        'blurred': blurred,
        'binary': binary,
        'opening': opening,
        'closing': closing
    }

def detect_edges(img, method='canny'):
    """Detect edges in image using various methods"""
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()
    
    if method == 'canny':
        # Canny edge detection
        edges = cv2.Canny(gray, 50, 150)
    elif method == 'sobel':
        # Sobel edge detection
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        edges = np.sqrt(grad_x**2 + grad_y**2)
    elif method == 'laplacian':
        # Laplacian edge detection
        edges = cv2.Laplacian(gray, cv2.CV_64F)
    
    return edges

def enhance_image_contrast(img):
    """Enhance image contrast using histogram equalization"""
    if len(img.shape) == 3:
        # For color images, convert to YUV and equalize only the Y channel
        yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
        yuv[:,:,0] = cv2.equalizeHist(yuv[:,:,0])
        enhanced = cv2.cvtColor(yuv, cv2.COLOR_YUV2BGR)
    else:
        # For grayscale images
        enhanced = cv2.equalizeHist(img)
    
    return enhanced
```

### Feature Detection and Description

```python
def detect_features(img, method='orb'):
    """Detect and compute features using various methods"""
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()
    
    if method == 'sift':
        # SIFT detector (may require special installation)
        detector = cv2.SIFT_create()
    elif method == 'orb':
        # ORB detector
        detector = cv2.ORB_create()
    elif method == 'fast':
        # FAST corner detector
        detector = cv2.FastFeatureDetector_create()
    else:
        raise ValueError("Method must be 'sift', 'orb', or 'fast'")
    
    # Detect keypoints
    keypoints = detector.detect(gray, None)
    
    # Compute descriptors
    keypoints, descriptors = detector.compute(gray, keypoints)
    
    return keypoints, descriptors

def match_features(desc1, desc2, method='bf'):
    """Match features between two images"""
    if method == 'bf':
        # Brute force matcher
        matcher = cv2.BFMatcher()
        matches = matcher.match(desc1, desc2)
    elif method == 'flann':
        # FLANN matcher
        FLANN_INDEX_KDTREE = 1
        index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
        search_params = dict(checks=50)
        matcher = cv2.FlannBasedMatcher(index_params, search_params)
        matches = matcher.knnMatch(desc1, desc2, k=2)
        # Apply Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m1, m2 = match_pair
                if m1.distance < 0.7 * m2.distance:
                    good_matches.append(m1)
        matches = good_matches
    
    # Sort matches by distance
    matches = sorted(matches, key=lambda x: x.distance)
    
    return matches
```

## Object Detection and Recognition

### Traditional Object Detection

```python
def detect_objects_template_matching(img, template, threshold=0.7):
    """Detect objects using template matching"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
    template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY) if len(template.shape) == 3 else template
    
    # Perform template matching
    result = cv2.matchTemplate(gray, template_gray, cv2.TM_CCOEFF_NORMED)
    
    # Find locations where matching exceeds threshold
    locations = np.where(result >= threshold)
    
    # Group nearby detections
    detections = []
    for pt in zip(*locations[::-1]):
        detections.append((pt[0], pt[1], pt[0] + template_gray.shape[1], pt[1] + template_gray.shape[0]))
    
    # Apply non-maximum suppression to remove overlapping detections
    detections = apply_non_max_suppression(detections, 0.4)
    
    return detections

def apply_non_max_suppression(boxes, overlap_threshold=0.4):
    """Apply non-maximum suppression to remove overlapping bounding boxes"""
    if len(boxes) == 0:
        return []
    
    # Convert to numpy array
    boxes = np.array(boxes)
    
    # Calculate areas
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]
    areas = (x2 - x1 + 1) * (y2 - y1 + 1)
    
    # Sort by confidence/probability (last column)
    indices = np.argsort([box[4] if len(box) > 4 else areas[i] for i, box in enumerate(boxes)])
    
    pick = []
    while len(indices) > 0:
        # Pick the last box (highest confidence)
        current = indices[-1]
        pick.append(current)
        
        if len(indices) == 1:
            break
        
        # Compute IoU with remaining boxes
        xx1 = np.maximum(x1[current], x1[indices[:-1]])
        yy1 = np.maximum(y1[current], y1[indices[:-1]])
        xx2 = np.minimum(x2[current], x2[indices[:-1]])
        yy2 = np.minimum(y2[current], y2[indices[:-1]])
        
        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)
        
        intersection = w * h
        union = areas[current] + areas[indices[:-1]] - intersection
        iou = intersection / union
        
        # Keep indices with IoU less than threshold
        indices = indices[np.where(iou < overlap_threshold)[0]]
    
    return boxes[pick].astype("int")

class SimpleObjectDetector:
    """A simple object detector using HOG features and SVM classifier"""
    def __init__(self):
        self.hog = cv2.HOGDescriptor()
        self.svm = cv2.ml.SVM_create()
        self.is_trained = False
    
    def extract_hog_features(self, img):
        """Extract HOG features from image"""
        resized = cv2.resize(img, (64, 128))  # Standard HOG window size
        features = self.hog.compute(resized)
        return features.flatten()
    
    def train(self, pos_images, neg_images):
        """Train the SVM classifier"""
        # Extract HOG features
        pos_features = [self.extract_hog_features(img) for img in pos_images]
        neg_features = [self.extract_hog_features(img) for img in neg_images]
        
        # Combine features and labels
        features = np.vstack([pos_features, neg_features])
        labels = np.hstack([np.ones(len(pos_features)), np.zeros(len(neg_features))])
        
        # Train SVM
        self.svm.train(features.astype(np.float32), cv2.ml.ROW_SAMPLE, labels.astype(np.int32))
        self.is_trained = True
    
    def predict(self, img):
        """Predict if image contains the object"""
        if not self.is_trained:
            raise ValueError("Detector must be trained first")
        
        features = self.extract_hog_features(img)
        _, result = self.svm.predict(features.reshape(1, -1).astype(np.float32))
        return result[0, 0] == 1.0  # Return boolean
```

## Sensor Fusion Fundamentals

### Understanding Sensor Fusion

Sensor fusion combines data from multiple sensors to achieve better accuracy, reliability, and robustness than could be achieved by using any single sensor alone. In robotics, sensor fusion is critical for accurate perception, localization, mapping, and decision-making.

```python
class SensorFusion:
    """A basic sensor fusion framework"""
    def __init__(self):
        self.sensors = {}
        self.fusion_method = None
        self.state = np.zeros(0)
        self.covariance = np.zeros((0, 0))
    
    def add_sensor(self, name, measurement_model, noise_covariance):
        """Add a sensor to the fusion system"""
        self.sensors[name] = {
            'model': measurement_model,
            'R': noise_covariance,  # Measurement noise covariance
            'last_measurement': None,
            'timestamp': None
        }
    
    def update(self, measurements, dt):
        """Update state estimate with new measurements"""
        # This is a simplified implementation
        # In practice, you'd use proper filtering techniques
        if self.fusion_method == 'kalman':
            return self._kalman_update(measurements, dt)
        elif self.fusion_method == 'bayesian':
            return self._bayesian_update(measurements, dt)
        else:
            return self._simple_average_update(measurements)
    
    def _simple_average_update(self, measurements):
        """Simple weighted average fusion"""
        # For demonstration purposes, we'll just average position measurements
        valid_measurements = []
        weights = []
        
        for sensor_name, obs in measurements.items():
            if sensor_name in self.sensors and obs is not None:
                # Weight by inverse of noise covariance
                R = self.sensors[sensor_name]['R']
                weight = np.linalg.inv(R) if np.linalg.det(R) != 0 else np.eye(len(obs))
                weights.append(weight)
                valid_measurements.append(obs)
        
        if not valid_measurements:
            return self.state
        
        # Compute weighted average
        weights = np.array(weights)
        measurements = np.array(valid_measurements)
        
        # For simplicity, just return the average
        fused_estimate = np.mean(measurements, axis=0)
        return fused_estimate

def sensor_characteristics():
    """Compare key characteristics of different sensors"""
    sensors = {
        'Camera': {
            'modality': 'Visual',
            'precision': 'High',
            'accuracy': 'Medium',
            'range': 'Medium',
            'update_rate': 'High',
            'power': 'Medium',
            'challenges': ['Lighting', 'Occlusions']
        },
        'LiDAR': {
            'modality': 'Range',
            'precision': 'Very High',
            'accuracy': 'High',
            'range': 'Long',
            'update_rate': 'Medium',
            'power': 'High',
            'challenges': ['Cost', 'Weather']
        },
        'Radar': {
            'modality': 'Range',
            'precision': 'Medium',
            'accuracy': 'Medium',
            'range': 'Very Long',
            'update_rate': 'High',
            'power': 'High',
            'challenges': ['Resolution', 'Interpretation']
        },
        'IMU': {
            'modality': 'Inertial',
            'precision': 'High',
            'accuracy': 'Low (drifts)',
            'range': 'N/A',
            'update_rate': 'Very High',
            'power': 'Very Low',
            'challenges': ['Drift', 'Bias']
        }
    }
    return sensors
```

## Types of Sensors in Perception

### Visual Sensors

```python
class CameraSensor:
    """Abstract class for camera sensors"""
    def __init__(self, name, resolution, fov, min_range, max_range):
        self.name = name
        self.resolution = resolution  # (width, height)
        self.fov = fov  # Field of view in degrees
        self.min_range = min_range
        self.max_range = max_range
        self.calibration = None
    
    def capture_image(self):
        """Capture an image - to be implemented by subclasses"""
        pass
    
    def get_intrinsics(self):
        """Return camera intrinsic parameters"""
        if self.calibration:
            return self.calibration['intrinsics']
        return None

class RGBDCamera(CameraSensor):
    """RGB-D camera that provides both color and depth information"""
    def __init__(self, name, resolution, fov, min_range, max_range, depth_accuracy):
        super().__init__(name, resolution, fov, min_range, max_range)
        self.depth_accuracy = depth_accuracy  # Accuracy in meters
    
    def capture_rgbd(self):
        """Capture RGB and depth images"""
        # This would interface with actual camera hardware
        rgb_image = np.random.randint(0, 255, (*self.resolution[::-1], 3), dtype=np.uint8)
        depth_image = np.random.uniform(self.min_range, self.max_range, self.resolution[::-1]).astype(np.float32)
        return rgb_image, depth_image
```

### Range Sensors

```python
class RangeSensor:
    """Abstract class for range sensors"""
    def __init__(self, name, max_range, accuracy, fov):
        self.name = name
        self.max_range = max_range
        self.accuracy = accuracy  # Measurement accuracy
        self.fov = fov  # Field of view
    
    def get_range(self, direction):
        """Get range measurement in specific direction"""
        pass

class LiDARSensor(RangeSensor):
    """LiDAR sensor model"""
    def __init__(self, name, max_range, accuracy, fov, num_beams=64, rpm=600):
        super().__init__(name, max_range, accuracy, fov)
        self.num_beams = num_beams  # Number of laser beams
        self.rpm = rpm  # Revolutions per minute
    
    def capture_scan(self):
        """Capture a 2D or 3D LiDAR scan"""
        # Simulate a 2D scan (for simplicity)
        angles = np.linspace(0, 2*np.pi, self.num_beams, endpoint=False)
        distances = np.random.uniform(0.1, self.max_range, self.num_beams)
        
        return {
            'angles': angles,
            'distances': distances,
            'timestamp': np.datetime64('now')
        }
```

### Inertial Sensors

```python
class IMUSensor:
    """Inertial measurement unit sensor"""
    def __init__(self, name, acc_range, gyro_range, sampling_rate):
        self.name = name
        self.acc_range = acc_range  # Accelerometer range (±g)
        self.gyro_range = gyro_range  # Gyroscope range (±dps)
        self.sampling_rate = sampling_rate  # Hz
    
    def read_imu(self):
        """Read accelerometer and gyroscope data"""
        # Simulated readings with some noise
        acc = np.random.normal(0, 0.01, 3)  # Accelerometer readings (x, y, z)
        gyro = np.random.normal(0, 0.001, 3)  # Gyroscope readings (x, y, z)
        
        return {
            'acceleration': acc,
            'angular_velocity': gyro,
            'timestamp': np.datetime64('now')
        }
```

## Fusion Techniques and Filtering

### Kalman Filtering

```python
class KalmanFilter:
    """Implementation of Kalman Filter for state estimation"""
    def __init__(self, state_dim, obs_dim):
        self.state_dim = state_dim  # Dimension of state vector
        self.obs_dim = obs_dim     # Dimension of observation vector
        
        # State vector [position, velocity] for 1D example
        self.x = np.zeros(state_dim)  # State estimate
        self.P = np.eye(state_dim)    # Error covariance matrix
        
        # Process and measurement noise
        self.Q = np.eye(state_dim) * 0.1  # Process noise covariance
        self.R = np.eye(obs_dim) * 0.1   # Measurement noise covariance
        
        # Default motion model (constant velocity)
        dt = 1.0
        self.F = np.array([
            [1, dt],
            [0, 1]
        ])  # State transition model
        
        self.H = np.array([[1, 0]])  # Observation model
    
    def predict(self):
        """Prediction step"""
        # Predict state
        self.x = self.F @ self.x
        
        # Predict error covariance
        self.P = self.F @ self.P @ self.F.T + self.Q
    
    def update(self, z):
        """Update step with measurement z"""
        # Innovation (measurement residual)
        y = z - self.H @ self.x
        
        # Innovation covariance
        S = self.H @ self.P @ self.H.T + self.R
        
        # Kalman gain
        K = self.P @ self.H.T @ np.linalg.inv(S)
        
        # Update state estimate
        self.x = self.x + K @ y
        
        # Update error covariance
        I = np.eye(len(self.x))
        self.P = (I - K @ self.H) @ self.P
    
    def get_state(self):
        """Get current state estimate"""
        return self.x.copy()

class ExtendedKalmanFilter(KalmanFilter):
    """Extended Kalman Filter for nonlinear systems"""
    def __init__(self, state_dim, obs_dim):
        super().__init__(state_dim, obs_dim)
        
        # Nonlinear functions (to be defined by user)
        self.motion_model = None
        self.observation_model = None
    
    def set_motion_model(self, f, F_jacobian):
        """Set the nonlinear motion model and its Jacobian"""
        self.motion_model = f
        self.motion_jacobian = F_jacobian
    
    def set_observation_model(self, h, H_jacobian):
        """Set the nonlinear observation model and its Jacobian"""
        self.observation_model = h
        self.observation_jacobian = H_jacobian
    
    def predict(self):
        """Nonlinear prediction step"""
        if self.motion_model:
            # Predict state using nonlinear model
            self.x = self.motion_model(self.x)
            
            # Linearize motion model around current state
            F = self.motion_jacobian(self.x)
            
            # Predict error covariance using linearized model
            self.P = F @ self.P @ F.T + self.Q
    
    def update(self, z):
        """Nonlinear update step"""
        if self.observation_model:
            # Calculate innovation using nonlinear observation model
            h_x = self.observation_model(self.x)
            y = z - h_x
            
            # Linearize observation model around current state
            H = self.observation_jacobian(self.x)
            
            # Innovation covariance
            S = H @ self.P @ H.T + self.R
            
            # Kalman gain
            K = self.P @ H.T @ np.linalg.inv(S)
            
            # Update state estimate
            self.x = self.x + K @ y
            
            # Update error covariance
            I = np.eye(len(self.x))
            self.P = (I - K @ H) @ self.P
```

### Particle Filtering

```python
class ParticleFilter:
    """Implementation of Particle Filter for nonlinear/non-Gaussian systems"""
    def __init__(self, state_dim, num_particles=1000):
        self.state_dim = state_dim
        self.num_particles = num_particles
        
        # Initialize particles randomly
        self.particles = np.random.uniform(-1, 1, (num_particles, state_dim))
        self.weights = np.ones(num_particles) / num_particles
        
        # Motion and observation models
        self.motion_model = None
        self.observation_model = None
        self.observation_likelihood = None
    
    def set_models(self, motion_fn, obs_fn, likelihood_fn):
        """Set motion model, observation model, and likelihood function"""
        self.motion_model = motion_fn
        self.observation_model = obs_fn
        self.observation_likelihood = likelihood_fn
    
    def predict(self, u, noise_std=0.1):
        """Prediction step - move particles according to motion model"""
        for i in range(self.num_particles):
            # Add noise to each particle
            noise = np.random.normal(0, noise_std, self.state_dim)
            
            if self.motion_model:
                self.particles[i] = self.motion_model(self.particles[i], u) + noise
            else:
                # Default: add random motion
                self.particles[i] += np.random.normal(0, 0.1, self.state_dim)
    
    def update(self, z):
        """Update step - reweight particles based on observation"""
        for i in range(self.num_particles):
            # Calculate likelihood of observation given particle state
            if self.observation_likelihood:
                self.weights[i] *= self.observation_likelihood(self.particles[i], z)
        
        # Normalize weights
        self.weights += 1e-300  # Avoid numerical issues
        self.weights /= np.sum(self.weights)
    
    def resample(self):
        """Resample particles based on their weights"""
        # Systematic resampling
        indices = self._systematic_resample()
        self.particles = self.particles[indices]
        self.weights.fill(1.0 / self.num_particles)
    
    def _systematic_resample(self):
        """Systematic resampling algorithm"""
        indices = np.zeros(self.num_particles, dtype=int)
        cumulative_sum = np.cumsum(self.weights)
        
        # Generate uniformly spaced samples
        u = np.random.uniform(0, 1.0 / self.num_particles)
        i, j = 0, 0
        
        while i < self.num_particles:
            while cumulative_sum[j] < u:
                j += 1
            indices[i] = j
            u += 1.0 / self.num_particles
            i += 1
        
        return indices
    
    def estimate(self):
        """Get state estimate from particles"""
        # Weighted average of particles
        estimate = np.average(self.particles, axis=0, weights=self.weights)
        return estimate
    
    def is_degenerate(self, threshold=0.05):
        """Check if particles are degenerate (effective sample size too low)"""
        eff_sample_size = 1.0 / np.sum(self.weights**2)
        return eff_sample_size < (threshold * self.num_particles)
```

## Multi-Sensor Integration

### Sensor Data Association

```python
class DataAssociation:
    """Handle data association for multi-target tracking"""
    def __init__(self, max_distance=50.0):
        self.max_distance = max_distance
        self.tracks = []
        self.next_id = 0
    
    def associate_detections(self, detections, predictions):
        """Associate detections with predicted track positions"""
        # Using greedy assignment based on distance
        associations = []
        
        for det_idx, detection in enumerate(detections):
            best_track_idx = -1
            min_distance = float('inf')
            
            for track_idx, prediction in enumerate(predictions):
                # Calculate distance between detection and prediction
                dist = np.linalg.norm(np.array(detection) - np.array(prediction))
                
                if dist < min_distance and dist < self.max_distance:
                    min_distance = dist
                    best_track_idx = track_idx
            
            if best_track_idx != -1:
                associations.append((det_idx, best_track_idx))
        
        return associations

class MultiSensorTracker:
    """Track objects using multiple sensors"""
    def __init__(self, fusion_type='kalman'):
        self.fusion_type = fusion_type
        self.tracks = {}  # Track ID -> tracker
        self.next_track_id = 0
        self.association = DataAssociation()
    
    def process_frame(self, sensor_data):
        """
        Process data from multiple sensors
        sensor_data: dict with sensor names as keys, detection lists as values
        """
        # Aggregate detections from all sensors
        all_detections = []
        detection_sources = []
        
        for sensor_name, detections in sensor_data.items():
            for det in detections:
                all_detections.append(det)
                detection_sources.append(sensor_name)
        
        if not all_detections:
            # No detections, update existing tracks with prediction only
            for track_id in list(self.tracks.keys()):
                self.tracks[track_id].predict()
            return {}
        
        # Get predictions from existing tracks
        predictions = [track.predict() for track in self.tracks.values()]
        
        # Associate detections with tracks
        associations = self.association.associate_detections(all_detections, predictions)
        
        # Update tracks with matched detections
        updated_tracks = set()
        for det_idx, track_idx in associations:
            track_id = list(self.tracks.keys())[track_idx]
            self.tracks[track_id].update(all_detections[det_idx])
            updated_tracks.add(track_id)
        
        # Create new tracks for unassociated detections
        associated_det_indices = {det_idx for det_idx, _ in associations}
        for det_idx, detection in enumerate(all_detections):
            if det_idx not in associated_det_indices:
                # Create new track
                track_id = self.next_track_id
                self.next_track_id += 1
                
                if self.fusion_type == 'kalman':
                    self.tracks[track_id] = KalmanFilter(4, 2)  # 4D state (x, y, vx, vy), 2D observation (x, y)
                
                self.tracks[track_id].update(np.array(detection[:2]))  # Use first two values as position
        
        # Delete old tracks that weren't updated (optional)
        # for track_id in list(self.tracks.keys()):
        #     if track_id not in updated_tracks and self.tracks[track_id].age > max_age:
        #         del self.tracks[track_id]
        
        # Return current track estimates
        return {tid: track.get_state()[:2] for tid, track in self.tracks.items()}
```

## Visual SLAM

Simultaneous Localization and Mapping (SLAM) using visual sensors:

```python
class VisualSLAM:
    """Basic structure for Visual SLAM system"""
    def __init__(self):
        self.keyframes = []
        self.map_points = []
        self.current_pose = np.eye(4)  # 4x4 transformation matrix
        self.reference_frame = None
        
    def process_frame(self, image, timestamp):
        """Process a new camera frame"""
        # Extract features from the image
        keypoints, descriptors = detect_features(image, method='orb')
        
        # If this is the first frame, initialize
        if len(self.keyframes) == 0:
            self._initialize_map(image, keypoints, descriptors, timestamp)
            return self.current_pose
        
        # Try to match features with previous frame
        matches = match_features(self.keyframes[-1]['descriptors'], descriptors)
        
        # Estimate motion between frames
        if len(matches) > 10:  # Require minimum number of matches
            motion = self._estimate_motion(matches, self.keyframes[-1]['keypoints'], keypoints)
            self.current_pose = self.current_pose @ motion  # Update pose
            
            # Add new keyframe if significant motion occurred
            if self._should_add_keyframe(motion):
                self._add_keyframe(image, keypoints, descriptors, timestamp)
        
        return self.current_pose
    
    def _initialize_map(self, image, keypoints, descriptors, timestamp):
        """Initialize the map with the first frame"""
        keyframe = {
            'image': image,
            'keypoints': keypoints,
            'descriptors': descriptors,
            'pose': np.eye(4),  # Identity pose for first frame
            'timestamp': timestamp
        }
        self.keyframes.append(keyframe)
        self.reference_frame = keyframe
    
    def _estimate_motion(self, matches, prev_keypoints, curr_keypoints):
        """Estimate motion between two frames using matched features"""
        # Extract matching points
        prev_pts = np.float32([prev_keypoints[m.queryIdx].pt for m in matches]).reshape(-1, 1, 2)
        curr_pts = np.float32([curr_keypoints[m.trainIdx].pt for m in matches]).reshape(-1, 1, 2)
        
        # Calculate essential matrix (for rotation and translation)
        E, mask = cv2.findEssentialMat(curr_pts, prev_pts, focal=1.0, pp=(0,0), method=cv2.RANSAC, threshold=1.0)
        
        if E is not None:
            # Decompose essential matrix to get rotation and translation
            _, R, t, mask = cv2.recoverPose(E, curr_pts, prev_pts)
            
            # Create transformation matrix
            T = np.eye(4)
            T[:3, :3] = R
            T[:3, 3] = t.flatten()
            
            return T
        
        # If motion estimation fails, return identity
        return np.eye(4)
    
    def _should_add_keyframe(self, motion_threshold=0.1):
        """Determine if a new keyframe should be added"""
        # Simple heuristic: add keyframe if camera moved significantly
        translation = np.linalg.norm(motion_threshold[:3, 3])
        rotation = np.arccos(np.clip((np.trace(motion_threshold[:3, :3]) - 1) / 2, -1, 1))
        
        return translation > 0.1 or rotation > 0.1
    
    def _add_keyframe(self, image, keypoints, descriptors, timestamp):
        """Add a new keyframe to the map"""
        keyframe = {
            'image': image,
            'keypoints': keypoints,
            'descriptors': descriptors,
            'pose': self.current_pose.copy(),
            'timestamp': timestamp
        }
        self.keyframes.append(keyframe)
    
    def optimize_map(self):
        """Optimize the map using bundle adjustment (simplified)"""
        # In a real implementation, this would use bundle adjustment
        # to optimize both camera poses and 3D point positions
        pass
```

## Deep Learning in Perception

### CNN-Based Object Detection

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleObjectDetectorCNN(nn.Module):
    """A simple CNN-based object detector for demonstration"""
    def __init__(self, num_classes, input_channels=3):
        super(SimpleObjectDetectorCNN, self).__init__()
        
        # Feature extraction layers
        self.conv1 = nn.Conv2d(input_channels, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        
        # Pooling layers
        self.pool = nn.MaxPool2d(2, 2)
        
        # Classification layers
        self.classifier = nn.Sequential(
            nn.Linear(128 * 8 * 8, 256),  # Assuming input is 32x32 -> 8x8 after pooling
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        # Feature extraction
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = self.pool(F.relu(self.conv3(x)))
        
        # Flatten for classification
        x = x.view(x.size(0), -1)
        
        # Classification
        x = self.classifier(x)
        
        return x

class YOLODetector:
    """Conceptual implementation of YOLO-style object detection"""
    def __init__(self, grid_size=7, num_boxes=2, num_classes=20):
        self.grid_size = grid_size
        self.num_boxes = num_boxes
        self.num_classes = num_classes
        # Total output dimensions: S*S*(B*5 + C)
        self.output_dim = grid_size * grid_size * (num_boxes * 5 + num_classes)
    
    def detect(self, image):
        """
        Detect objects in image
        Returns: list of detections [class_id, confidence, x, y, width, height]
        """
        # This is a conceptual implementation
        # In practice, this would involve a trained neural network
        
        # For demonstration, return fake detections
        detections = []
        
        # Simulate detections (in practice, these would come from neural network output)
        for _ in range(np.random.randint(0, 5)):  # Random number of detections
            class_id = np.random.randint(0, self.num_classes)
            confidence = np.random.uniform(0.5, 1.0)
            x = np.random.uniform(0, 1)  # Normalized coordinates
            y = np.random.uniform(0, 1)
            width = np.random.uniform(0.1, 0.4)
            height = np.random.uniform(0.1, 0.4)
            
            detections.append([class_id, confidence, x, y, width, height])
        
        return detections
    
    def nms(self, detections, iou_threshold=0.5):
        """Apply non-maximum suppression to detections"""
        # If no detections, return empty list
        if len(detections) == 0:
            return []
        
        # Sort by confidence
        detections = sorted(detections, key=lambda x: x[1], reverse=True)
        
        keep = []
        while len(detections) > 0:
            # Take the detection with highest confidence
            best = detections[0]
            keep.append(best)
            
            # Remove suppressed detections
            remaining = []
            for det in detections[1:]:
                if self._iou(best, det) < iou_threshold:
                    remaining.append(det)
            
            detections = remaining
        
        return keep
    
    def _iou(self, det1, det2):
        """Calculate intersection over union between two detections"""
        # Extract coordinates
        x1_1, y1_1 = det1[2] - det1[4]/2, det1[3] - det1[5]/2
        x2_1, y2_1 = det1[2] + det1[4]/2, det1[3] + det1[5]/2
        
        x1_2, y1_2 = det2[2] - det2[4]/2, det2[3] - det2[5]/2
        x2_2, y2_2 = det2[2] + det2[4]/2, det2[3] + det2[5]/2
        
        # Calculate intersection area
        xi1, yi1 = max(x1_1, x1_2), max(y1_1, y1_2)
        xi2, yi2 = min(x2_1, x2_2), min(y2_1, y2_2)
        
        if xi2 <= xi1 or yi2 <= yi1:
            return 0
        
        inter_area = (xi2 - xi1) * (yi2 - yi1)
        
        # Calculate union area
        box1_area = (x2_1 - x1_1) * (y2_1 - y1_1)
        box2_area = (x2_2 - x1_2) * (y2_2 - y1_2)
        union_area = box1_area + box2_area - inter_area
        
        return inter_area / union_area if union_area > 0 else 0
```

## Applications in Robotics

### Navigation and Mapping

```python
class PerceptionForNavigation:
    """Integrate perception for robot navigation"""
    def __init__(self):
        self.obstacle_detector = SimpleObjectDetector()  # Our earlier implementation
        self.local_map = np.zeros((100, 100), dtype=np.float32)  # Local occupancy grid
        self.robot_position = (0, 0)
    
    def update_local_map(self, sensor_data):
        """Update local map based on sensor readings"""
        # Process sensor data (LiDAR, camera, etc.)
        if 'lidar' in sensor_data:
            self._process_lidar_data(sensor_data['lidar'])
        if 'camera' in sensor_data:
            self._process_camera_data(sensor_data['camera'])
    
    def _process_lidar_data(self, lidar_scan):
        """Process LiDAR data to update occupancy grid"""
        # Convert polar coordinates to Cartesian
        angles = lidar_scan['angles']
        distances = lidar_scan['distances']
        
        for angle, distance in zip(angles, distances):
            if distance < 10.0:  # Only process up to 10m
                # Convert to grid coordinates
                x = int(self.robot_position[0] + distance * np.cos(angle))
                y = int(self.robot_position[1] + distance * np.sin(angle))
                
                if 0 <= x < self.local_map.shape[0] and 0 <= y < self.local_map.shape[1]:
                    # Mark as occupied
                    self.local_map[x, y] = 1.0
    
    def _process_camera_data(self, camera_image):
        """Process camera data to detect obstacles"""
        # Use our earlier object detection
        # For simplicity, we'll just detect if there are obstacles in the forward direction
        height, width = camera_image.shape[:2]
        
        # Analyze the center-bottom portion of the image (looking forward near ground)
        forward_region = camera_image[height//2:, width//4:3*width//4]
        
        # Simple approach: check for dark pixels that might indicate obstacles
        gray_region = cv2.cvtColor(forward_region, cv2.COLOR_BGR2GRAY) if len(forward_region.shape) == 3 else forward_region
        dark_pixels = np.sum(gray_region < 50)  # Threshold for "obstacle"
        
        if dark_pixels > 0.1 * gray_region.size:  # If more than 10% are dark
            # Could mark this area as potentially occupied
            pass
    
    def get_navigation_recommendation(self, goal_position):
        """Provide navigation recommendation based on perception"""
        # Calculate path to goal considering obstacles
        path = self._calculate_path_to_goal(goal_position)
        
        # Check if path is clear
        is_path_clear = self._check_path_clear(path)
        
        return {
            'path': path,
            'is_path_clear': is_path_clear,
            'obstacles_detected': self._count_obstacles(),
            'recommended_action': 'proceed' if is_path_clear else 'replan'
        }
    
    def _calculate_path_to_goal(self, goal_position):
        """Calculate path to goal (simplified)"""
        # For demonstration, just return a straight line
        # In practice, this would use A* or other path planning algorithms
        return [self.robot_position, goal_position]
    
    def _check_path_clear(self, path):
        """Check if the path is clear of obstacles"""
        # Simplified: check if any cell in the path is occupied
        for point in path:
            x, y = int(point[0]), int(point[1])
            if 0 <= x < self.local_map.shape[0] and 0 <= y < self.local_map.shape[1]:
                if self.local_map[x, y] > 0.5:  # If more than 50% occupied
                    return False
        return True
    
    def _count_obstacles(self):
        """Count obstacles in current map"""
        return np.sum(self.local_map > 0.5)
```

### Human-Robot Interaction

```python
class HumanPerception:
    """Perceive and understand human actions and intentions"""
    def __init__(self):
        self.tracked_humans = {}
        self.human_behavior_models = {}
    
    def detect_humans(self, image):
        """Detect humans in image"""
        # In practice, this would use a person detection model
        # For demonstration, we'll use HOG + SVM (like our earlier example)
        
        # This would run a human detection classifier
        # and return bounding boxes of detected humans
        pass
    
    def predict_human_intent(self, human_pose, trajectory):
        """Predict human intention based on pose and movement"""
        # Analyze human posture and movement patterns
        # to predict likely future actions
        
        # Example: Is the person walking toward the robot?
        if trajectory and len(trajectory) >= 2:
            last_pos = trajectory[-2]
            curr_pos = trajectory[-1]
            
            # Calculate direction of movement
            movement_dir = (curr_pos[0] - last_pos[0], curr_pos[1] - last_pos[1])
            
            # Calculate vector to robot
            robot_pos = (0, 0)  # Assuming robot is at origin
            to_robot = (robot_pos[0] - curr_pos[0], robot_pos[1] - curr_pos[1])
            
            # Check if person is moving toward robot
            dot_product = movement_dir[0] * to_robot[0] + movement_dir[1] * to_robot[1]
            
            if dot_product > 0:  # Moving in direction of robot
                return "approaching"
            else:
                return "moving_away"
        
        return "unknown"
    
    def safe_interaction_zone(self, human_position, robot_position):
        """Determine if human is in safe interaction zone"""
        distance = np.linalg.norm(np.array(human_position) - np.array(robot_position))
        
        # Define safe zones
        if distance < 0.5:  # Too close
            return "unsafe"
        elif distance < 2.0:  # Good interaction distance
            return "safe_interaction"
        else:  # Too far
            return "out_of_range"
```

## Quiz

1. What is the difference between computer vision and perception in robotics?
2. Explain the pinhole camera model and its importance in computer vision.
3. What are the main components of a Kalman filter and their functions?
4. How does sensor fusion improve robot perception compared to single sensors?
5. What is the purpose of data association in multi-target tracking?

## Hands-on Lab

### Lab: Implementing a Multi-Sensor Perception System
- Implement a basic sensor fusion algorithm combining camera and range data
- Create a simple object detection pipeline using traditional computer vision
- Implement a Kalman filter for tracking detected objects
- Test the system with simulated or real robot data
- Evaluate the performance of different perception approaches

### Objectives:
- Implement multiple perception techniques (traditional and learning-based)
- Integrate different sensor modalities using fusion techniques
- Track objects using filtering methods
- Evaluate perception system performance
- Apply perception for robot navigation and interaction