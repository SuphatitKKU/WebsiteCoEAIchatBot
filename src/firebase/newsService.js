import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

const NEWS_COLLECTION = 'news';

// Helper: สร้าง excerpt จากเนื้อหา
const createExcerpt = (content, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

// Helper: Format วันที่เป็นภาษาไทย
const formatThaiDate = (timestamp) => {
  const date = timestamp.toDate();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('th-TH', options);
};

/**
 * ดึงข่าวทั้งหมด (เฉพาะที่ published)
 */
export const getAllPublishedNews = async () => {
  try {
    const q = query(
      collection(db, NEWS_COLLECTION),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const newsList = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsList.push({
        id: doc.id,
        ...data,
        date: formatThaiDate(data.createdAt),
        fullContent: data.content
      });
    });
    
    return newsList;
  } catch (error) {
    console.error('Error fetching published news:', error);
    throw error;
  }
};

/**
 * ดึงข่าวทั้งหมด (สำหรับ Admin)
 */
export const getAllNews = async () => {
  try {
    const q = query(
      collection(db, NEWS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const newsList = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsList.push({
        id: doc.id,
        ...data,
        date: formatThaiDate(data.createdAt)
      });
    });
    
    return newsList;
  } catch (error) {
    console.error('Error fetching all news:', error);
    throw error;
  }
};

/**
 * ดึงข่าวเฉพาะ ID
 */
export const getNewsById = async (newsId) => {
  try {
    const docRef = doc(db, NEWS_COLLECTION, newsId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: formatThaiDate(data.createdAt)
      };
    } else {
      throw new Error('News not found');
    }
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
};

/**
 * สร้างข่าวใหม่
 */
export const createNews = async (newsData) => {
  try {
    const now = Timestamp.now();
    
    const newNews = {
      title: newsData.title,
      content: newsData.content,
      excerpt: createExcerpt(newsData.content),
      image: newsData.image || null,
      author: newsData.author || 'ฝ่ายประชาสัมพันธ์',
      category: newsData.category || 'ทั่วไป',
      status: newsData.status || 'draft',
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, NEWS_COLLECTION), newNews);
    
    return {
      id: docRef.id,
      ...newNews,
      date: formatThaiDate(now)
    };
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

/**
 * แก้ไขข่าว
 */
export const updateNews = async (newsId, newsData) => {
  try {
    const docRef = doc(db, NEWS_COLLECTION, newsId);
    
    const updatedData = {
      ...newsData,
      excerpt: newsData.content ? createExcerpt(newsData.content) : undefined,
      updatedAt: Timestamp.now()
    };
    
    // ลบ field ที่เป็น undefined
    Object.keys(updatedData).forEach(key => 
      updatedData[key] === undefined && delete updatedData[key]
    );
    
    await updateDoc(docRef, updatedData);
    
    return await getNewsById(newsId);
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

/**
 * ลบข่าว
 */
export const deleteNews = async (newsId) => {
  try {
    const docRef = doc(db, NEWS_COLLECTION, newsId);
    await deleteDoc(docRef);
    return { success: true, id: newsId };
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

/**
 * ดึงข่าวตาม category
 */
export const getNewsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, NEWS_COLLECTION),
      where('category', '==', category),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const newsList = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsList.push({
        id: doc.id,
        ...data,
        date: formatThaiDate(data.createdAt)
      });
    });
    
    return newsList;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
};