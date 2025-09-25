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
};

const COURSES: Course[] = [
  {
    title: "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์) วิศวกรรมคอมพิวเตอร์",
    engTitle: "Bachelor of Engineering (Computer Engineering)",
    campus: "ขอนแก่น",
    fee: "20,000 บาท/เทอม",
    seats: { r1: 32, r2: 38, r3: 34, r4: "ยังไม่เปิดรับสมัคร" },
  },
  {
    title:
      "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมสื่อดิจิทัล) หลักสูตรนานาชาติ วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ",
    engTitle: "Bachelor of Engineering (Digital Media Engineering) International Program",
    campus: "ขอนแก่น",
    fee: "50,000 บาท/เทอม",
    seats: { r1: 21, r2: 10, r3: 20, r4: "ยังไม่เปิดรับสมัคร" },
  },
];


function AccordRound({
  title,
  seats,
  children,
  defaultOpen = true,
}: {
  title: string;
  seats?: number | string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accord ${open ? "open" : ""}`}>
      <button className="accord-head" onClick={() => setOpen(!open)}>
        <span className="accord-title">{title}</span>
        <span className="accord-right">
          {typeof seats !== "undefined" && <span className="accord-badge">รับ {seats} คน</span>}
          <span className={`accord-caret ${open ? "up" : ""}`} aria-hidden>
            ▾
          </span>
        </span>
      </button>
      {open && <div className="accord-body">{children}</div>}
    </div>
  );
}


function FourSections({
  base,
  detail,
  criteria,
  extra,
}: {
  base: React.ReactNode;
  detail: React.ReactNode;
  criteria: React.ReactNode;
  extra: React.ReactNode;
}) {
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


type RoundContent = {
  title: string;
  seats?: number | string;
  sections?: {
    base: React.ReactNode;
    detail: React.ReactNode;
    criteria: React.ReactNode;
    extra: React.ReactNode;
  };
  content?: React.ReactNode;
};
type CourseRounds = Record<Exclude<Round, 0>, RoundContent[]>;

const PER_COURSE_ROUNDS: Record<number, CourseRounds> = {
  0: {
    1: [
      {
        title:
          "วิศวกรรมคอมพิวเตอร์ โครงการผู้มีศักยภาพสูง",
        seats: 24,
        sections: {
          base: (
            <ul className="bul">
              <li>
                รับผู้สมัครที่จบจาก รร. หลักสูตรแกนกลาง</li>
              <li>รับผู้สมัครที่จบจาก รร. หลักสูตรนานาชาติ</li>
              <li>รับผู้สมัครที่จบจาก รร. หลักสูตรอาชีวะ</li>
              <li>
                ไม่รับผู้สมัครที่จบจาก รร. หลักสูตรตามอัธยาศัย (กศน.)
              </li>
              <li>รับผู้สมัครที่จบหลักสูตร GED</li>
              <li>คะแนน GPAX ต่ำสุด 3</li>
              <li>ต้องสำเร็จการศึกษาปีปัจจุบันเท่านั้น</li>
            </ul>
          ),
          detail: (
            <ul className="bul">
              <li>
                เป็นผู้ที่กำลังศึกษาอยู่ในชั้นมัธยมศึกษาปีที่ 6 (ม.6) หรือเทียบเท่า (ปวช.) หรือ (2.) เป็นผู้ที่มีคะแนน GED</li>
            </ul>
          ),
          criteria: (
            <ul className="bul">
              <li>พิจารณาคุณภาพผลงาน + สัมภาษณ์ (ถ้ามี)</li>
            </ul>
          ),
          extra: (
            <ul className="bul">
              <li>(1.) ผู้ที่กำลังศึกษาอยู่ในชั้นมัธยมศึกษาปีที่ 6 (ม.6) หรือเทียบเท่า (ปวช.)  มีผลการเรียนเฉลี่ยระดับมัธยมศึกษาตอนปลาย 4 ภาคการศึกษา ไม่ต่ำกว่า 3.00  และมีผลการเรียนเฉลี่ยในกลุ่มวิชาคณิตศาสตร์ กลุ่มวิชาเคมี และกลุ่มวิชาฟิสิกส์ รวมทุกกลุ่มไม่ต่ำกว่า 3.00 หรือ (2.) ผู้ที่มีคะแนน GED จำนวน 4 รายวิชา แต่ละรายวิชามีคะแนนไม่ต่ำกว่า 145 คะแนน และผู้สมัครมีอายุไม่ต่ำกว่า 16 ปีขึ้นไป (3.) มีผลงานทางวิชาการ หรือผ่านการเข้าร่วมโครงการทางวิชาการ ด้านวิทยาศาสตร์ คณิตศาสตร์ หรือคอมพิวเตอร์ ที่ดำเนินการในชั้นมัธยมปลาย ในระดับจังหวัด ระดับภูมิภาค ระดับชาติ หรือระดับนานาชาติ หรือผลงานอื่นๆ หรือมีผลการทดสอบภาษาต่างประเทศ โดยมีการให้คะแนนตามเอกสารที่แนบ (ดาวน์โหลดได้ที่ลิงก์https://kku.world/porten68)</li>
            </ul>
          ),
        },
      },
      {
        title:
          "วิศวกรรมคอมพิวเตอร์ โครงการรับนักเรียนจากโรงเรียนที่มีศักยภาพสูง",
        seats: 8,
        sections: {
          base: <p>ต้องเป็นโรงเรียนเครือข่ายที่ภาควิชากำหนด</p>,
          detail: <p>แนบหนังสือรับรอง/ผลงานที่เกี่ยวข้อง</p>,
          criteria: <p>คัดเลือกตามเกณฑ์โครงการ</p>,
          extra: <p>ประสานครูแนะแนวเพื่อเอกสาร (ถ้ามี)</p>,
        },
      },
    ],
    2: [
      {
        title:
          "วิศวกรรมคอมพิวเตอร์ โควตาภาคตะวันออกเฉียงเหนือ",
        seats: 38,
        sections: {
          base: <p>เฉพาะโรงเรียนในพื้นที่ภาคตะวันออกเฉียงเหนือ</p>,
          detail: (
            <ul className="bul">
              <li>GPAX ≥ 3.00</li>
              <li>แนบผลสอบวิชาสามัญ/วิชาเฉพาะตามประกาศ</li>
            </ul>
          ),
          criteria: <p>เรียงตามคะแนนรวมตามสูตรที่ประกาศ</p>,
          extra: <p>รายละเอียดอื่น ๆ เป็นไปตามประกาศมหาวิทยาลัย</p>,
        },
      },
    ],
    3: [
      {
        title: "คณะวิศวกรรมศาสตร์ วศ.บ. (วิศวกรรมคอมพิวเตอร์) วิศวกรรมคอมพิวเตอร์",
        seats: 34,
        sections: {
          base: <p>รับผ่านระบบกลาง TCAS</p>,
          detail: <p>องค์ประกอบ: GPAX, GAT/PAT, วิชาสามัญ ฯลฯ</p>,
          criteria: <p>ผ่านขั้นต่ำและเรียงคะแนนรวม</p>,
          extra: <p>สูตรคะแนนระบุในประกาศรับสมัคร</p>,
        },
      },
    ],
    4: [
      {
        title: "Direct Admission",
        seats: "-",
        content: (
          <p>-</p>
        ),
      },
    ],
  },

  1: {
    1: [
      {
        title: "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ โครงการรับนักเรียนจากโรงเรียนที่มีศักยภาพสูง"
        ,
        seats: 4,
        sections: {
          base: <p>โชว์เคสงานสื่อดิจิทัล (PDF/ลิงก์)</p>,
          detail: (
            <ul className="bul">
              <li>แนะนำแนบวิดีโอ/รีล/สตอรี่บอร์ดประกอบ</li>
            </ul>
          ),
          criteria: <p>สัมภาษณ์อธิบายแนวคิด (EN/TH)</p>,
          extra: <p>แนบลิงก์ผลงานออนไลน์ได้</p>,
        },
      },
      {
        title: "ควิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ โครงการผู้มีศักยภาพสูง"
        ,
        seats: 20,
        sections: {
          base: <p>ยื่นผลงานภาพนิ่ง/วิดีโอ พร้อมอธิบายกระบวนการ</p>,
          detail: <p>ควรมีเครดิต/เครื่องมือที่ใช้</p>,
          criteria: <p>พิจารณาคุณภาพผลงานและการสื่อสาร</p>,
          extra: <p>อาจมี Workshop/Interview เพิ่ม</p>,
        },
      },
    ],
    2: [
      {
        title: "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ โควตาภาคตะวันออกเฉียงเหนือ"
        ,
        seats: 12,
        sections: {
          base: <p>จบจาก EP/International หรือเทียบเท่า</p>,
          detail: <p>ผลสอบภาษาอังกฤษขั้นต่ำ + GPAX ตามเกณฑ์</p>,
          criteria: <p>คัดตามคะแนนรวม</p>,
          extra: <p>สัมภาษณ์เป็นภาษาอังกฤษ</p>,
        },
      },
    ],
    3: [
      {
        title: "วิศวกรรมสื่อดิจิทัล หลักสูตรนานาชาติ",
        seats: 9,
        sections: {
          base: <p>รับผ่าน TCAS</p>,
          detail: <p>GPAX + วิชาสามัญ (EN, MTH, SCI)</p>,
          criteria: <p>ผ่านขั้นต่ำและเรียงคะแนนรวม</p>,
          extra: <p>สูตรคะแนนตามประกาศ</p>,
        },
      },
    ],
    4: [
      {
        title: "Direct Admission",
        seats: "-",
        content: (
          <p>-</p>
        ),
      },
    ],
  },
};

function CourseCard({ course, index }: { course: Course; index: number }) {
  const [round, setRound] = useState<Round>(0);

  const roundTitle: Record<Round, string> = {
    0: "รายละเอียด",
    1: "รอบ 1 Portfolio",
    2: "รอบ 2 Quota",
    3: "รอบ 3 Admission",
    4: "รอบ 4 Direct Admission",
  };

  const renderRound = (r: Round) => {
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
            <div className="v">{index === 0 ? "ภาษาไทย ปกติ" : "หลักสูตรนานาชาติ"}</div>
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

    const dataList = PER_COURSE_ROUNDS[index][r];
    return (
      <>
        {dataList.map((data, idx) => (
          <AccordRound key={idx} title={data.title} seats={data.seats} defaultOpen={idx === 0}>
            {data.sections ? (
              <FourSections
                base={data.sections.base}
                detail={data.sections.detail}
                criteria={data.sections.criteria}
                extra={data.sections.extra}
              />
            ) : (
              data.content
            )}
          </AccordRound>
        ))}
      </>
    );
  };

  return (
    <section className="card card-translucent">
      {/* แถบ i/รอบ ด้านซ้าย */}
      <div className="round-rail">
        <button className={`round-pill ${round === 0 ? "is-active" : ""}`} onClick={() => setRound(0)}>
          i
        </button>
        {[1, 2, 3, 4].map((r) => (
          <button
            key={r}
            className={`round-pill ${round === r ? "is-active" : ""}`}
            onClick={() => setRound(r as Round)}
          >
            รอบ {r}
          </button>
        ))}
      </div>

      <div className="card-inner">
        <header className="card-head">
          <div className="card-logo">
            <img src="/kku-logo.png" alt="KKU logo" className="card-logo-img" />
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
    <main className="card-wrap">
      <h1 className="card-page-title">ข้อมูลการรับสมัคร</h1>
      {COURSES.map((c, i) => (
        <CourseCard key={i} course={c} index={i} />
      ))}
    </main>
  );
}
