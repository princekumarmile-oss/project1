import { useMemo, useRef } from "react";
import {
  FaLaptopCode,
  FaFlask,
  FaUserGraduate,
  FaBriefcase,
  FaRocket,
} from "react-icons/fa";
import "./App.css";

const courseMeta = {
  "B.Tech": {
    icon: FaLaptopCode,
    level: "Undergraduate",
  },
  "M.Tech": {
    icon: FaUserGraduate,
    level: "Postgraduate",
  },
  "B.Pharma": {
    icon: FaFlask,
    level: "Undergraduate",
  },
  "D.Pharma": {
    icon: FaFlask,
    level: "Diploma",
  },
  MBA: {
    icon: FaBriefcase,
    level: "Postgraduate",
  },
  BCA: {
    icon: FaLaptopCode,
    level: "Undergraduate",
  },
};

const dashboard = {
  heading: "GrowUp College Admissions",
  admissionYear: "2026-27",
  description:
    "A talented college experience built for future leaders in engineering, business, and pharmacy.",
  contact: {
    phone: "8962253601",
    email: "growupadmissions@gmail.com",
    address: "MIG-210, Gautam Nagar, Bhopal, MP 462023",
  },
  courses: [
    { id: 1, name: "B.Tech", duration: "4 years" },
    { id: 2, name: "M.Tech", duration: "2 years" },
    { id: 3, name: "MBA", duration: "2 years" },
    { id: 4, name: "BCA", duration: "3 years" },
  ],
};

const dashboardStats = [
  { label: "Programs", value: "25+" },
  { label: "Placements", value: "1200+" },
  { label: "Faculty", value: "150+" },
  { label: "Campus Recruiters", value: "90+" },
];

const highlights = [
  "NAAC Accredited Campus",
  "Smart Digital Classrooms",
  "Industry Linked Curriculum",
  "Scholarship Support",
];

function App() {
  const heroTitle = useMemo(() => dashboard.heading, []);
  const coursesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="container">
      <header className="hero dashboard-hero">
        <div className="hero-copy">
          <p className="badge">Admissions Open {dashboard.admissionYear}</p>
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-text">{dashboard.description}</p>
          <div className="hero-actions">
            <button className="btn" onClick={scrollToCourses}>
              Explore Courses
            </button>
            <button className="btn btn-outline" onClick={scrollToContact}>
              Contact Admissions
            </button>
          </div>
          <div className="hero-contact">
            <p>
              <strong>Call:</strong> {dashboard.contact.phone}
            </p>
            <p>
              <strong>Email:</strong> {dashboard.contact.email}
            </p>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80"
            alt="College campus"
          />
        </div>
      </header>

      <section className="hero-gallery">
        <article className="hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
            alt="College admission"
          />
          <p>Admission support and campus tours</p>
        </article>
        <article className="hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
            alt="Study group"
          />
          <p>Collaborative learning environment</p>
        </article>
      </section>

      <section className="courses-wrap" ref={coursesRef}>
        <div className="section-head">
          <h2>Popular Programs</h2>
          <p>Choose from our top admission-ready courses.</p>
        </div>
        <div className="carousel-track">
          {dashboard.courses.map((course) => {
            const Icon = courseMeta[course.name]?.icon || FaRocket;
            return (
              <article key={course.id} className="card course-card">
                <div className="course-top">
                  <div className="course-icon">
                    <Icon />
                  </div>
                  <span className="pill">{courseMeta[course.name]?.level || "Program"}</span>
                </div>
                <h3>{course.name}</h3>
                <p className="course-duration">Duration: {course.duration}</p>
                <button className="btn">Apply Now</button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="stats">
        {dashboardStats.map((item) => (
          <article key={item.label} className="stat-card">
            <p className="stat-value">{item.value}</p>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="highlights">
        <h2>Why Choose GrowUp</h2>
        <div className="highlight-grid">
          {highlights.map((point) => (
            <article key={point} className="highlight-card">
              <span>★</span>
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" ref={contactRef}>
        <h2>Contact Admissions</h2>
        <p>Phone: {dashboard.contact.phone}</p>
        <p>Email: {dashboard.contact.email}</p>
        <p>Address: {dashboard.contact.address}</p>
      </section>
    </main>
  );
}

export default App;
