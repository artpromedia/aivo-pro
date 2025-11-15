"""Image content scanning for inappropriate content"""

from PIL import Image
import cv2
import numpy as np
from typing import Dict
import io


class ImageScanner:
    """Scan images for inappropriate content"""

    def __init__(self):
        self.nsfw_model = None

    async def load_model(self):
        """Load image classification model"""
        # In production, use models like Yahoo's Open NSFW
        # or Google Cloud Vision API
        print("✅ Image scanner initialized")

    async def scan(
        self,
        image_bytes: bytes,
        user_id: str,
        context: Dict
    ) -> Dict:
        """Scan image for inappropriate content"""
        try:
            # Load image
            image = Image.open(io.BytesIO(image_bytes))

            # Convert to RGB
            if image.mode != 'RGB':
                image = image.convert('RGB')

            # Basic checks
            width, height = image.size

            # Check image size (prevent huge uploads)
            if width > 4096 or height > 4096:
                return {
                    "approved": False,
                    "reason": "Image too large",
                    "max_size": "4096x4096"
                }

            # Check for text in image (OCR for PII)
            text_check = await self._check_text_in_image(image)

            if text_check["contains_pii"]:
                return {
                    "approved": False,
                    "reason": "Image contains personal information",
                    "detected_pii": text_check["pii_types"]
                }

            # Check for inappropriate content
            # In production, integrate actual NSFW detection
            safety_score = await self._calculate_safety_score(image)

            return {
                "approved": safety_score > 0.8,
                "safety_score": safety_score,
                "dimensions": {"width": width, "height": height},
                "format": image.format,
                "checks_passed": {
                    "size": True,
                    "pii": not text_check["contains_pii"],
                    "content": safety_score > 0.8
                }
            }

        except Exception as e:
            return {
                "approved": False,
                "reason": f"Image processing error: {str(e)}"
            }

    async def _check_text_in_image(self, image: Image) -> Dict:
        """Check for text and PII in image using Tesseract OCR"""
        try:
            import pytesseract
            from pytesseract import Output
            import re

            # Convert PIL Image to numpy array for OpenCV
            img_array = np.array(image)

            # Convert RGB to BGR for OpenCV
            if len(img_array.shape) == 3 and img_array.shape[2] == 3:
                img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

            # Preprocess for better OCR
            gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
            gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

            # Extract text using Tesseract
            text = pytesseract.image_to_string(gray)

            if not text.strip():
                return {
                    "contains_pii": False,
                    "pii_types": []
                }

            # Check for PII patterns
            pii_types = []

            # Email pattern
            if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
                pii_types.append("email")

            # Phone pattern (US format)
            if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text):
                pii_types.append("phone")

            # SSN pattern
            if re.search(r'\b\d{3}-\d{2}-\d{4}\b', text):
                pii_types.append("ssn")

            # Address pattern (simplified)
            if re.search(r'\b\d{1,5}\s+[\w\s]+\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln)\b', text, re.IGNORECASE):
                pii_types.append("address")

            return {
                "contains_pii": len(pii_types) > 0,
                "pii_types": pii_types,
                "text_detected": bool(text.strip())
            }

        except ImportError:
            # Tesseract not installed, log warning and return safe default
            print("⚠️ pytesseract not installed. Install with: pip install pytesseract")
            print("⚠️ Also install Tesseract-OCR: https://github.com/tesseract-ocr/tesseract")
            return {
                "contains_pii": False,
                "pii_types": [],
                "warning": "OCR not available"
            }
        except Exception as e:
            print(f"⚠️ OCR processing error: {str(e)}")
            return {
                "contains_pii": False,
                "pii_types": [],
                "error": str(e)
            }

    async def _calculate_safety_score(self, image: Image) -> float:
        """Calculate image safety score using basic content analysis"""
        try:
            # Convert to numpy array
            img_array = np.array(image)

            # Method 1: Skin tone detection (basic NSFW indicator)
            # This is a simplified approach - in production, use trained models like NudeNet
            hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)

            # Define skin tone range in HSV
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)

            # Create mask for skin tones
            skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
            skin_pixels = np.sum(skin_mask > 0)
            total_pixels = skin_mask.size
            skin_ratio = skin_pixels / total_pixels

            # Method 2: Check for excessive skin exposure
            # High skin ratio (>60%) could indicate inappropriate content
            if skin_ratio > 0.6:
                safety_score = 0.5
            elif skin_ratio > 0.4:
                safety_score = 0.7
            else:
                safety_score = 0.95

            # Method 3: Check image entropy (blurry/explicit detection)
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

            # Low variance might indicate blur or explicit content
            if laplacian_var < 50:
                safety_score = min(safety_score, 0.8)

            # Method 4: Check color distribution (bright colors often safe)
            avg_brightness = np.mean(img_array)
            if avg_brightness > 200:  # Very bright images are usually safe
                safety_score = max(safety_score, 0.85)

            return max(0.0, min(1.0, safety_score))

        except Exception as e:
            print(f"⚠️ Safety score calculation error: {str(e)}")
            # Return conservative score on error
            return 0.75

    async def _use_cloud_nsfw_detection(self, image: Image) -> float:
        """
        Advanced NSFW detection using cloud services (optional upgrade)

        Recommended integrations:
        1. NudeNet: https://github.com/notAI-tech/NudeNet
        2. Google Cloud Vision API (Safe Search)
        3. AWS Rekognition (Moderation Labels)
        4. Microsoft Azure Computer Vision (Adult Content Detection)

        Installation for NudeNet:
        pip install nudenet

        Usage example:
        from nudenet import NudeDetector
        detector = NudeDetector()
        result = detector.detect('image.jpg')
        """
        try:
            # Attempt to use NudeNet if available
            from nudenet import NudeDetector

            if not hasattr(self, '_nude_detector'):
                self._nude_detector = NudeDetector()

            # Save temp file for NudeNet
            import tempfile
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
                image.save(tmp.name)
                result = self._nude_detector.detect(tmp.name)

            # Calculate safety score from NudeNet results
            # NudeNet returns list of detected inappropriate content
            if not result:
                return 0.95

            # If any NSFW content detected, lower score
            max_confidence = max([item['score'] for item in result])
            safety_score = 1.0 - max_confidence

            return max(0.0, min(1.0, safety_score))

        except ImportError:
            # NudeNet not available, use basic method
            return await self._calculate_safety_score(image)
        except Exception as e:
            print(f"⚠️ Cloud NSFW detection error: {str(e)}")
            return 0.75
