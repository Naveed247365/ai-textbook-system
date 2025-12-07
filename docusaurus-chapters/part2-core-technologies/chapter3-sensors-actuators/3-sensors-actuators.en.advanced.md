---
title: "Sensors & Actuators (English Advanced)"
sidebar_position: 2
---

# Sensors & Actuators (English Advanced Version)

Welcome to Chapter 3 of our Physical AI & Humanoid Robotics textbook. In this chapter, we'll explore the fundamental components that allow robots to interact with the physical world - sensors that perceive and actuators that act, with emphasis on rigorous technical understanding and mathematical foundations.

## Chapter Overview

This chapter delves deeply into the essential sensors and actuators used in robotics, including:

- [Sensor Fundamentals](./3.1-sensor-fundamentals.en.advanced) - Comprehensive analysis of sensor principles, mathematical models, and performance specifications
- [Actuator Systems](./3.2-actuator-systems.en.advanced) - Detailed examination of actuator physics, control theory, and dynamic modeling
- [Sensor-Actuator Integration](./3.3-sensor-actuator-integration.en.advanced) - Advanced control systems, sensor fusion algorithms, and real-time integration

This chapter builds on the foundational concepts introduced in Chapters 1 and 2 and prepares you for more advanced topics in perception, control, and intelligence that will be covered in subsequent chapters.

## Learning Objectives

By the end of this chapter, you should be able to:

1. Analyze sensor specifications and performance characteristics with mathematical rigor
2. Model actuator dynamics and implement advanced control algorithms
3. Design sensor fusion systems using probabilistic and filtering methods
4. Implement real-time sensor-actuator control loops with optimal performance

## Mathematical Foundations of Sensor Systems

### Sensor Measurement Models

A sensor measurement can be modeled as:

```
z = h(x) + v
```

Where:
- z: Measurement vector
- x: True state vector
- h: Measurement function
- v: Measurement noise (typically assumed Gaussian: v ~ N(0, R))

### Sensor Uncertainty and Noise Models

**Additive White Gaussian Noise (AWGN)**:
```
p(z|x) = (1/√(2πσ²)) * exp(-(z - h(x))² / 2σ²)
```

**Covariance Matrix for Multi-dimensional Sensors**:
```
R = E[(z - h(x))(z - h(x))ᵀ]
```

## Advanced Sensor Technologies

### Inertial Measurement Units (IMUs)

IMUs combine accelerometers, gyroscopes, and magnetometers for orientation estimation.

**Accelerometer Model**:
```
a_meas = R^T(g + a_true) + b_a + n_a
```

Where:
- a_meas: Measured acceleration
- R: Rotation matrix
- g: Gravity vector
- a_true: True linear acceleration
- b_a: Accelerometer bias
- n_a: Accelerometer noise

**Gyroscope Model**:
```
ω_meas = ω_true + b_ω + n_ω
```

Where:
- ω_meas: Measured angular velocity
- ω_true: True angular velocity
- b_ω: Gyroscope bias
- n_ω: Gyroscope noise

### LIDAR Systems

Light Detection and Ranging systems provide precise distance measurements.

**LIDAR Measurement Model**:
```
r = ||p_target - p_sensor|| + n_r
```

Where r is the measured range, p_target is the target position, p_sensor is the sensor position, and n_r is range noise.

**Point Cloud Processing**:
```
P = {p₁, p₂, ..., pₙ} where pᵢ = [xᵢ, yᵢ, zᵢ]ᵀ
```

### Vision Systems

Computer vision systems process optical information for perception.

**Pinhole Camera Model**:
```
[u]   [f_x   0   c_x] [X/Z]
[v] = [0   f_y   c_y] [Y/Z]
[1]   [0    0     1 ] [ 1 ]
```

Where (u,v) are image coordinates, (X,Y,Z) are world coordinates, and (f_x,f_y) are focal lengths.

### Sensor Fusion Algorithms

**Kalman Filter for Linear Systems**:
```
Prediction: x̂ₖ|ₖ₋₁ = Fx̂ₖ₋₁|ₖ₋₁ + Buₖ₋₁
          Pₖ|ₖ₋₁ = FPₖ₋₁|ₖ₋₁Fᵀ + Q

Update:   Kₖ = Pₖ|ₖ₋₁Hᵀ(HPₖ|ₖ₋₁Hᵀ + R)⁻¹
          x̂ₖ|ₖ = x̂ₖ|ₖ₋₁ + Kₖ(zₖ - Hx̂ₖ|ₖ₋₁)
          Pₖ|ₖ = (I - KₖH)Pₖ|ₖ₋₁
```

**Extended Kalman Filter for Nonlinear Systems**:
```
F = ∂f/∂x|_{x̂ₖ₋₁|ₖ₋₁}
H = ∂h/∂x|_{x̂ₖ|ₖ₋₁}
```

## Advanced Actuator Systems

### DC Motor Mathematical Model

**Electrical Equation**:
```
V = R*i + L*di/dt + K_e*ω
```

**Mechanical Equation**:
```
J*dω/dt = K_t*i - B*ω - T_L
```

Where:
- V: Applied voltage
- R: Armature resistance
- L: Armature inductance
- i: Current
- K_e: Back EMF constant
- ω: Angular velocity
- J: Moment of inertia
- K_t: Torque constant
- B: Viscous damping coefficient
- T_L: Load torque

### Stepper Motor Control

Stepper motors move in discrete steps with precise positioning.

**Step Angle**:
```
θ_step = 360° / (N * M)
```

Where N is the number of rotor teeth and M is the number of phases.

### Servo Motor Control

Servo motors include feedback for closed-loop control.

**PID Control for Position**:
```
u(t) = K_p*e(t) + K_i*∫e(t)dt + K_d*de(t)/dt
```

Where e(t) is the position error.

### Advanced Control Techniques for Actuators

**Computed Torque Control**:
```
τ = M(q)q̈_d + C(q, q̇)q̇ + g(q) + K_p*e + K_d*ė
```

**Adaptive Control**:
```
τ = Y(θ)θ̂ + K_v*s
```

Where Y is the regressor matrix, θ̂ is the parameter estimate, and s is the sliding surface.

## Sensor-Actuator Integration Systems

### Real-time Control Architectures

**Control Loop Timing**:
```
T_control = T_sensor + T_processing + T_actuator
```

For stable control, T_control should be significantly smaller than the system's time constants.

### Force Control Systems

**Impedance Control**:
```
M_d*q̈_d + B_d*q̇_d + K_d*q_d = F_desired - F_contact
```

**Admittance Control**:
```
q̈_d = M_a⁻¹(F_measured - B_a*q̇_d - K_a*q_d)
```

### Multi-Sensor Fusion for Control

**Information Filter**:
```
Yₖ = Pₖ⁻¹ (Information matrix)
îₖ = Pₖ⁻¹x̂ₖ (Information state)
```

## Noise Analysis and Filtering

### Power Spectral Density Analysis

For sensor noise characterization:
```
S_XX(f) = lim_{T→∞} (1/T)E[X_T(f)X_T*(f)]
```

### Advanced Filtering Techniques

**Unscented Kalman Filter (UKF)**:
- Uses sigma points to capture nonlinearities
- More accurate than EKF for highly nonlinear systems

**Particle Filter**:
- Monte Carlo approach for non-Gaussian noise
- Represents posterior distribution with weighted particles

## Sensor Calibration and Compensation

### Sensor Calibration Models

**Accelerometer Calibration**:
```
a_calibrated = S_a * (a_raw - b_a)
```

Where S_a is the scale factor matrix and b_a is the bias vector.

### Temperature Compensation

**Temperature-dependent Bias**:
```
b(T) = b_0 + α*(T - T_0)
```

## Advanced Applications

### Haptic Feedback Systems

Haptic systems provide tactile feedback to users.

**Haptic Rendering**:
```
F_contact = -K_contact * (x_contact - x_surface) - B_contact * ẋ_contact
```

### Tactile Sensing Arrays

Tactile sensors provide distributed force sensing.

**Tactile Image Processing**:
```
I_tactile = [f₁, f₂, ..., fₙ]ᵀ
```

Where fᵢ represents force at tactile element i.

## Standards and Safety Considerations

### Safety Standards
- **ISO 10218**: Industrial robot safety requirements
- **ISO/TS 15066**: Collaborative robot safety guidelines
- **IEC 61508**: Functional safety for electrical systems

### Performance Specifications
- **Accuracy**: How close measurements are to true values
- **Precision**: Repeatability of measurements
- **Resolution**: Smallest detectable change
- **Bandwidth**: Frequency range of operation

## Key Takeaways

- Sensor systems require mathematical modeling of measurement processes and noise characteristics
- Actuator systems involve complex dynamics requiring advanced control techniques
- Sensor fusion combines multiple sources of information optimally
- Real-time constraints are critical for stable sensor-actuator integration
- Calibration and compensation are essential for accurate operation
- Standards ensure safe and reliable operation of sensor-actuator systems

## Advanced Review Questions

1. Derive the Extended Kalman Filter equations for a nonlinear sensor fusion problem.
2. Analyze the stability of a closed-loop control system with sensor delay.
3. Implement a particle filter for multi-sensor fusion with non-Gaussian noise.
4. Design an impedance controller for safe human-robot interaction.
5. Compare the computational complexity of different sensor fusion algorithms.