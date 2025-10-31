/**
 * Helper functions สำหรับการจัดการรูปภาพผ่าน GitHub
 * 
 * วิธีใช้งาน:
 * 1. สร้างโฟลเดอร์ public/images/news/ ใน GitHub Repository
 * 2. อัปโหลดรูปภาพเข้าไปในโฟลเดอร์นี้
 * 3. ใช้ฟังก์ชัน getGitHubImageUrl() เพื่อสร้าง URL
 * 
 * ตัวอย่าง: 
 * - เก็บรูปใน: public/images/news/news-001.jpg
 * - URL จะเป็น: https://your-username.github.io/your-repo/images/news/news-001.jpg
 */

// กำหนด Base URL ของ GitHub Pages (แก้ไขตามโปรเจ็กต์ของคุณ)
const GITHUB_BASE_URL = 'https://suphatitkku.github.io/codme/';
const IMAGE_FOLDER = 'images/news';

/**
 * สร้าง URL รูปภาพจาก GitHub Pages
 * @param {string} filename - ชื่อไฟล์รูปภาพ (เช่น 'news-001.jpg')
 * @returns {string} URL เต็มของรูปภาพ
 */
export const getGitHubImageUrl = (filename) => {
  if (!filename) return null;
  return `${GITHUB_BASE_URL}/${IMAGE_FOLDER}/${filename}`;
};

/**
 * สร้างชื่อไฟล์แบบ unique จากเวลาปัจจุบัน
 * @param {string} originalFilename - ชื่อไฟล์เดิม
 * @returns {string} ชื่อไฟล์ใหม่
 */
export const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const extension = originalFilename.split('.').pop();
  return `news-${timestamp}.${extension}`;
};

/**
 * แปลง File เป็น Base64 (สำหรับ preview)
 * @param {File} file - ไฟล์รูปภาพ
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * ตรวจสอบความถูกต้องของไฟล์รูปภาพ
 * @param {File} file - ไฟล์ที่ต้องการตรวจสอบ
 * @param {number} maxSizeMB - ขนาดไฟล์สูงสุด (MB)
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: 'ไม่พบไฟล์' };
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'รองรับเฉพาะไฟล์ JPG, PNG, GIF, WEBP' };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `ขนาดไฟล์ต้องไม่เกิน ${maxSizeMB}MB` };
  }

  return { valid: true, error: null };
};

/**
 * ดึงชื่อไฟล์จาก URL
 * @param {string} url - URL ของรูปภาพ
 * @returns {string|null} ชื่อไฟล์
 */
export const getFilenameFromUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split('/').pop();
  } catch (error) {
    return null;
  }
};

/**
 * สร้าง URL สำหรับ placeholder image
 * @returns {string} URL ของ placeholder
 */
export const getPlaceholderImageUrl = () => {
  return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop';
};

// =====================================================
// คำแนะนำการใช้งาน
// =====================================================

/**
 * วิธีการอัปโหลดรูปไปที่ GitHub:
 * 
 * 1. ผ่าน GitHub Web Interface:
 *    - ไปที่ Repository > public/images/news/
 *    - คลิก "Add file" > "Upload files"
 *    - เลือกรูปภาพที่ต้องการอัปโหลด
 *    - Commit changes
 * 
 * 2. ผ่าน Git Command Line:
 *    ```bash
 *    # เพิ่มรูปภาพเข้าโฟลเดอร์
 *    cp your-image.jpg public/images/news/
 *    
 *    # Commit และ push
 *    git add public/images/news/your-image.jpg
 *    git commit -m "Add news image"
 *    git push origin main
 *    ```
 * 
 * 3. ใช้งานใน Component:
 *    ```javascript
 *    import { getGitHubImageUrl, generateUniqueFilename } from './utils/githubImageHelper';
 *    
 *    // สร้าง URL สำหรับบันทึกลง Database
 *    const imageUrl = getGitHubImageUrl('news-001.jpg');
 *    // ผลลัพธ์: https://your-username.github.io/your-repo/images/news/news-001.jpg
 *    
 *    // บันทึกใน Firestore
 *    await createNews({
 *      title: 'ข่าวใหม่',
 *      content: '...',
 *      image: imageUrl  // เก็บเฉพาะ URL
 *    });
 *    ```
 */

// Export configuration
export const config = {
  GITHUB_BASE_URL,
  IMAGE_FOLDER,
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};