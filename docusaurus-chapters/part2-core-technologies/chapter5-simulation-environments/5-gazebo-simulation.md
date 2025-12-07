---
title: "Gazebo Simulation"
sidebar_position: 5
---

# Gazebo Simulation

## Table of Contents
- [Introduction to Gazebo](#introduction-to-gazebo)
- [Installation and Setup](#installation-and-setup)
- [Gazebo Architecture](#gazebo-architecture)
- [World Building](#world-building)
- [Robot Modeling](#robot-modeling)
- [Sensor Simulation](#sensor-simulation)
- [Physics Simulation](#physics-simulation)
- [Control Interfaces](#control-interfaces)
- [Gazebo Integration with ROS](#gazebo-integration-with-ros)
- [Simulation Scenarios](#simulation-scenarios)
- [Best Practices](#best-practices)
- [Quiz](#quiz)
- [Hands-on Lab](#hands-on-lab)

## Introduction to Gazebo

Gazebo is a 3D dynamic simulator that enables accurate and efficient testing of robots in complex indoor and outdoor environments. It provides high-fidelity physics simulation, realistic rendering, and convenient programmatic interfaces for controlling robots and sensors.

### Key Features
- **High-fidelity physics**: Accurate simulation of rigid body dynamics with contacts, friction, and collisions
- **Realistic rendering**: High-quality visualization with shadows, textures, and lighting
- **Extensive library**: Large collection of robot models, objects, and environments
- **Sensor simulation**: Support for cameras, LiDAR, IMU, GPS, and other sensors
- **Programmatic interface**: Python and C++ APIs for simulation control
- **ROS integration**: Seamless integration with Robot Operating System (ROS)

### Benefits of Simulation
- **Development safety**: Test algorithms without risk of robot damage
- **Cost reduction**: Develop and test without expensive hardware
- **Experimentation**: Easily modify environments and test different scenarios
- **Reproducibility**: Create controlled experiments with consistent conditions
- **Speed**: Accelerate testing by running time faster than real-time

## Installation and Setup

### Installing Gazebo
Gazebo can be installed on multiple platforms, with Ubuntu being the most common:

```bash
# Ubuntu installation
sudo apt update
sudo apt install gazebo libgazebo-dev

# For ROS integration
sudo apt install ros-noetic-gazebo-ros-pkgs ros-noetic-gazebo-ros-control

# Verify installation
gazebo --version
```

### Basic Setup
```bash
# Set up Gazebo environment variables
export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/.gazebo/models:/usr/share/gazebo-11/models
export GAZEBO_RESOURCE_PATH=$GAZEBO_RESOURCE_PATH:~/.gazebo/models:/usr/share/gazebo-11/worlds

# Launch Gazebo
gazebo
```

### Directory Structure
```
~/.gazebo/
├── models/           # Custom robot and object models
├── worlds/           # Custom world files
├── plugins/          # Gazebo plugins
└── media/            # Textures and materials
```

## Gazebo Architecture

### Core Components
Gazebo's architecture consists of several interconnected components:

#### Gazebo Server (gzserver)
- **Purpose**: Runs the main simulation engine
- **Responsibilities**: Physics simulation, sensor data generation, plugin execution
- **Interface**: Communicates with clients via transport layer

#### Gazebo Client (gzclient)
- **Purpose**: Provides graphical user interface
- **Responsibilities**: Visualization, user interaction, debugging tools
- **Interface**: Connects to server to display simulation

#### Transport Layer
- **Purpose**: Handles inter-process communication
- **Mechanism**: Uses ZeroMQ for efficient message passing
- **Benefits**: Enables distributed simulation components

### Plugin System
Gazebo uses a plugin architecture for extensibility:

```cpp
// Example of a basic Gazebo plugin
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>

namespace gazebo
{
  class CustomPlugin : public ModelPlugin
  {
    public: void Load(physics::ModelPtr _model, sdf::ElementPtr _sdf)
    {
      this->model = _model;
      this->world = _model->GetWorld();
      
      // Connect to physics update event
      this->updateConnection = event::Events::ConnectWorldUpdateBegin(
          std::bind(&CustomPlugin::OnUpdate, this));
    }
    
    public: void OnUpdate()
    {
      // Custom simulation logic here
    }
    
    private: physics::ModelPtr model;
    private: physics::WorldPtr world;
    private: event::ConnectionPtr updateConnection;
  };
  
  GZ_REGISTER_MODEL_PLUGIN(CustomPlugin)
}
```

## World Building

### World File Structure (SDF)
Gazebo uses Simulation Description Format (SDF) for world definition:

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="my_world">
    <!-- Include ground plane -->
    <include>
      <uri>model://ground_plane</uri>
    </include>
    
    <!-- Include sun -->
    <include>
      <uri>model://sun</uri>
    </include>
    
    <!-- Define a custom box -->
    <model name="box">
      <pose>0 0 1 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
          <material>
            <ambient>1 0 0 1</ambient>
            <diffuse>1 0 0 1</diffuse>
          </material>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

### World Properties
```xml
<world name="custom_world">
  <!-- Physics engine configuration -->
  <physics type="ode">
    <max_step_size>0.001</max_step_size>
    <real_time_factor>1.0</real_time_factor>
    <real_time_update_rate>1000</real_time_update_rate>
  </physics>
  
  <!-- Lighting -->
  <light name="sun" type="directional">
    <pose>0 0 10 0 0 0</pose>
    <diffuse>0.8 0.8 0.8 1</diffuse>
    <specular>0.2 0.2 0.2 1</specular>
    <attenuation>
      <range>1000</range>
      <constant>0.9</constant>
      <linear>0.01</linear>
      <quadratic>0.001</quadratic>
    </attenuation>
    <direction>-0.4 0.2 -1.0</direction>
  </light>
  
  <!-- Environment properties -->
  <gravity>0 0 -9.8</gravity>
  <magnetic_field>6e-06 2.3e-05 -4.2e-05</magnetic_field>
</world>
```

### Creating Custom Environments
```xml
<!-- Maze world example -->
<world name="maze_world">
  <!-- Ground plane -->
  <include>
    <uri>model://ground_plane</uri>
  </include>
  
  <!-- Walls forming a maze -->
  <model name="wall_1">
    <pose>0 5 1 0 0 0</pose>
    <link name="link">
      <collision name="collision">
        <geometry>
          <box>
            <size>10 0.2 2</size>
          </box>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <box>
            <size>10 0.2 2</size>
          </box>
        </geometry>
      </visual>
    </link>
  </model>
  
  <!-- Other walls would be defined similarly -->
  
  <!-- Lighting -->
  <light name="overhead_light" type="point">
    <pose>0 0 5 0 0 0</pose>
    <diffuse>0.9 0.9 0.9 1</diffuse>
  </light>
</world>
```

## Robot Modeling

### SDF Robot Model Structure
```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <model name="my_robot">
    <!-- Base link -->
    <link name="chassis">
      <pose>0 0 0.1 0 0 0</pose>
      <inertial>
        <mass>10.0</mass>
        <inertia>
          <ixx>0.4</ixx>
          <ixy>0.0</ixy>
          <ixz>0.0</ixz>
          <iyy>0.4</iyy>
          <iyz>0.0</iyz>
          <izz>0.2</izz>
        </inertia>
      </inertial>
      
      <collision name="collision">
        <geometry>
          <box>
            <size>0.5 0.3 0.1</size>
          </box>
        </geometry>
      </collision>
      
      <visual name="visual">
        <geometry>
          <box>
            <size>0.5 0.3 0.1</size>
          </box>
        </geometry>
        <material>
          <ambient>0.8 0.8 0.8 1</ambient>
          <diffuse>0.8 0.8 0.8 1</diffuse>
        </material>
      </visual>
    </link>
    
    <!-- Wheel joints and links -->
    <joint name="left_wheel_hinge" type="revolute">
      <parent>chassis</parent>
      <child>left_wheel</child>
      <axis>
        <xyz>0 1 0</xyz>
        <limit>
          <lower>-1.0</lower>
          <upper>1.0</upper>
        </limit>
      </axis>
    </joint>
    
    <link name="left_wheel">
      <pose>-0.15 0.2 0 0 0 0</pose>
      <inertial>
        <mass>1.0</mass>
        <inertia>
          <ixx>0.01</ixx>
          <ixy>0.0</ixy>
          <ixz>0.0</ixz>
          <iyy>0.01</iyy>
          <iyz>0.0</iyz>
          <izz>0.02</izz>
        </inertia>
      </inertial>
      <collision name="collision">
        <geometry>
          <cylinder>
            <radius>0.1</radius>
            <length>0.05</length>
          </cylinder>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <cylinder>
            <radius>0.1</radius>
            <length>0.05</length>
          </cylinder>
        </geometry>
      </visual>
    </link>
  </model>
</sdf>
```

### Robot Control Plugins
```cpp
// Differential drive controller plugin
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo/transport/transport.hh>
#include <gazebo/msgs/msgs.hh>

namespace gazebo
{
  class DiffDrivePlugin : public ModelPlugin
  {
    public: void Load(physics::ModelPtr _parent, sdf::ElementPtr _sdf)
    {
      this->model = _parent;
      
      // Get joints
      this->leftJoint = this->model->GetJoint("left_wheel_hinge");
      this->rightJoint = this->model->GetJoint("right_wheel_hinge");
      
      // Create transport node for communication
      this->node = transport::NodePtr(new transport::Node());
      this->node->Init(this->model->GetWorld()->Name());
      
      // Subscribe to velocity commands
      this->sub = this->node->Subscribe("~/my_robot/cmd_vel", 
          &DiffDrivePlugin::OnVelMsg, this);
      
      // Connect to physics update event
      this->updateConnection = event::Events::ConnectWorldUpdateBegin(
          std::bind(&DiffDrivePlugin::OnUpdate, this));
    }
    
    private: void OnVelMsg(ConstTwistPtr &_msg)
    {
      this->targetLeftVel = _msg->linear().x() - _msg->angular().z() * this->wheelSeparation / 2.0;
      this->targetRightVel = _msg->linear().x() + _msg->angular().z() * this->wheelSeparation / 2.0;
    }
    
    private: void OnUpdate()
    {
      // Apply velocity commands to wheels
      this->leftJoint->SetVelocity(0, this->targetLeftVel);
      this->rightJoint->SetVelocity(0, this->targetRightVel);
    }
    
    private: physics::ModelPtr model;
    private: physics::JointPtr leftJoint, rightJoint;
    private: transport::NodePtr node;
    private: transport::SubscriberPtr sub;
    private: event::ConnectionPtr updateConnection;
    private: double targetLeftVel, targetRightVel;
    private: double wheelSeparation = 0.4;
  };
  
  GZ_REGISTER_MODEL_PLUGIN(DiffDrivePlugin)
}
```

## Sensor Simulation

### Camera Sensor
```xml
<sensor name="camera" type="camera">
  <always_on>true</always_on>
  <visualize>true</visualize>
  <camera name="head">
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.1</near>
      <far>100</far>
    </clip>
  </camera>
  <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
    <alwaysOn>true</alwaysOn>
    <updateRate>30.0</updateRate>
    <cameraName>my_robot/camera</cameraName>
    <imageTopicName>image_raw</imageTopicName>
    <cameraInfoTopicName>camera_info</cameraInfoTopicName>
    <frameName>camera_frame</frameName>
  </plugin>
</sensor>
```

### LiDAR Sensor
```xml
<sensor name="laser" type="ray">
  <always_on>true</always_on>
  <visualize>true</visualize>
  <ray>
    <scan>
      <horizontal>
        <samples>720</samples>
        <resolution>1</resolution>
        <min_angle>-1.570796</min_angle>  <!-- -90 degrees -->
        <max_angle>1.570796</max_angle>   <!-- 90 degrees -->
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>30.0</max>
      <resolution>0.01</resolution>
    </range>
  </ray>
  <plugin name="laser_controller" filename="libgazebo_ros_laser.so">
    <topicName>scan</topicName>
    <frameName>laser_frame</frameName>
  </plugin>
</sensor>
```

### IMU Sensor
```xml
<sensor name="imu" type="imu">
  <always_on>true</always_on>
  <update_rate>100</update_rate>
  <visualize>false</visualize>
  <imu>
    <angular_velocity>
      <x>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>2e-4</stddev>
        </noise>
      </x>
      <y>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>2e-4</stddev>
        </noise>
      </y>
      <z>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>2e-4</stddev>
        </noise>
      </z>
    </angular_velocity>
    <linear_acceleration>
      <x>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>1.7e-2</stddev>
        </noise>
      </x>
      <y>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>1.7e-2</stddev>
        </noise>
      </y>
      <z>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>1.7e-2</stddev>
        </noise>
      </z>
    </linear_acceleration>
  </imu>
</sensor>
```

## Physics Simulation

### Physics Engine Configuration
Gazebo supports multiple physics engines including ODE, Bullet, and DART:

```xml
<physics type="ode">
  <!-- ODE-specific parameters -->
  <ode>
    <solver>
      <type>quick</type>
      <iters>10</iters>
      <sor>1.3</sor>
    </solver>
    <constraints>
      <cfm>0.0</cfm>
      <erp>0.2</erp>
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
  
  <!-- Global physics parameters -->
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>1000</real_time_update_rate>
</physics>
```

### Material Properties
```xml
<!-- Define surface properties -->
<surface>
  <friction>
    <ode>
      <mu>1.0</mu>
      <mu2>1.0</mu2>
      <fdir1>0 0 0</fdir1>
      <slip1>0.0</slip1>
      <slip2>0.0</slip2>
    </ode>
  </friction>
  <bounce>
    <restitution_coefficient>0.0</restitution_coefficient>
    <threshold>100000</threshold>
  </bounce>
  <contact>
    <ode>
      <soft_cfm>0.0</soft_cfm>
      <soft_erp>0.2</soft_erp>
      <kp>1e+13</kp>
      <kd>1.0</kd>
      <max_vel>0.01</max_vel>
      <min_depth>0.001</min_depth>
    </ode>
  </contact>
</surface>
```

### Simulation Tuning
```cpp
// Example of runtime simulation parameter adjustment
void tune_simulation_parameters()
{
    // Adjust physics parameters for different scenarios
    // - Increase step size for faster simulation but less accuracy
    // - Adjust real-time factor to run faster or slower than real-time
    // - Modify solver parameters for stability vs. speed
}
```

## Control Interfaces

### ROS Integration
```cpp
// Example: Controlling a robot in Gazebo through ROS
#include <ros/ros.h>
#include <geometry_msgs/Twist.h>
#include <nav_msgs/Odometry.h>
#include <sensor_msgs/LaserScan.h>

class GazeboController
{
  public:
    GazeboController()
    {
      ros::NodeHandle nh;
      
      // Publisher for velocity commands
      vel_pub = nh.advertise<geometry_msgs::Twist>("/my_robot/cmd_vel", 1);
      
      // Subscriber for odometry
      odom_sub = nh.subscribe("/my_robot/odom", 1, &GazeboController::odomCallback, this);
      
      // Subscriber for laser scan
      laser_sub = nh.subscribe("/my_robot/scan", 1, &GazeboController::laserCallback, this);
    }
    
    void moveRobot(double linear_vel, double angular_vel)
    {
      geometry_msgs::Twist cmd;
      cmd.linear.x = linear_vel;
      cmd.angular.z = angular_vel;
      vel_pub.publish(cmd);
    }
    
  private:
    ros::Publisher vel_pub;
    ros::Subscriber odom_sub;
    ros::Subscriber laser_sub;
    
    void odomCallback(const nav_msgs::Odometry::ConstPtr& msg)
    {
      // Process odometry data
      ROS_INFO("Robot pose: (%.2f, %.2f)", msg->pose.pose.position.x, msg->pose.pose.position.y);
    }
    
    void laserCallback(const sensor_msgs::LaserScan::ConstPtr& msg)
    {
      // Process laser scan data for obstacle detection
      // Example: Check for obstacles ahead
      if (msg->ranges[msg->ranges.size()/2] < 1.0) {
        ROS_WARN("Obstacle detected ahead!");
      }
    }
};
```

### Direct Gazebo Interface
```python
#!/usr/bin/env python3

import rospy
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
from gazebo_msgs.srv import SetModelState, GetModelState
from gazebo_msgs.msg import ModelState

class DirectGazeboController:
    def __init__(self):
        rospy.init_node('gazebo_controller')
        
        # Service proxies for model state
        rospy.wait_for_service('/gazebo/set_model_state')
        rospy.wait_for_service('/gazebo/get_model_state')
        
        self.set_state = rospy.ServiceProxy('/gazebo/set_model_state', SetModelState)
        self.get_state = rospy.ServiceProxy('/gazebo/get_model_state', GetModelState)
        
        # Publishers and subscribers
        self.cmd_pub = rospy.Publisher('/my_robot/cmd_vel', Twist, queue_size=1)
        
    def move_to_position(self, target_x, target_y):
        """Move robot to target position using simple control"""
        rate = rospy.Rate(10)  # 10 Hz
        
        while not rospy.is_shutdown():
            # Get current robot state
            try:
                state = self.get_state('my_robot', 'world')
                current_x = state.pose.position.x
                current_y = state.pose.position.y
                
                # Calculate error
                dx = target_x - current_x
                dy = target_y - current_y
                distance = (dx**2 + dy**2)**0.5
                
                # Control law
                cmd = Twist()
                cmd.linear.x = min(0.5, distance * 0.5)  # Proportional controller
                cmd.angular.z = 3.0 * (math.atan2(dy, dx) - 0)  # Heading control
                
                # Publish command
                self.cmd_pub.publish(cmd)
                
                if distance < 0.1:  # Close enough
                    cmd.linear.x = 0
                    cmd.angular.z = 0
                    self.cmd_pub.publish(cmd)
                    break
                    
            except rospy.ServiceException as e:
                print(f"Service call failed: {e}")
            
            rate.sleep()
```

## Gazebo Integration with ROS

### Launch Files
```xml
<!-- launch/gazebo_simulation.launch -->
<launch>
  <!-- Start Gazebo with world -->
  <include file="$(find gazebo_ros)/launch/empty_world.launch">
    <arg name="world_name" value="$(find my_robot_pkg)/worlds/maze.world"/>
    <arg name="paused" value="false"/>
    <arg name="use_sim_time" value="true"/>
    <arg name="gui" value="true"/>
    <arg name="headless" value="false"/>
    <arg name="debug" value="false"/>
  </include>
  
  <!-- Spawn robot in Gazebo -->
  <param name="robot_description" command="$(find xacro)/xacro.py $(find my_robot_pkg)/urdf/my_robot.xacro" />
  
  <node name="spawn_urdf" pkg="gazebo_ros" type="spawn_model" 
        args="-param robot_description -urdf -model my_robot 
              -x 0 -y 0 -z 0.1" 
        respawn="false" output="screen"/>
  
  <!-- Robot state publisher -->
  <node name="robot_state_publisher" pkg="robot_state_publisher" 
        type="robot_state_publisher"/>
  
  <!-- Joint state publisher -->
  <node name="joint_state_publisher" pkg="joint_state_publisher" 
        type="joint_state_publisher">
    <param name="use_gui" value="false"/>
  </node>
</launch>
```

### Controller Configuration
```yaml
# config/my_robot_control.yaml
my_robot:
  # Publish all joint states
  joint_state_controller:
    type: joint_state_controller/JointStateController
    publish_rate: 50
  
  # Position controllers for joints
  left_wheel_position_controller:
    type: effort_controllers/JointPositionController
    joint: left_wheel_hinge
    pid: {p: 100.0, i: 0.01, d: 10.0}
  
  right_wheel_position_controller:
    type: effort_controllers/JointPositionController
    joint: right_wheel_hinge
    pid: {p: 100.0, i: 0.01, d: 10.0}
```

### Control Launch
```xml
<!-- launch/control.launch -->
<launch>
  <!-- Load controller configurations -->
  <rosparam file="$(find my_robot_pkg)/config/my_robot_control.yaml" 
            command="load"/>
  
  <!-- Load the controllers -->
  <node name="controller_spawner" pkg="controller_manager" 
        type="spawner" respawn="false"
        output="screen" 
        args="joint_state_controller
              left_wheel_position_controller
              right_wheel_position_controller"/>
  
  <!-- Velocity mux for teleoperation -->
  <node pkg="nodelet" type="nodelet" name="mobile_base_nodelet_manager" 
        args="manager"/>
  <node pkg="nodelet" type="nodelet" name="cmd_vel_mux" 
        args="load yocs_cmd_vel_mux/CmdVelMuxNodelet mobile_base_nodelet_manager">
    <param name="yaml_cfg_file" 
           value="$(find my_robot_pkg)/param/cmd_vel_mux.yaml"/>
  </node>
</launch>
```

## Simulation Scenarios

### Navigation Simulation
```python
#!/usr/bin/env python3

import rospy
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal
from geometry_msgs.msg import Pose, Point, Quaternion
import tf.transformations as tft

class NavigationSimulator:
    def __init__(self):
        rospy.init_node('navigation_simulator')
        
        # Setup move_base client
        self.client = actionlib.SimpleActionClient('move_base', MoveBaseAction)
        rospy.loginfo("Waiting for move_base server...")
        self.client.wait_for_server()
        rospy.loginfo("Connected to move_base server")
    
    def navigate_to_pose(self, x, y, theta):
        """Send navigation goal to move_base"""
        goal = MoveBaseGoal()
        goal.target_pose.header.frame_id = "map"
        goal.target_pose.header.stamp = rospy.Time.now()
        
        # Set position
        goal.target_pose.pose.position = Point(x, y, 0.0)
        
        # Set orientation (convert theta to quaternion)
        quaternion = tft.quaternion_from_euler(0, 0, theta)
        goal.target_pose.pose.orientation = Quaternion(*quaternion)
        
        # Send goal and wait for result
        rospy.loginfo(f"Sending goal to ({x}, {y}, {theta})")
        self.client.send_goal(goal)
        wait_result = self.client.wait_for_result(rospy.Duration(60))  # Wait up to 60 seconds
        
        if not wait_result:
            self.client.cancel_goal()
            rospy.loginfo("Action did not finish within time limit")
            return False
        else:
            state = self.client.get_state()
            if state == actionlib.GoalStatus.SUCCEEDED:
                rospy.loginfo("Goal reached successfully")
                return True
            else:
                rospy.loginfo(f"Navigation failed with state: {state}")
                return False

if __name__ == '__main__':
    nav_sim = NavigationSimulator()
    
    # Define navigation goals
    goals = [
        (2.0, 2.0, 0.0),
        (4.0, 3.0, 1.57),
        (1.0, 4.0, 3.14),
        (0.0, 0.0, 0.0)  # Return to start
    ]
    
    for goal in goals:
        success = nav_sim.navigate_to_pose(*goal)
        if not success:
            rospy.logwarn(f"Failed to reach goal {goal}")
        rospy.sleep(2.0)  # Wait between goals
```

### Object Detection Testing
```cpp
// Example plugin for testing object detection in simulation
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo/sensors/sensors.hh>

namespace gazebo
{
  class ObjectDetectionTester : public WorldPlugin
  {
    public: void Load(physics::WorldPtr _world, sdf::ElementPtr _sdf)
    {
      this->world = _world;
      this->sdf = _sdf;
      
      // Create objects to test detection
      this->create_test_objects();
      
      // Connect to pre-render event to update objects
      this->connections.push_back(
          event::Events::ConnectPreRender(
              std::bind(&ObjectDetectionTester::OnUpdate, this)));
    }
    
    private: void create_test_objects()
    {
      // Create random obstacles
      for (int i = 0; i < 10; ++i) {
        // Create a unique model name
        std::string name = "test_object_" + std::to_string(i);
        
        // Create SDF for a simple object
        sdf::ElementPtr modelSDF(new sdf::Element);
        modelSDF->SetName("model");
        modelSDF->GetAttribute("name")->Set(name);
        
        // Add pose
        sdf::ElementPtr poseSDF(new sdf::Element);
        poseSDF->SetName("pose");
        math::Pose pose(
          math::Vector3(i * 1.0, 0, 0.5),  // Position
          math::Vector3(0, 0, 0));         // Orientation
        poseSDF->Set(pose);
        modelSDF->InsertElement(poseSDF);
        
        // Add link with geometry
        sdf::ElementPtr linkSDF(new sdf::Element);
        linkSDF->SetName("link");
        linkSDF->GetAttribute("name")->Set("link");
        
        sdf::ElementPtr collisionSDF(new sdf::Element);
        collisionSDF->SetName("collision");
        collisionSDF->GetAttribute("name")->Set("collision");
        
        sdf::ElementPtr geometrySDF(new sdf::Element);
        geometrySDF->SetName("geometry");
        
        sdf::ElementPtr boxSDF(new sdf::Element);
        boxSDF->SetName("box");
        
        sdf::ElementPtr sizeSDF(new sdf::Element);
        sizeSDF->SetName("size");
        math::Vector3 size(0.2, 0.2, 0.2);
        sizeSDF->Set(size);
        
        boxSDF->InsertElement(sizeSDF);
        geometrySDF->InsertElement(boxSDF);
        collisionSDF->InsertElement(geometrySDF);
        linkSDF->InsertElement(collisionSDF);
        
        modelSDF->InsertElement(linkSDF);
        
        // Spawn the object
        this->world->InsertModelSDF(*modelSDF);
      }
    }
    
    private: void OnUpdate()
    {
      // Animation or update logic for test objects
      static double time = 0;
      time += 0.001; // Assuming 1000Hz update rate
      
      // Move objects in a pattern for detection testing
      for (int i = 0; i < 10; ++i) {
        std::string name = "test_object_" + std::to_string(i);
        physics::ModelPtr model = this->world->ModelByName(name);
        if (model) {
          // Move in a circular pattern
          double x = 5.0 + 3.0 * cos(time + i * 0.5);
          double y = 3.0 * sin(time + i * 0.5);
          model->SetWorldPose(math::Pose(x, y, 0.5, 0, 0, 0));
        }
      }
    }
    
    private: physics::WorldPtr world;
    private: sdf::ElementPtr sdf;
    private: std::vector<event::ConnectionPtr> connections;
  };
  
  GZ_REGISTER_WORLD_PLUGIN(ObjectDetectionTester)
}
```

## Best Practices

### Performance Optimization
```bash
# Simulation optimization tips:
# 1. Use appropriate physics step size (typically 0.001s)
# 2. Limit real-time factor if fast simulation isn't needed
# 3. Reduce visual complexity when running headless
# 4. Use simpler collision geometries when possible
# 5. Limit the number of active sensors
# 6. Use Level of Detail (LOD) models when available
```

### Model Design
1. **Collision Simplification**: Use simpler collision models than visual models
2. **Inertial Properties**: Accurately specify mass and moments of inertia
3. **Joint Limits**: Define realistic joint limits and dynamics
4. **Sensor Placement**: Position sensors realistically on the robot
5. **Computational Efficiency**: Balance realism with simulation speed

### Debugging
```xml
<!-- Add debugging information to models -->
<model name="debug_robot">
  <!-- Make links transparent for visualization -->
  <link name="chassis">
    <visual name="visual">
      <transparency>0.5</transparency>
      <!-- other visual properties -->
    </visual>
  </link>
  
  <!-- Add coordinate frames for debugging -->
  <static>0</static>  <!-- Set to 1 to visualize coordinate frames -->
</model>
```

### Validation
- Compare simulation results with real-world experiments
- Verify physics parameters match real hardware
- Test edge cases in simulation before real deployment
- Validate sensor models against real sensor behavior

## Quiz

1. What are the main components of Gazebo's architecture?
2. Explain the difference between SDF and URDF in the context of Gazebo.
3. What are the key physics parameters that affect simulation stability?
4. How does Gazebo integrate with ROS for robot simulation?
5. Name three best practices for optimizing Gazebo simulation performance.

## Hands-on Lab

### Lab: Creating a Gazebo Robot Simulation
- Design a simple robot model in SDF/URDF format
- Create a custom world environment with obstacles
- Implement a basic navigation task in simulation
- Integrate ROS control nodes with the simulated robot
- Test the robot's perception and navigation in different scenarios

### Objectives:
- Create and configure a robot model for Gazebo
- Design custom environments for testing
- Implement robot control in simulation
- Validate simulation results against expected behavior
- Deploy and test ROS nodes in the simulation environment