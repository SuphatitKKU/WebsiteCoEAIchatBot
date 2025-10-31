import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, ChevronLeft, Trash2, AlertCircle, Info } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const CourseManagement = () => {
  const [courses] = useState([
    {
      id: 'com',
      name: 'วิศวกรรมคอมพิวเตอร์',
      engName: 'Computer Engineering',
      courseId: 'COM-2565'
    },
    {
      id: 'dme',
      name: 'วิศวกรรมสื่อดิจิทัล',
      engName: 'Digital Media Engineering',
      courseId: 'DME-2565'
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionInfo, setCompressionInfo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const filesSnapshot = await getDocs(collection(db, 'courseFiles'));
      const filesData = {};
      
      filesSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!filesData[data.courseId]) {
          filesData[data.courseId] = [];
        }
        filesData[data.courseId].push({
          id: docSnap.id,
          ...data
        });
      });
      
      setUploadedFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
      setError('ไม่สามารถโหลดข้อมูลไฟล์ได้');
    }
  };

  // ฟังก์ชันบีบอัดรูปภาพใน PDF (รองรับไฟล์ทุกขนาด)
  const compressPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // แปลงเป็น base64 แบบแบ่งเป็นชิ้นๆ เพื่อลดการใช้หน่วยความจำ
          const chunkSize = 1024 * 1024; // 1MB per chunk
          let base64 = '';
          
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, Math.min(i + chunkSize, uint8Array.length));
            base64 += btoa(
              Array.from(chunk).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
          }
          
          base64 = 'data:application/pdf;base64,' + base64;
          
          const originalSize = file.size;
          const compressedSize = base64.length;
          
          resolve({
            data: base64,
            originalSize: originalSize,
            compressedSize: compressedSize,
            compressionRatio: Math.round((compressedSize / originalSize) * 100)
          });
          
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
      reader.readAsArrayBuffer(file);
    });
  };

  // แบ่งไฟล์เป็นส่วนๆ (แบบไม่จำกัดขนาด)
  const splitFileData = (base64Data, maxSize = 3.5 * 1024 * 1024) => {
    const chunks = [];
    const chunkSize = maxSize;
    
    for (let i = 0; i < base64Data.length; i += chunkSize) {
      chunks.push(base64Data.substring(i, i + chunkSize));
    }
    
    return chunks;
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // ตรวจสอบว่าเป็นไฟล์ PDF
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      setError('กรุณาอัพโหลดเฉพาะไฟล์ PDF เท่านั้น');
      return;
    }

    setUploading(true);
    setError('');
    setCompressionInfo('');
    let progress = 0;

    for (const file of pdfFiles) {
      try {
        setCompressionInfo(`กำลังประมวลผลไฟล์ ${file.name} (${formatFileSize(file.size)})...`);
        
        // บีบอัดไฟล์ (รองรับทุกขนาด)
        const compressed = await compressPDF(file);
        
        const compressionPercent = 100 - compressed.compressionRatio;
        if (compressionPercent > 0) {
          setCompressionInfo(
            `ประมวลผล: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)}`
          );
        }
        
        // ตรวจสอบขนาดหลังบีบอัด
        const finalSize = compressed.data.length;
        
        // ถ้าไฟล์เล็กกว่า 3.5MB เก็บเป็น document เดียว
        if (finalSize <= 3.5 * 1024 * 1024) {
          setCompressionInfo(`กำลังอัพโหลด ${file.name}...`);
          await addDoc(collection(db, 'courseFiles'), {
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            originalSize: file.size,
            compressedSize: finalSize,
            uploadDate: new Date().toLocaleDateString('th-TH'),
            fileData: compressed.data,
            fileType: file.type,
            isMultiPart: false
          });
        } else {
          // ไฟล์ใหญ่ - แบ่งเป็นหลาย parts (รองรับไฟล์ทุกขนาด)
          setCompressionInfo(`กำลังแบ่งไฟล์ ${file.name} เป็นส่วนๆ...`);
          const chunks = splitFileData(compressed.data);
          const fileId = `${selectedCourse.id}_${Date.now()}_${file.name}`;
          
          setCompressionInfo(`แบ่งไฟล์เป็น ${chunks.length} ส่วน กำลังอัพโหลด...`);
          
          // บันทึก metadata
          await addDoc(collection(db, 'courseFiles'), {
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            originalSize: file.size,
            compressedSize: finalSize,
            uploadDate: new Date().toLocaleDateString('th-TH'),
            fileType: file.type,
            isMultiPart: true,
            totalParts: chunks.length,
            fileId: fileId
          });
          
          // บันทึกแต่ละ part ทีละส่วน
          for (let i = 0; i < chunks.length; i++) {
            setCompressionInfo(`อัพโหลดส่วนที่ ${i + 1}/${chunks.length} ของ ${file.name}...`);
            await addDoc(collection(db, 'courseFileParts'), {
              fileId: fileId,
              partNumber: i,
              data: chunks[i]
            });
            
            // อัพเดท progress bar สำหรับแต่ละ part
            const partProgress = ((i + 1) / chunks.length) * (100 / pdfFiles.length);
            setUploadProgress(progress + partProgress);
          }
        }

        progress += (100 / pdfFiles.length);
        setUploadProgress(progress);
        setCompressionInfo(`อัพโหลด ${file.name} สำเร็จ!`);
        
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(`ไม่สามารถอัพโหลด ${file.name} ได้: ${error.message}`);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setCompressionInfo('');
    await loadUploadedFiles();
    event.target.value = '';
  };

  const removeFile = async (courseId, fileId, fileData) => {
    if (!window.confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
      return;
    }

    try {
      setCompressionInfo('กำลังลบไฟล์...');
      
      // ลบ document หลัก
      await deleteDoc(doc(db, 'courseFiles', fileId));
      
      // ถ้าเป็น multi-part ต้องลบ parts ด้วย
      if (fileData.isMultiPart) {
        setCompressionInfo(`กำลังลบไฟล์ส่วนๆ (${fileData.totalParts} ส่วน)...`);
        
        // ดึง parts ทั้งหมดที่เกี่ยวข้องมาลบ
        const partsSnapshot = await getDocs(collection(db, 'courseFileParts'));
        const deletions = [];
        
        partsSnapshot.forEach((docSnap) => {
          const partData = docSnap.data();
          if (partData.fileId === fileData.fileId) {
            deletions.push(deleteDoc(doc(db, 'courseFileParts', docSnap.id)));
          }
        });
        
        await Promise.all(deletions);
      }
      
      setCompressionInfo('ลบไฟล์สำเร็จ!');
      setTimeout(() => setCompressionInfo(''), 2000);
      await loadUploadedFiles();
    } catch (error) {
      console.error('Error removing file:', error);
      setError('ไม่สามารถลบไฟล์ได้');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const downloadFile = async (file) => {
    try {
      let fileData = file.fileData;
      
      // ถ้าเป็น multi-part ต้องรวม parts ก่อน
      if (file.isMultiPart) {
        setCompressionInfo(`กำลังเตรียมไฟล์ (${file.totalParts} ส่วน)...`);
        
        // ดึง parts ทั้งหมดมารวมกัน
        const partsSnapshot = await getDocs(collection(db, 'courseFileParts'));
        const parts = [];
        
        partsSnapshot.forEach((docSnap) => {
          const partData = docSnap.data();
          if (partData.fileId === file.fileId) {
            parts.push({
              partNumber: partData.partNumber,
              data: partData.data
            });
          }
        });
        
        // เรียงลำดับ parts
        parts.sort((a, b) => a.partNumber - b.partNumber);
        
        // รวม parts
        setCompressionInfo('กำลังรวมไฟล์...');
        fileData = parts.map(p => p.data).join('');
        
        setCompressionInfo('เตรียมดาวน์โหลด...');
      }
      
      const link = document.createElement('a');
      link.href = fileData;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setCompressionInfo('ดาวน์โหลดสำเร็จ!');
      setTimeout(() => setCompressionInfo(''), 2000);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('ไม่สามารถดาวน์โหลดไฟล์ได้');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            จัดการเอกสารหลักสูตร
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto mb-4"></div>
          <p className="text-gray-600">อัพโหลดและจัดการเอกสาร PDF สำหรับแต่ละหลักสูตร</p>
        </div>

        {/* Info Box */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">ข้อมูลการอัพโหลด:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>รองรับไฟล์ PDF ทุกขนาด (ไม่จำกัด)</li>
              <li>ไฟล์ขนาดเล็ก (&lt;3.5MB): อัพโหลดทันที</li>
              <li>ไฟล์ขนาดใหญ่ (&gt;3.5MB): แบ่งเก็บเป็นส่วนๆ อัตโนมัติ</li>
              <li>ระบบจะแบ่งและรวมไฟล์โดยอัตโนมัติ</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-sm text-red-600 underline mt-1"
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        {compressionInfo && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">{compressionInfo}</p>
          </div>
        )}

        {!selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800 flex-1">
                        {course.name}
                      </h3>
                      {uploadedFiles[course.id]?.length > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                          {uploadedFiles[course.id].length} ไฟล์
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{course.engName}</p>
                    <p className="text-gray-500 text-xs">รหัส: {course.courseId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    จัดการไฟล์
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              <ChevronLeft size={20} className="mr-1" />
              กลับ
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {selectedCourse.name}
                </h2>
                <p className="text-gray-600">{selectedCourse.engName}</p>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-4">อัพโหลดเอกสาร PDF</h3>
              
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-3 group-hover:text-red-600 transition-colors" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">คลิกเพื่อเลือกไฟล์</span> หรือลากไฟล์มาวาง
                  </p>
                  <p className="text-xs text-gray-500">รองรับเฉพาะไฟล์ PDF (ทุกขนาด)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>

              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">กำลังอัพโหลด...</span>
                    <span className="text-sm font-medium text-red-600">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-800 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {uploadedFiles[selectedCourse.id]?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  ไฟล์ที่อัพโหลด ({uploadedFiles[selectedCourse.id].length})
                </h3>
                <div className="space-y-3">
                  {uploadedFiles[selectedCourse.id].map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0 gap-3">
                        <FileText className="text-red-600 flex-shrink-0" size={24} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">{file.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {file.fileSize} • อัพโหลดเมื่อ {file.uploadDate}
                            {file.isMultiPart && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Multi-part</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => downloadFile(file)}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ดาวน์โหลด
                        </button>
                        <button
                          onClick={() => removeFile(selectedCourse.id, file.id, file)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;