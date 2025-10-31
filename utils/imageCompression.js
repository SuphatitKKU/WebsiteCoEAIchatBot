/**
 * Image Compression Utility
 * บีบอัดรูปภาพอัตโนมัติก่อนอัปโหลด
 */

/**
 * บีบอัดรูปภาพโดยอัตโนมัติ
 * @param {File} file - ไฟล์รูปภาพต้นฉบับ
 * @param {Object} options - ตัวเลือกการบีบอัด
 * @returns {Promise<string>} Base64 string ของรูปที่บีบอัดแล้ว
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,           // ความกว้างสูงสุด (px)
    maxHeight = 800,           // ความสูงสูงสุด (px)
    quality = 0.8,             // คุณภาพ 0-1 (0.8 = 80%)
    maxSizeKB = 500,          // ขนาดไฟล์สูงสุด (KB)
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // คำนวณขนาดใหม่โดยรักษาสัดส่วน
        let width = img.width;
        let height = img.height;
        
        // ถ้าขนาดใหญ่เกินกำหนด ให้ลดขนาด
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // สร้าง canvas สำหรับวาดรูป
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // ใช้ imageSmoothingQuality เพื่อคุณภาพที่ดีขึ้น
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // วาดรูปลง canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // แปลงเป็น Base64 ด้วย quality ที่กำหนด
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // ถ้าไฟล์ยังใหญ่เกิน ให้ลด quality ลงอีก
        let currentQuality = quality;
        while (getBase64Size(compressedBase64) > maxSizeKB && currentQuality > 0.1) {
          currentQuality -= 0.1;
          compressedBase64 = canvas.toDataURL('image/jpeg', currentQuality);
        }
        
        const finalSize = getBase64Size(compressedBase64);
        console.log(`✅ Image compressed: ${Math.round(file.size / 1024)}KB → ${finalSize}KB (Quality: ${Math.round(currentQuality * 100)}%)`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('ไม่สามารถโหลดรูปภาพได้'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * คำนวณขนาดของ Base64 string (KB)
 * @param {string} base64String - Base64 string
 * @returns {number} ขนาดไฟล์ใน KB
 */
const getBase64Size = (base64String) => {
  // ลบ header "data:image/jpeg;base64," ออก
  const base64 = base64String.split(',')[1] || base64String;
  // คำนวณขนาดจริง (Base64 ใช้พื้นที่ 4/3 ของขนาดจริง)
  const sizeInBytes = (base64.length * 3) / 4;
  return Math.round(sizeInBytes / 1024);
};

/**
 * ตรวจสอบประเภทไฟล์
 * @param {File} file - ไฟล์ที่ต้องการตรวจสอบ
 * @returns {boolean} true ถ้าเป็นรูปภาพ
 */
export const isImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Format ขนาดไฟล์เป็นข้อความที่อ่านง่าย
 * @param {number} bytes - ขนาดไฟล์เป็น bytes
 * @returns {string} ขนาดไฟล์ที่ format แล้ว
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * ตัวอย่างการใช้งาน:
 * 
 * import { compressImage, isImageFile, formatFileSize } from './utils/imageCompression';
 * 
 * const handleImageUpload = async (e) => {
 *   const file = e.target.files[0];
 *   
 *   if (!file) return;
 *   
 *   if (!isImageFile(file)) {
 *     alert('กรุณาเลือกไฟล์รูปภาพ');
 *     return;
 *   }
 *   
 *   console.log('Original size:', formatFileSize(file.size));
 *   
 *   try {
 *     // บีบอัดรูปอัตโนมัติ
 *     const compressedImage = await compressImage(file, {
 *       maxWidth: 1200,
 *       maxHeight: 800,
 *       quality: 0.8,
 *       maxSizeKB: 500
 *     });
 *     
 *     setImagePreview(compressedImage);
 *   } catch (error) {
 *     console.error('Error compressing image:', error);
 *     alert('ไม่สามารถบีบอัดรูปภาพได้');
 *   }
 * };
 */