import PyPDF2
import os
import re

# กำหนด path แบบ relative จาก root โปรเจค
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE_DIR, "public", "course", "มคอ2-DME-65.pdf")
OUTPUT_PATH = os.path.join(BASE_DIR, "public", "data", "course_dme.txt")  # ✅ เปลี่ยนโฟลเดอร์ปลายทาง

print("=" * 60)
print("🚀 เริ่มแปลง PDF เป็น Text File")
print("=" * 60)
print(f"📂 โฟลเดอร์โปรเจค: {BASE_DIR}")
print(f"📄 ไฟล์ PDF: {PDF_PATH}")
print(f"💾 ไฟล์ Output: {OUTPUT_PATH}")
print("=" * 60)

# ตรวจสอบว่าไฟล์ PDF มีอยู่จริงหรือไม่
if not os.path.exists(PDF_PATH):
    print("\n❌ ไม่พบไฟล์ PDF!")
    print(f"กรุณาตรวจสอบว่าไฟล์อยู่ที่: {PDF_PATH}")
    print("\n💡 แนะนำ: ย้าย PDF ไปไว้ที่ public/course/มคอ2-COM-65.pdf")
    input("\nกด Enter เพื่อปิดหน้าต่าง...")
    exit(1)

def clean_text(text):
    """ทำความสะอาดข้อความให้อ่านง่ายขึ้น"""
    
    # 1. แก้ไขปัญหาสระอำ
    text = re.sub(r' า', 'ำ', text)
    text = re.sub(r'([ก-ฮ]) า', r'\1ำ', text)
    
    # 2. ลบ newline ที่ซ้ำกันเกิน 2 บรรทัด
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # 3. แปลง newline เดี่ยวๆ ที่อยู่กลางประโยคให้เป็นช่องว่าง
    lines = text.split('\n')
    cleaned_lines = []
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            if cleaned_lines and cleaned_lines[-1] != '':
                cleaned_lines.append('')
            continue
        
        is_heading = (
            re.match(r'^\d+\.', line) or
            re.match(r'^[•\-\*]', line) or
            re.match(r'^[ก-ฮ]\)', line) or
            len(line) < 80 and not line.endswith((':', '?', '!', '.', 'ครับ', 'ค่ะ'))
        )
        
        if cleaned_lines and not is_heading:
            prev_line = cleaned_lines[-1]
            if prev_line and not prev_line.endswith(('.', ':', '?', '!', 'ครับ', 'ค่ะ')):
                cleaned_lines[-1] = prev_line + ' ' + line
                continue
        
        cleaned_lines.append(line)
    
    text = '\n'.join(cleaned_lines)
    text = re.sub(r' {2,}', ' ', text)
    text = re.sub(r' +([.,;:!?])', r'\1', text)
    text = re.sub(r'([.,;:!?])([^\s\n])', r'\1 \2', text)
    text = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    text = re.sub(r'\n([ก-ฮ]{2,}[^\n]{0,50})\n', r'\n\n\1\n', text)
    
    return text.strip()

try:
    print("\n📖 กำลังอ่าน PDF...")
    
    with open(PDF_PATH, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)
        
        print(f"✓ จำนวนหน้าทั้งหมด: {num_pages} หน้า")
        
        raw_text = ""
        for i, page in enumerate(pdf_reader.pages, 1):
            text = page.extract_text()
            raw_text += text + "\n"
            progress = (i / num_pages) * 100
            print(f"⏳ ประมวลผล: {i}/{num_pages} หน้า ({progress:.1f}%)", end='\r')
        
        print(f"\n✓ อ่าน PDF สำเร็จ: {num_pages} หน้า          ")
        
        print("\n🧹 กำลังทำความสะอาดข้อความ...")
        cleaned_text = clean_text(raw_text)
        print("✓ ทำความสะอาดสำเร็จ")
        
        # ✅ สร้างโฟลเดอร์ public/data ถ้ายังไม่มี
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        
        print("\n💾 กำลังบันทึกเป็นไฟล์ text...")
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as text_file:
            text_file.write("=" * 80 + "\n")
            text_file.write("ข้อมูลหลักสูตรวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น\n")
            text_file.write(f"จำนวนหน้า: {num_pages} หน้า\n")
            text_file.write("สร้างเมื่อ: 2025-10-16\n")
            text_file.write("=" * 80 + "\n\n")
            text_file.write(cleaned_text)
        
        print("✓ บันทึกไฟล์สำเร็จ!")
        print(f"   - ไฟล์: {os.path.basename(OUTPUT_PATH)}")
        print(f"   - ตำแหน่ง: public/data/")  # ✅ อัปเดตเส้นทางใหม่
        
        reduction = ((len(raw_text) - len(cleaned_text)) / len(raw_text)) * 100
        file_size = os.path.getsize(OUTPUT_PATH) / 1024
        
        print(f"\n📊 สถิติ:")
        print(f"   - จำนวนหน้า: {num_pages} หน้า")
        print(f"   - ข้อความต้นฉบับ: {len(raw_text):,} ตัวอักษร")
        print(f"   - ข้อความสะอาด: {len(cleaned_text):,} ตัวอักษร")
        print(f"   - ลดขนาด: {reduction:.1f}%")
        print(f"   - ขนาดไฟล์: {file_size:.2f} KB")
        
        print("\n" + "=" * 60)
        print("📄 ตัวอย่างข้อความ (500 ตัวอักษรแรก)")
        print("=" * 60)
        print(cleaned_text[:500])
        print("...")
        
        print("\n" + "=" * 60)
        print("✅ สำเร็จ! พร้อมใช้งานกับ chatbot แล้ว")
        print("=" * 60)
        print("\n📌 ขั้นตอนต่อไป:")
        print("   1. ตรวจสอบไฟล์ที่: public/data/course_knowledge.txt")
        print("   2. รัน: npm run dev")
        print("   3. ทดสอบ chatbot")
        
except Exception as e:
    print(f"\n❌ เกิดข้อผิดพลาด: {str(e)}")
    print("\n💡 แนะนำการแก้ไข:")
    print("   - ตรวจสอบว่าไฟล์ PDF ไม่เสียหาย")
    print("   - ตรวจสอบว่าไฟล์ไม่ถูกล็อคโดยโปรแกรมอื่น")
    print("   - ลองติดตั้ง PyPDF2 ใหม่: pip install --upgrade PyPDF2")
    import traceback
    print("\n🔍 รายละเอียดข้อผิดพลาด:")
    traceback.print_exc()

print("\n")
input("กด Enter เพื่อปิดหน้าต่าง...")
