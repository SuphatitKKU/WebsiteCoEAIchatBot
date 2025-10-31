import React from 'react';
import { Upload, FileText, X, ChevronLeft, BookOpen } from 'lucide-react';

const CourseManagement = ({ 
  courses, 
  selectedCourse, 
  setSelectedCourse, 
  uploadedFiles, 
  handleFileUpload, 
  removeFile 
}) => {
  return (
    <>
      {!selectedCourse ? (
        // Course List View
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">
                        {course.name}
                      </h3>
                      {uploadedFiles[course.id]?.length > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                          {uploadedFiles[course.id].length}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      หลักสูตร ID: {course.courseId}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#dc2626] to-[#7d1315] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    แก้ไข
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Course Detail View
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span className="font-medium">กลับ</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">อัพโหลดเอกสาร PDF</h3>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3 group-hover:text-[#dc2626] transition-colors" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
                </p>
                <p className="text-xs text-gray-500">รองรับเฉพาะไฟล์ PDF</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {uploadedFiles[selectedCourse.id]?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ไฟล์ที่อัพโหลด</h3>
              <div className="space-y-3">
                {uploadedFiles[selectedCourse.id].map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <FileText className="text-[#dc2626] mr-3 flex-shrink-0" size={24} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {file.size} • อัพโหลดเมื่อ {file.uploadDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(selectedCourse.id, index)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CourseManagement;