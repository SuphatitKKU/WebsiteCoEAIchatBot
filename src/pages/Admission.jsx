import React, { useState } from "react";
import "./admission.css";
import assets from "../assets/assets";

const COURSES = [
  {
    title: "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์)",
    engTitle: "Bachelor of Engineering (Computer Engineering)",
    campus: "ขอนแก่น",
    fee: "20,000 บาท/เทอม",
    seats: { r1: 32, r2: 38, r3: 34, r4: "ยังไม่เปิดรับสมัคร" },
  },
  {
    title: "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมสื่อดิจิทัล) หลักสูตรนานาชาติ",
    engTitle:
      "Bachelor of Engineering (Digital Media Engineering) International Program",
    campus: "ขอนแก่น",
    fee: "50,000 บาท/เทอม",
    seats: { r1: 21, r2: 10, r3: 20, r4: "ยังไม่เปิดรับสมัคร" },
  },
];

const ROUND_DATA = {
  0: {
    1: [
      {
        title: "วิศวกรรมคอมพิวเตอร์ โครงการผู้มีศักยภาพสูง",
        seats: 24,
        sections: {
          base: "รับผู้สมัครที่จบจาก รร. หลักสูตรแกนกลาง, นานาชาติ, อาชีวะ และ GED ไม่รับหลักสูตรตามอัธยาศัย คะแนน GPAX ต่ำสุด 3.00",
          detail:
            "เป็นผู้ที่กำลังศึกษาอยู่ในชั้น ม.6 หรือเทียบเท่า (ปวช.) หรือผู้ที่มีคะแนน GED",
          criteria: "พิจารณาคุณภาพผลงาน + สัมภาษณ์ (ถ้ามี)",
          extra:
            "มีผลงานทางวิชาการด้านวิทยาศาสตร์ คณิตศาสตร์ หรือคอมพิวเตอร์ ในระดับจังหวัด ภูมิภาค ชาติ หรือนานาชาติ",
        },
      },
      {
        title:
          "วิศวกรรมคอมพิวเตอร์ โครงการรับนักเรียนจากโรงเรียนที่มีศักยภาพสูง",
        seats: 8,
        sections: {
          base: "ต้องเป็นโรงเรียนเครือข่ายที่ภาควิชากำหนด",
          detail: "แนบหนังสือรับรอง/ผลงานที่เกี่ยวข้อง",
          criteria: "คัดเลือกตามเกณฑ์โครงการ",
          extra: "ประสานครูแนะแนวเพื่อเอกสาร",
        },
      },
    ],
    2: [
      {
        title: "วิศวกรรมคอมพิวเตอร์ โควตาภาคตะวันออกเฉียงเหนือ",
        seats: 38,
        sections: {
          base: "เฉพาะโรงเรียนในพื้นที่ภาคตะวันออกเฉียงเหนือ",
          detail: "GPAX ≥ 3.00 และแนบผลสอบวิชาสามัญ/วิชาเฉพาะตามประกาศ",
          criteria: "เรียงตามคะแนนรวมตามสูตรที่ประกาศ",
          extra: "รายละเอียดอื่น ๆ เป็นไปตามประกาศมหาวิทยาลัย",
        },
      },
    ],
    3: [
      {
        title: "วิศวกรรมคอมพิวเตอร์",
        seats: 34,
        sections: {
          base: "รับผ่านระบบกลาง TCAS",
          detail: "องค์ประกอบ: GPAX, GAT/PAT, วิชาสามัญ",
          criteria: "ผ่านขั้นต่ำและเรียงคะแนนรวม",
          extra: "สูตรคะแนนระบุในประกาศรับสมัคร",
        },
      },
    ],
  },
  1: {
    1: [
      {
        title:
          "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ โครงการรับนักเรียนจากโรงเรียนที่มีศักยภาพสูง",
        seats: 4,
        sections: {
          base: "โชว์เคสงานสื่อดิจิทัล (PDF/ลิงก์)",
          detail: "แนะนำแนบวิดีโอ/รีล/สตอรี่บอร์ดประกอบ",
          criteria: "สัมภาษณ์อธิบายแนวคิด (EN/TH)",
          extra: "แนบลิงก์ผลงานออนไลน์ได้",
        },
      },
      {
        title: "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ โครงการผู้มีศักยภาพสูง",
        seats: 20,
        sections: {
          base: "ยื่นผลงานภาพนิ่ง/วิดีโอ พร้อมอธิบายกระบวนการ",
          detail: "ควรมีเครดิต/เครื่องมือที่ใช้",
          criteria: "พิจารณาคุณภาพผลงานและการสื่อสาร",
          extra: "อาจมี Workshop/Interview เพิ่ม",
        },
      },
    ],
    2: [
      {
        title:
          "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ โควตาภาคตะวันออกเฉียงเหนือ",
        seats: 12,
        sections: {
          base: "จบจาก EP/International หรือเทียบเท่า",
          detail: "ผลสอบภาษาอังกฤษขั้นต่ำ + GPAX ตามเกณฑ์",
          criteria: "คัดตามคะแนนรวม",
          extra: "สัมภาษณ์เป็นภาษาอังกฤษ",
        },
      },
    ],
    3: [
      {
        title: "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ",
        seats: 9,
        sections: {
          base: "รับผ่าน TCAS",
          detail: "GPAX + วิชาสามัญ (EN, MTH, SCI)",
          criteria: "ผ่านขั้นต่ำและเรียงคะแนนรวม",
          extra: "สูตรคะแนนตามประกาศ",
        },
      },
    ],
  },
};

function AccordRound({ title, seats, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`accord ${open ? "open" : ""}`}>
      <button className="accord-head" onClick={() => setOpen(!open)}>
        <span className="accord-title">{title}</span>
        <span className="accord-right">
          {typeof seats !== "undefined" && (
            <span className="accord-badge">รับ {seats} คน</span>
          )}
          <span className={`accord-caret ${open ? "up" : ""}`} aria-hidden>
            ▾
          </span>
        </span>
      </button>
      {open && <div className="accord-body">{children}</div>}
    </div>
  );
}

function FourSections({ base, detail, criteria, extra }) {
  return (
    <div className="section-wrap">
      <h4 className="section-title">ข้อมูลพื้นฐาน</h4>
      <div className="section-body">{base}</div>

      <h4 className="section-title">รายละเอียด</h4>
      <div className="section-body">{detail}</div>

      <h4 className="section-title">เงื่อนไขการรับ</h4>
      <div className="section-body">{criteria}</div>

      <h4 className="section-title">รายละเอียดเพิ่มเติม</h4>
      <div className="section-body">{extra}</div>
    </div>
  );
}

function CourseCard({ course, index }) {
  const [round, setRound] = useState(0);

  const roundTitle = {
    0: "รายละเอียด",
    1: "รอบ 1 Portfolio",
    2: "รอบ 2 Quota",
    3: "รอบ 3 Admission",
    4: "รอบ 4 Direct Admission",
  };

  const renderRound = (r) => {
    if (r === 0) {
      return (
        <>
          <div className="kv">
            <div className="k">ชื่อหลักสูตร</div>
            <div className="v">{course.title}</div>
          </div>
          <div className="kv">
            <div className="k">ชื่อหลักสูตรภาษาอังกฤษ</div>
            <div className="v">{course.engTitle}</div>
          </div>
          <div className="kv">
            <div className="k">ประเภทหลักสูตร</div>
            <div className="v">
              {index === 0 ? "ภาษาไทย ปกติ" : "หลักสูตรนานาชาติ"}
            </div>
          </div>
          <div className="kv">
            <div className="k">วิทยาเขต</div>
            <div className="v">{course.campus}</div>
          </div>
          <div className="kv">
            <div className="k">ค่าใช้จ่าย</div>
            <div className="v">{course.fee}</div>
          </div>

          <hr className="divider" />

          <div className="round-sum">
            <div>
              รอบ 1 Portfolio: <b>{course.seats.r1}</b> คน
            </div>
            <div>
              รอบ 2 Quota: <b>{course.seats.r2}</b> คน
            </div>
            <div>
              รอบ 3 Admission: <b>{course.seats.r3}</b> คน
            </div>
            <div>
              รอบ 4 Direct Admission: <b>{course.seats.r4}</b>
            </div>
          </div>
        </>
      );
    }

    if (r === 4) {
      return <p>ยังไม่เปิดรับสมัคร</p>;
    }

    const dataList = ROUND_DATA[index]?.[r] || [];
    return (
      <>
        {dataList.map((data, idx) => (
          <AccordRound
            key={idx}
            title={data.title}
            seats={data.seats}
            defaultOpen={idx === 0}
          >
            <FourSections
              base={data.sections.base}
              detail={data.sections.detail}
              criteria={data.sections.criteria}
              extra={data.sections.extra}
            />
          </AccordRound>
        ))}
      </>
    );
  };

  return (
    <section className="card card-translucent">
      <div className="round-rail">
        <button
          className={`round-pill ${round === 0 ? "is-active" : ""}`}
          onClick={() => setRound(0)}
        >
          i
        </button>
        {[1, 2, 3, 4].map((r) => (
          <button
            key={r}
            className={`round-pill ${round === r ? "is-active" : ""}`}
            onClick={() => setRound(r)}
          >
            รอบ {r}
          </button>
        ))}
      </div>

      <div className="card-inner">
        <header className="card-head">
          <div className="card-logo">
            <img
              src={assets.official_logo}
              alt="KKU logo"
              className="card-logo-img"
            />
          </div>
          <div className="card-title-wrap">
            <h2 className="card-title">{course.title}</h2>
            <div className="card-dash" />
          </div>
        </header>

        <h3 className="card-sub">{roundTitle[round]}</h3>

        <div key={round} className="card-detail fade-in">
          {renderRound(round)}
        </div>
      </div>
    </section>
  );
}

export default function Admission() {
  return (
    <main className="card-wrap" style={{ position: 'relative', paddingBottom: '170px' }}>
      {/* Background image positioned absolutely */}
      <img 
        src={assets.bgImage1} 
        alt="" 
        className="absolute pointer-events-none opacity-70"
        style={{ 
          width: '700px',
          height: '700px',
          top: '-180px', 
          right: '10px',
          zIndex: 0
        }}
      />

      <img 
        src={assets.bgImage1} 
        alt="" 
        className="absolute pointer-events-none opacity-70"
        style={{ 
          width: '700px',
          height: '700px',
          top: '700px', 
          left: '10px',
          zIndex: 0
        }}
      />
      
      {/* Content wrapper with higher z-index */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* New Title Section - Same style as Activity page */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#1a1a1a'
          }}>
            เกณฑ์การรับเข้า
          </h1>
          <div style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(to right, #dc2626, #7d1315)',
            margin: '1rem auto',
            borderRadius: '2px'
          }}></div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            คุณสมบัติและขั้นตอนการสมัครสำหรับผู้สนใจเข้าศึกษา
          </p>
        </div>

        {COURSES.map((c, i) => (
          <CourseCard key={i} course={c} index={i} />
        ))}
      </div>
    </main>
  );
}