---
title: "ادراک اور وژن (اردو ایڈوانسڈ)"
sidebar_position: 4
---

# ادراک اور وژن (اردو ایڈوانسڈ ورژن)

## باب کا جائزہ

ادراک اور وژن خودکار روبوٹک سسٹم کا بنیادی ستون ہے، جو ماحول کی تصویری اور حسی ڈیٹا کی تشریح اور سمجھ کو فعال کرتا ہے۔ اعلیٰ درجے کے ادراک کے نظام متعدد سینسر موڈلز، پیچیدہ الگورتھم، اور گہری سیکھنے کی تکنیکس کو اکٹھا کرتے ہیں تاکہ ماحول کی سمجھ میں انسانی سطح یا اس سے بہتر کارکردگی حاصل کی جا سکے۔ یہ باب روبوٹک ادراک اور کمپیوٹر وژن میں ریاضی کی بنیادوں، الگورتھمک ایجادوں، اور جدید ترین تکنیکس کا جائزہ لیتا ہے۔

### ریاضی کی بنیادیں

روبوٹک ادراک کئی جدید ریاضی کے ڈھانچوں پر منحصر ہے:

**بےزین ایسٹیمیشن:**
- بعدی امکانات: p(x|z) = p(z|x) × p(x) / p(z)
- جہاں x حالت کی نمائندگی کرتا ہے، z مشاہدات کی نمائندگی کرتا ہے
- ٹریکنگ، میپنگ، اور مقام کی وضاحت کے لیے بنیاد تشکیل دیتا ہے

**جیومیٹرک کمپیوٹر وژن:**
- کیمرہ ماڈلز کے لیے پروجیکٹو جیومیٹری
- سٹیریو وژن کے لیے ایپی پولر جیومیٹری
- 3D دوبارہ تعمیر کے لیے ملٹی- ویو جیومیٹری

**اپٹیمائزیشن تھیوری:**
- پیرامیٹر ایسٹیمیشن کے لیے لیسٹ سکویئرز
- آؤٹ لائرز کو مسترد کرنے کے لیے مضبوط ایسٹیمیشن (RANSAC، M-ایسٹیمیٹرز)
- بندل ایڈجسٹمنٹ کے لیے غیر لکیری اپٹیمائزیشن

## جدید کیمرہ ماڈلز اور کیلیبریشن

### پن ہول کیمرہ ماڈل

پن ہول کیمرہ ماڈل 3D نقاط کو 2D امیج کوآرڈینیٹس میں پروجیکٹ کرنا ریاضیاتی طور پر ظاہر کرتا ہے:

```
[x]     [fx  0  cx] [X]
[y] =   [0   fy cy] [Y] * (1/Z)
[1]     [0   0  1 ] [Z]
```

جہاں (fx, fy) فوکل لمبائیاں ہیں، (cx, cy) مرکزی پوائنٹ کے نقاط ہیں، اور (X, Y, Z) 3D پوائنٹ ہے۔

### بگاڑ ماڈلز

حقیقی کیمرے ردیل اور ٹینجنٹل بگاڑ کا مظاہرہ کرتے ہیں:

```python
def apply_distortion(x, y, k1, k2, k3, p1, p2):
    """
    نارملائزڈ امیج کوآرڈینیٹس پر ردیل اور ٹینجنٹل بگاڑ لاگو کریں
    
    Args:
        x, y: نارملائزڈ امیج کوآرڈینیٹس
        k1, k2, k3: ردیل بگاڑ کوائف
        p1, p2: ٹینجنٹل بگاڑ کوائف
    
    Returns:
        xd, yd: بگڑے ہوئے کوآرڈینیٹس
    """
    r_squared = x**2 + y**2
    radial_distortion = 1 + k1*r_squared + k2*r_squared**2 + k3*r_squared**3
    tangential_distortion_x = 2*p1*x*y + p2*(r_squared + 2*x**2)
    tangential_distortion_y = p1*(r_squared + 2*y**2) + 2*p2*x*y
    
    xd = x*radial_distortion + tangential_distortion_x
    yd = y*radial_distortion + tangential_distortion_y
    
    return xd, yd
```

### ملٹی-کیمرہ سسٹم

سٹیریو وژن اور ملٹی- ویو سسٹم کے لیے:

**ایپی پولر جیومیٹری:**
- بنیادی میٹرکس F: x'^T * F * x = 0
- ایسینشل میٹرکس E: x'^T * E * x = 0 (کیلیبریٹڈ کیمرز کے لیے)
- پوائنٹ مطابقت کے لیے ایپی پولر ریسٹرکشن

**ریکٹیفکیشن:**
- سٹیریو امیجز کو تبدیل کریں تاکہ ایپی پولر لائنز افقی ہوں
- بے واسطہ کمپیوٹیشن کو سادہ بنائیں
- کمپیوٹیشنل پیچیدگی کو کم کریں

## جدید امیج پروسیسنگ تکنیکس

### فیچر ڈیٹیکشن اور ڈیسکرپشن

جدید فیچر ڈیٹیکشن الگورتھم میں شامل ہیں:

**SIFT (سکیل-ان ویرینٹ فیچر ٹرانسفارم):**
```python
import cv2
import numpy as np

def detect_sift_features(image):
    """ایک امیج میں SIFT فیچرز کا پتہ لگائیں"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # SIFT ڈیٹیکٹر بنائیں
    sift = cv2.SIFT_create()
    
    # کی پوائنٹس کو ڈیٹیکٹ اور ڈسکرپٹرز کو کمپیوٹ کریں
    keypoints, descriptors = sift.detectAndCompute(gray, None)
    
    return keypoints, descriptors
```

**ORB (اورینٹیڈ FAST اور روٹیٹڈ BRIEF):**
- SIFT کی تیز تقریب
- کارکردگی کے مطابق میچنگ کے لیے بائنری ڈسکریپٹرز
- ریل ٹائم ایپلی کیشنز کے لیے مناسب

**ڈیپ فیچر ایکسٹریکٹرز:**
- فیچر نکالنے کے لیے کنولوشنل نیورل نیٹ ورکس
- سیکھی ہوئی نمائندگیاں اکثر ہاتھ سے بنائی گئی فیچرز سے بہتر ہوتی ہیں
- مثالیں: VGG، ResNet، EfficientNet فیچرز

### جدید ترین چھانٹنے کی تکنیکس

**حالت کی ایسٹیمیشن کے لیے کلمن فلٹر:**

```python
class KalmanFilter:
    def __init__(self, state_dim, obs_dim):
        self.state_dim = state_dim
        self.obs_dim = obs_dim
        
        # حالت منتقلی ماڈل (کن سٹنٹ ویلوسٹی ماڈل)
        self.F = np.eye(state_dim)
        dt = 1.0  # ٹائم سٹیپ
        self.F[0, 2] = dt  # x ویلوسٹی کی وجہ سے موضع متاثر ہوتا ہے
        self.F[1, 3] = dt  # y ویلوسٹی کی وجہ سے موضع متاثر ہوتا ہے
        
        # مشاہدہ ماڈل
        self.H = np.zeros((obs_dim, state_dim))
        self.H[0, 0] = 1  # x موضع دیکھنا
        self.H[1, 1] = 1  # y موضع دیکھنا
        
        # عمل اور مشاہدہ نوائز
        self.Q = np.eye(state_dim) * 0.1  # عمل نوائز
        self.R = np.eye(obs_dim) * 1.0   # مشاہدہ نوائز
        
        # ابتدائی حالت اور کوواریئنس
        self.x = np.zeros(state_dim)
        self.P = np.eye(state_dim) * 1000.0  # غیر یقینی ابتدائی حالت

    def predict(self):
        """پریڈکشن اسٹیپ"""
        # حالت کی پریڈکٹ کریں
        self.x = self.F @ self.x
        
        # کوواریئنس کی پریڈکٹ کریں
        self.P = self.F @ self.P @ self.F.T + self.Q

    def update(self, z):
        """اپ ڈیٹ اسٹیپ میش از مشاہدہ z"""
        # اینوویشن
        y = z - self.H @ self.x
        
        # اینوویشن کوواریئنس
        S = self.H @ self.P @ self.H.T + self.R
        
        # کلمن گین
        K = self.P @ self.H.T @ np.linalg.inv(S)
        
        # حالت کی اپ ڈیٹ کریں
        self.x = self.x + K @ y
        
        # کوواریئنس کی اپ ڈیٹ کریں
        self.P = (np.eye(len(self.x)) - K @ self.H) @ self.P
```

**غیر لکیری سسٹم کے لیے پارٹیکل فلٹر:**

```python
class ParticleFilter:
    def __init__(self, state_dim, num_particles=1000):
        self.state_dim = state_dim
        self.num_particles = num_particles
        
        # پارٹیکلز شروع کریں
        self.particles = np.random.normal(0, 1, (num_particles, state_dim))
        self.weights = np.ones(num_particles) / num_particles

    def predict(self, motion_model, noise_std):
        """موشن اپ ڈیٹ اسٹیپ"""
        for i in range(len(self.particles)):
            # نوائز کے ساتھ موشن ماڈل لاگو کریں
            self.particles[i] = motion_model(self.particles[i]) + np.random.normal(0, noise_std, self.state_dim)

    def update(self, observation, observation_model, observation_noise_std):
        """میسجمنٹ اپ ڈیٹ اسٹیپ"""
        for i in range(len(self.particles)):
            # پریڈکٹڈ مشاہدہ کمپیوٹ کریں
            predicted_obs = observation_model(self.particles[i])
            
            # اصل مشاہدہ کی لائیک لی ہوڈ کمپیوٹ کریں
            likelihood = np.exp(-0.5 * ((observation - predicted_obs) / observation_noise_std)**2)
            self.weights[i] *= likelihood
        
        # ویٹس نارملائز کریں
        self.weights += 1e-300  # نیومیرکل مسائل سے بچیں
        self.weights /= np.sum(self.weights)

    def resample(self):
        """ویٹس کے مطابق پارٹیکلز کو دوبارہ نمونہ لیں"""
        indices = np.random.choice(len(self.particles), size=len(self.particles), p=self.weights)
        self.particles = self.particles[indices]
        self.weights = np.ones(len(self.particles)) / len(self.particles)

    def estimate(self):
        """پارٹیکلز سے حالت ایسٹیمیٹ کمپیوٹ کریں"""
        return np.average(self.particles, axis=0, weights=self.weights)
```

## جدید ترین آبجیکٹ ڈیٹیکشن اور ریکوگنیشن

### جدید ترین ڈیپ لرننگ آرکیٹیکچر

**YOLO (یو اونلی لوک ایٹنس) - ریل ٹائم ڈیٹیکشن:**

```python
import torch
import torch.nn as nn

class YOLOv5(nn.Module):
    def __init__(self, num_classes=80, anchors=None):
        super(YOLOv5, self).__init__()
        
        if anchors is None:
            anchors = [[10,13, 16,30, 33,23],   # P3/8
                       [30,61, 62,45, 59,119],  # P4/16
                       [116,90, 156,198, 373,326]]  # P5/32
        
        self.num_classes = num_classes
        self.num_anchors = len(anchors[0]) // 2
        
        # بیک بون، نیک، اور ہیڈز CSPDarknet، PAN، وغیرہ کے ذریعے نافذ کیے جاتے ہیں
        # سادہ نمائندگی
        self.backbone = self._build_backbone()
        self.neck = self._build_neck()
        self.head = self._build_head()
    
    def forward(self, x):
        # فارورڈ پاس بیک بون، نیک، اور ہیڈ کے ذریعے
        features = self.backbone(x)
        neck_features = self.neck(features)
        outputs = self.head(neck_features)
        return outputs
    
    def _build_backbone(self):
        # CSPDarknet53 یا اس جیسی تعمیر
        return nn.Identity()  # جگہ کے لیے
    
    def _build_neck(self):
        # PAN (پاتھ ایگری گیشن نیٹ ورک)
        return nn.Identity()  # جگہ کے لیے
    
    def _build_head(self):
        # ڈیٹیکشن ہیڈ
        return nn.Identity()  # جگہ کے لیے
```

**R-CNN فیملی - درست ڈیٹیکشن:**
- Faster R-CNN: ریجن پروپوزل نیٹ ورک + ڈیٹیکشن نیٹ ورک
- Mask R-CNN: انسٹینس سیگمینٹیشن توسیع
- Cascade R-CNN: ملٹی- اسٹیج الری فکیشن

### 3D آبجیکٹ ڈیٹیکشن

**LiDAR-بیسڈ ڈیٹیکشن:**
- پوائنٹ کلاؤڈ پروسیسنگ کے لیے PointNet، PointNet++
- برڈز ایم ویو نمائندگی کے لیے VoxelNet
- SECOND (سپارسی ایم بیڈڈ کنولوشنل ڈیٹیکشن) کے لیے

**ملٹی- موڈل فیوژن:**
- امیج کی جگہ میں LiDAR پوائنٹس پروجیکٹ کریں
- RGB اور ڈیپتھ کی معلومات کو جوڑیں
- کراس- موڈل اٹینشن میکنزمز

## ویژل SLAM اور لوکلائزیشن

### جدید ترین SLAM تکنیکس

**ڈائریکٹ میتھڈس vs. فیچر-بیسڈ میتھڈس:**
- ڈائریکٹ میتھڈس: پکسل انٹینسٹیز کو براہ راست استعمال کریں (LSD-SLAM، DSO)
- فیچر-بیسڈ: فیچرز نکالیں اور ٹریک کریں (ORB-SLAM، SVO)

**ORB-SLAM تعمیر:**
```python
class ORB_SLAM:
    def __init__(self):
        self.tracker = FeatureTracker()
        self.localizer = PoseLocalizer()
        self.mapper = MapBuilder()
        self.loop_detector = LoopClosureDetector()
        
        self.map = Map()
        self.keyframes = []
        self.mappoints = []
    
    def process_frame(self, image, timestamp):
        # ORB فیچرز نکالیں
        features = self.tracker.extract_features(image)
        
        # پوز کا اندازہ لگائیں
        pose = self.localizer.estimate_pose(features, self.map)
        
        # ضرورت کے مطابق کی فریم شامل کریں
        if self.should_add_keyframe(pose):
            keyframe = self.create_keyframe(image, pose, features)
            self.map.add_keyframe(keyframe)
            
            # میپ کو اپٹیمائز کریں
            self.mapper.optimize_map()
            
            # لوپ بندش کے لیے چیک کریں
            if self.loop_detector.detect_loop(keyframe):
                self.handle_loop_closure()
    
    def should_add_keyframe(self, pose):
        # کی فریم شامل کرنے کے لیے فیصلہ کرنا
        # ٹریکنگ کی کارکردگی، حرکت، وغیرہ کے مطابق
        pass
```

### ملٹی- کیمرہ اور ملٹی- روبوٹ SLAM

**سٹیریو SLAM:**
- اسکیل بازیابی کے لیے سٹیریو کیمرہ استعمال کریں
- مونو کلر کے مقابلے میں بہتر ڈیپتھ ایسٹیمیشن
- براہ راست ڈیپتھ پیمائش کی وجہ سے ڈرائیف کم ہوتا ہے

**ملٹی- روبوٹ SLAM:**
- متعدد روبوٹس کے درمیان میپنگ کو مربوط کریں
- لینڈ مارکس اور پوزز کو شیئر کریں
- تقسیم شدہ اپٹیمائزیشن کی تکنیکس

## ادراک میں ڈیپ لرننگ

### وژن کے لیے کنولوشنل نیورل نیٹ ورکس

**آرکیٹیکچرل ایجادیں:**
- ریزیڈوئل کنیکشنز (ResNet)
- اٹینشن میکنزم (ویژن ٹرانسفارمر)
- کارآمد تعمیرات (EfficientNet، MobileNet)

**ٹریننگ کی حکمت عمل:**
- مضبوطی کے لیے ڈیٹا اگومنٹیشن
- پہلے سے ٹرینڈ ماڈلز سے ٹرینس فر لرننگ
- سیم-ٹو-ریل ٹرانسفر کے لیے ڈومین اڈاپٹیشن

### سیمینٹک سیگمینٹیشن

```python
import torch
import torch.nn as nn
import torchvision.models as models

class SemanticSegmentation(nn.Module):
    def __init__(self, num_classes):
        super(SemanticSegmentation, self).__init__()
        
        # ایک پہلے سے ٹرینڈ بیک بون استعمال کریں
        backbone = models.resnet50(pretrained=True)
        self.backbone = nn.Sequential(*list(backbone.children())[:-2])
        
        # سیگمینٹیشن ہیڈ شامل کریں
        self.segmentation_head = nn.Sequential(
            nn.Conv2d(2048, 512, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, num_classes, kernel_size=1)
        )
        
        # اصل سائز میں اپ سیمیل کریں
        self.upsample = nn.Upsample(scale_factor=32, mode='bilinear', align_corners=False)
    
    def forward(self, x):
        features = self.backbone(x)
        seg_features = self.segmentation_head(features)
        output = self.upsample(seg_features)
        return output
```

### ویژن ٹرانسفارمرز

ویژن ٹرانسفارمرز (ViTs) CNNs کے متبادل کے طور پر سامنے آئے ہیں:

```python
import torch
import torch.nn as nn

class VisionTransformer(nn.Module):
    def __init__(self, image_size=224, patch_size=16, num_classes=1000, dim=768, depth=12, heads=12):
        super().__init__()
        
        num_patches = (image_size // patch_size) ** 2
        patch_dim = 3 * patch_size ** 2
        
        self.patch_size = patch_size
        self.pos_embedding = nn.Parameter(torch.randn(1, num_patches + 1, dim))
        self.patch_to_embedding = nn.Linear(patch_dim, dim)
        self.cls_token = nn.Parameter(torch.randn(1, 1, dim))
        
        self.transformer = nn.Transformer(dim, heads, depth)
        self.to_cls_token = nn.Identity()
        
        self.mlp_head = nn.Sequential(
            nn.LayerNorm(dim),
            nn.Linear(dim, num_classes)
        )
    
    def forward(self, img):
        p = self.patch_size
        
        # امیج کو پیچز میں تقسیم کریں
        x = img.unfold(2, p, p).unfold(3, p, p).contiguous()
        x = x.view(img.shape[0], img.shape[1], -1, p, p)
        x = x.permute(0, 2, 1, 3, 4).contiguous().view(img.shape[0], -1, p*p*3)
        
        # پیچز میں ایمبیڈ کریں
        tokens = self.patch_to_embedding(x)
        
        # کلاس ٹوکن شامل کریں
        cls_tokens = self.cls_token.expand(img.shape[0], -1, -1)
        tokens = torch.cat((cls_tokens, tokens), dim=1)
        
        # پوزیشنل ایمبیڈنگ شامل کریں
        tokens += self.pos_embedding[:, :(tokens.shape[1])]
        
        # ٹرانسفارمر لاگو کریں
        out = self.transformer(tokens)
        out = self.to_cls_token(out[:, 0])
        
        return self.mlp_head(out)
```

## سینسر فیوژن کی تکنیکس

### کلمن فلٹر ویرئنٹس

**ایکسٹینڈیڈ کلمن فلٹر (EKF):**
غیر لکیری سسٹم کے لیے، موجودہ حالت کے اندازے کے گرد لکیریائز کریں:
```
F_k = ∂f/∂x |_{x=x_{k|k-1}}
H_k = ∂h/∂x |_{x=x_{k|k-1}}
```

**ان سیکٹیڈ کلمن فلٹر (UKF):**
غیر یقینی تقسیم کو زیادہ درست طور پر قبضہ کرنے کے لیے ڈیٹرمنسٹک سیمپلنگ استعمال کرتا ہے:
- سگما پوائنٹس اوسط اور کوواریئنس کو قبضہ کرتے ہیں
- غیر لکیری تبدیلی احصاء کو بہتر طور پر محفوظ رکھتی ہے

**انفارمیشن فلٹر:**
کلمن فلٹر کا دوسرہ، جو انفارمیشن حالت اور میٹرکس کو استعمال کرتا ہے:
- کوواریئنس میٹرکس کا الٹا (انفارمیشن میٹرکس)
- ڈسٹری بیوٹڈ فیوژن کے لیے مفید

### جدید ترین فیوژن الگورتھم

**ڈسٹری بیوٹڈ فیوژن:**
- ملٹی- روبوٹ سسٹم کے لیے کنسس بیسڈ فیوژن
- نامعلوم تعلقات کے لیے کوواریئنس انٹرسیکشن
- باؤنڈیڈ- ان سرٹینٹی سسٹم کے لیے کوواریئنس یونین

**فیکٹر گریف:**
- ایسٹیمیشن کے مسائل کو گریف کے طور پر ظاہر کرنا
- کارآمد اپٹیمائزیشن الگورتھم (GTSAM، Ceres)
- پیچیدہ انحصار اور رکاوٹوں کو ہینڈل کرنا

```python
# مثال: پوز گریف اپٹیمائزیشن کے لیے فیکٹر گریف
import gtsam

def build_pose_graph(poses, observations):
    """پوز گریف اپٹیمائزیشن کے لیے ایک فیکٹر گریف بنائیں"""
    graph = gtsam.NonlinearFactorGraph()
    initial_estimate = gtsam.Values()
    
    # پوز ایسٹیمیٹس شامل کریں
    for i, pose in enumerate(poses):
        initial_estimate.insert(gtsam.Pose3(gtsam.Point3(*pose[:3]), 
                                          gtsam.Rot3.Quaternion(*pose[3:])))
    
    # اودومیٹری فیکٹرز شامل کریں
    for i in range(len(poses) - 1):
        odometry_noise = gtsam.noiseModel.Diagonal.Sigmas([0.1, 0.1, 0.1, 0.1, 0.1, 0.1])
        odometry_factor = gtsam.BetweenFactorPose3(i, i+1, 
                                                  gtsam.Pose3(),  # اصل اودومیٹر
                                                  odometry_noise)
        graph.push_back(odometry_factor)
    
    # لینڈ مارک فیکٹرز شامل کریں
    for obs in observations:
        landmark_noise = gtsam.noiseModel.Diagonal.Sigmas([0.1, 0.1, 0.1])
        landmark_factor = gtsam.PriorFactorPose3(obs['pose_id'], 
                                                gtsam.Pose3(),  # مشاہدہ کردہ پوز
                                                landmark_noise)
        graph.push_back(landmark_factor)
    
    return graph, initial_estimate
```

## اطلاقات اور اصل دنیا کی چیلنجز

### متحرک ماحول میں ادراک

**متحرک آبجیکٹ ڈیٹیکشن:**
- متحرک اشیاء کو سٹیٹک ماحول سے الگ ٹریک کریں
- ایگو- موشن کے لیے موشن کمپن سیشن
- مستقبل کے ٹریجکٹریز کی پیشن گوئی کریں

**موسم کی ایڈاپٹیشن:**
- بارش، دھندلا، اور برف کا سینسر کی کارکردگی پر اثر ہوتا ہے
- ڈومین ایڈاپٹیشن کی تکنیکس
- مضبوطی کے لیے ملٹی- موڈل سینسنگ

### کمپیوٹیشنل آپٹیمائزیشن

**ریل ٹائم کارکردگی:**
- کارآمد تعمیرات (MobileNet، ShuffleNet)
- ماڈل کو گھٹانا اور کاٹنا
- ہارڈ ویئر ایکسلریشن (GPUs، TPUs، ایج AI چپس)

**ایج کمپیوٹنگ:**
- ایمبیڈڈ ڈیوائسز پر ماڈلز کو ڈپلوئے کریں
- فیڈریٹڈ لرننگ برائے تقسیم شدہ ٹریننگ
- آن-ڈیوائس انفرنیس آپٹیمائزیشن

## جائزہ میٹرکس

### ڈیٹیکشن میٹرکس
- **مین ایوریج پریشین (mAP)**: آبجیکٹ ڈیٹیکشن کے لیے معیاری میٹرک
- **انٹرسیکشن اوور یونین (IoU)**: پریڈکٹ کردہ اور زمینی حقیقت کے باکسز کے درمیان اوور لیپ
- **پریشین-ریکال کریوز**: پریشین اور ریکال کے درمیان تنازعہ

### SLAM میٹرکس
- **ATE (ایبسولوٹ ٹریجکٹری ایرر)**: اندازہ کردہ ٹریجکٹری کی دقت
- **RPE (ریلیٹیو پوز ایرر)**: ریلیٹیو پوزز کی دقت
- **ڈرائیف**: وقت کے ساتھ جمع ہونے والی غلطی

## کلیدی نکات

- اعلیٰ معیار کا ادراک مضبوط ریاضی کی بنیادوں پر منحصر ہے
- جدید ترین ڈیٹیکشن ڈیپ لرننگ آرکیٹیکچر استعمال کرتا ہے
- SLAM کمپیوٹر وژن اور کنٹرول تھیوری کو جوڑتا ہے
- سینسر فیوژن مضبوطی اور دقت میں اضافہ کرتا ہے
- اصل دنیا کے اطلاق کے لیے آپٹیمائزیشن اور ایڈاپٹیشن کی ضرورت ہوتی ہے
- جائزہ میٹرکس سسٹم کی ڈیزائن فیصلوں کی رہنمائی کرتا ہے

## جائزہ سوالات

1. EKF، UKF، اور پارٹیکل فلٹرز کے درمیان فرق کی وضاحت کریں ان کی ایپلیکیشنز اور کمپیوٹیشنل پیچیدگی کے لحاظ سے.
2. ایپی پولر ریسٹرکشن کیسے سٹیریو وژن سسٹم کو ڈیپتھ کا حساب لگانے میں مدد دیتا ہے؟
3. ڈائریکٹ vs. فیچر-بیسڈ ویژل SLAM کے نقطہ نظر کے فوائد اور نقصانات کیا ہیں؟
4. ایپی پولر جیومیٹری میں بنیادی میٹرکس کی ریاضیاتی فارمولیشن کی وضاحت کریں.
5. ویژن ٹرانسفارمرز کس طرح روایتی CNNs سے مختلف ہیں بصری معلومات کو پروسیس کرنے کے لحاظ سے؟