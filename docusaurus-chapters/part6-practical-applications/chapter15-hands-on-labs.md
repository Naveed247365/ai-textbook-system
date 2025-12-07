---
title: "Hands-on Labs"
sidebar_position: 1
---

# عملی مشقیں (Hands-on Labs)

## تعارف (Introduction)

عملی مشقیں ہماری فزیکل ای آئی اور ہیومنوائڈ روبوٹکس کی کتاب کا ایک اہم جزو ہے جو نظریاتی تصورات کو حقیقی دنیا کے اطلاق کے ساتھ مضبوط کرتا ہے۔ یہ مشقیں صارفین کو سیمولیشن اور حقیقی روبوٹس کے ساتھ عملی تجربہ فراہم کرتی ہیں۔

## خصوصیات (Features)

- **سیمولیشن پر مبنی مشقیں**: گیزبو اور NVIDIA آئیسک سیم کا استعمال کرتے ہوئے
- ** حقیقی روبوٹ کا اطلاق**: حقیقی روبوٹس کے ساتھ عملی مشقیں
- **مرحلہ وار ہدایات**: ہدایت کردہ پروجیکٹس کے ساتھ
- **روبوٹکس کے لیے AI ایجنٹس**: AI کے اطلاق کے ساتھ مربوط

## مشق کی اقسام (Lab Types)

### 1. سیمولیشن مشقیں (Simulation Labs)
- گیزبو سیمولیشن کے ماحول
- NVIDIA آئیسک سیم کے ماحول
- ROS2 کے ساتھ سیمولیشن کی مشقیں

### 2. کنٹرول مشقیں (Control Labs)
- روبوٹ کے کنٹرول کے الگوریتم کا اطلاق
- PID کنٹرول کی مشقیں
- روبوٹ کی مسیر کی منصوبہ بندی

### 3. تصورات کی مشقیں (Perception Labs)
- کمپیوٹر وژن کے الگوریتم کا اطلاق
- سینسر کی معلومات کی ضم کاری
- عکاسیت کا تصور

## ٹیکنالوجی کا نفاذ (Technical Implementation)

### 1. کمپیوٹر وژن مشقیں
```python
# Example: Object detection lab
import cv2
import numpy as np

def detect_objects(image):
    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Detect edges using Canny edge detector
    edges = cv2.Canny(blurred, 50, 150)

    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours on the original image
    result = image.copy()
    cv2.drawContours(result, contours, -1, (0, 255, 0), 2)

    return result, len(contours)
```

### 2. کنٹرول مشقیں
```python
# Example: PID controller for robot movement
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        self.prev_error = 0
        self.integral = 0

    def compute(self, setpoint, measured_value, dt):
        error = setpoint - measured_value
        self.integral += error * dt
        derivative = (error - self.prev_error) / dt

        output = self.kp * error + self.ki * self.integral + self.kd * derivative
        self.prev_error = error

        return output
```

### 3. روبوٹکس مشقیں
```python
# Example: Basic robot movement using ROS2
import rclpy
from geometry_msgs.msg import Twist

def move_robot():
    rclpy.init()
    node = rclpy.create_node('robot_mover')
    publisher = node.create_publisher(Twist, '/cmd_vel', 10)

    msg = Twist()
    msg.linear.x = 0.5  # Move forward at 0.5 m/s
    msg.angular.z = 0.2  # Rotate at 0.2 rad/s

    # Publish the message for 5 seconds
    for i in range(50):  # 50 iterations at 10Hz
        publisher.publish(msg)
        rclpy.spin_once(node, timeout_sec=0.1)

    # Stop the robot
    msg.linear.x = 0.0
    msg.angular.z = 0.0
    publisher.publish(msg)

    node.destroy_node()
    rclpy.shutdown()
```

## مشق کی ساخت (Lab Structure)

ہر مشق کے مندرجہ ذیل حصے ہوتے ہیں:

1. ** تعارف**: مشق کا مقصد اور اس سے متعلق تصورات
2. ** ضروریات**: مشق کو کرنے کے لیے ضروری سافٹ ویئر/ہارڈ ویئر
3. ** ہدایات**: قدم بہ قدم ہدایات
4. ** مشقیں**: عملی کام کے لیے سوالات
5. ** تجزیہ**: مشق کے نتائج کا تجزیہ
6. ** مزید پڑھائی**: مزید تحقیق کے لیے وسائل

## مستقبل کی اسکریپٹس (Future Enhancements)

- VR مشقیں برائے غیر حقیقی تجربہ
- کلاوڈ بیسڈ مشقیں برائے آسان رسائی
- AI-محرک مشقیں برائے ذاتی نوعیت کا تجربہ