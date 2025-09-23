import Navbar from "../component/Navbar";
import React, { useState } from "react";
import "./admission.css";

type Round = 0 | 1 | 2 | 3 | 4;

type Course = {
  title: string;
  engTitle: string;
  campus: string;
  fee: string;
  seats: { r1: number | string; r2: number | string; r3: number | string; r4: number | string };
  logoColor: string;
};

const COURSES: Course[] = [
  {
    title: "วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์ (ภาษาไทย ปกติ)",
    engTitle: "Bachelor of Engineering (Computer Engineering)",
    campus: "ขอนแก่น",
    fee: "20,000 บาท/เทอม",
    seats: { r1: 32, r2: 38, r3: 34, r4: "ยังไม่เปิดรับสมัคร" },
    logoColor: "#7C3AED",
  },
  {
    title: "วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมดิจิทัล หลักสูตรนานาชาติ",
    engTitle: "Bachelors of Engineering Program in Digital Media Engineering",
    campus: "ขอนแก่น",
    fee: "50,000 บาท/เทอม",
    seats: { r1: 21, r2: 10, r3: 20, r4: "ยังไม่เปิดรับสมัคร" },
    logoColor: "#EC4899",
  },
];

/** Accordion กล่องรายละเอียดย่อย */
function AccordItem({
  title, seats, children, defaultOpen = false,
}: {
  title: string; seats?: number | string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`Acc ${open ? "open" : ""}`}>
      <button className="Acc-head" onClick={() => setOpen(!open)}>
        <span className="Acc-title">{title}</span>
        <span className="Acc-right">
          {typeof seats !== "undefined" && <span className="Acc-badge">รับ {seats} คน</span>}
          <span className={`Acc-caret ${open ? "up" : ""}`} aria-hidden>▾</span>
        </span>
      </button>
      {open && <div className="Acc-body">{children}</div>}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const [round, setRound] = useState<Round>(0);

  const headingMap: Record<Round, string> = {
    0: "รายละเอียด",
    1: "รอบ 1 Portfolio",
    2: "รอบ 2 Quota",
    3: "รอบ 3 Admission",
    4: "รอบ 4 Direct Admission",
  };

  const roundContent: Record<Round, React.ReactNode> = {
    0: (
      <>
        <div className="kv"><div className="k">ชื่อหลักสูตร</div><div className="v">{course.title}</div></div>
        <div className="kv"><div className="k">ชื่อหลักสูตรภาษาอังกฤษ</div><div className="v">{course.engTitle}</div></div>
        <div className="kv"><div className="k">ประเภทหลักสูตร</div><div className="v">ภาษาไทย ปกติ</div></div>
        <div className="kv"><div className="k">วิทยาเขต</div><div className="v">{course.campus}</div></div>
        <div className="kv"><div className="k">ค่าใช้จ่าย</div><div className="v">{course.fee}</div></div>

        <hr className="divider" />

        <div className="round-sum">
          <div>รอบ 1 Portfolio: <b>{course.seats.r1}</b> คน</div>
          <div>รอบ 2 Quota: <b>{course.seats.r2}</b> คน</div>
          <div>รอบ 3 Admission: <b>{course.seats.r3}</b> คน</div>
          <div>รอบ 4 Direct Admission: <b>{course.seats.r4}</b></div>
        </div>
      </>
    ),
    1: (
      <>
        <AccordItem title="โครงการผู้มีศักยภาพสูง" seats={24} defaultOpen>
          <ul className="bul">
            <li>แนบแฟ้มผลงาน (PDF) 1 ไฟล์ พร้อมคำอธิบายประกอบ (placeholder)</li>
            <li>ตัวอย่างงาน: โปรแกรม/แอป, หุ่นยนต์/IoT, การประกวดโครงงาน ฯลฯ</li>
            <li>กำหนดการ: รับสมัคร → ประกาศสิทธิ์สัมภาษณ์ → สัมภาษณ์ → ประกาศผล</li>
          </ul>
        </AccordItem>
        <AccordItem title="โครงการรับนักเรียนจากโรงเรียนที่มีศักยภาพสูง" seats={8}>
          <ul className="bul">
            <li>คุณสมบัติพื้นฐานตามประกาศ (placeholder)</li>
            <li>หลักฐานประกอบการสมัคร (placeholder)</li>
          </ul>
        </AccordItem>
      </>
    ),
    2: (
      <AccordItem title="Quota พื้นที่/โรงเรียนเครือข่าย" seats={course.seats.r2 as number}>
        <ul className="bul">
          <li>เกณฑ์ขั้นต่ำรายวิชา ตามประกาศมหาวิทยาลัย (placeholder)</li>
          <li>เอกสาร: หนังสือรับรอง, ผลการเรียน, หลักฐานโควตา</li>
        </ul>
      </AccordItem>
    ),
    3: (
      <AccordItem title="Admission ระบบกลาง TCAS" seats={course.seats.r3 as number}>
        <ul className="bul">
          <li>องค์ประกอบคะแนน: GPAX, GAT/PAT, วิชาสามัญ ฯลฯ (placeholder)</li>
          <li>สูตรคำนวณคะแนนรวม + เกณฑ์ขั้นต่ำ (placeholder)</li>
        </ul>
      </AccordItem>
    ),
    4: (
      <AccordItem title="Direct Admission สมัครตรงคณะ/ภาควิชา" seats={"ตามประกาศ"}>
        <ul className="bul">
          <li>เอกสาร/ผลงานเฉพาะทางตามที่กำหนด (placeholder)</li>
          <li>ขั้นตอน: สมัคร → ตรวจเอกสาร/สอบข้อเขียน/สัมภาษณ์ (ถ้ามี) → ประกาศผล</li>
        </ul>
      </AccordItem>
    ),
  };

  return (
    <section className="C-card C-translucent">
      <div className="C-rail">
        <button
          className={`C-pill ${round === 0 ? "is-active" : ""}`}
          onClick={() => setRound(0)}
        >i</button>
        {[1,2,3,4].map((r)=>(
          <button
            key={r}
            className={`C-pill ${round===r ? "is-active":""}`}
            onClick={()=>setRound(r as Round)}
          >
            รอบ {r}
          </button>
        ))}
      </div>

      <div className="C-inner">
        <header className="C-head">
          <div className="C-logo" style={{backgroundColor: course.logoColor}} />
          <div className="C-title-wrap">
            <h2 className="C-title">{course.title}</h2>
            <div className="C-dash" />
          </div>
        </header>


        <h3 className="C-sub">{headingMap[round]}</h3>

        <div key={round} className="C-detail fade">
          {roundContent[round]}
        </div>
      </div>
    </section>
  );
}

export default function Admission() {
  return (
    <main className="C-wrap">
      <h1 className="C-page-title">ข้อมูลการรับสมัคร</h1>
      {COURSES.map((c,i)=>(<CourseCard key={i} course={c}/>))}
    </main>
  );
}

