import { useMemo, useRef, useState } from "react";
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
  BBA: {
    icon: FaBriefcase,
    level: "Undergraduate",
  },
  "B.Sc": {
    icon: FaRocket,
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
    { id: 5, name: "BBA", duration: "3 years" },
    { id: 6, name: "B.Pharma", duration: "4 years" },
    { id: 7, name: "D.Pharma", duration: "2 years" },
    { id: 8, name: "B.Sc", duration: "3 years" },
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
  const applicationRef = useRef(null);
  const contactRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "";

  const [selectedCourse, setSelectedCourse] = useState(dashboard.courses[0].name);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToApplication = (courseName) => {
    setSelectedCourse(courseName);
    applicationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    if (!selectedCourse || !firstName || !lastName || !email || !phoneNumber || !address) {
      setStatusMessage("Please complete all fields before submitting.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: selectedCourse,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to submit application.");
      }

      setStatusMessage("Application sent successfully. We will contact you soon.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
    } catch (error) {
      setStatusMessage(error.message || "Submission failed. Please try again.");
    }
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
                <button className="btn" onClick={() => scrollToApplication(course.name)}>
                  Apply Now
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="application-form" ref={applicationRef}>
        <div className="section-head">
          <h2>Apply Now</h2>
          <p>Fill in your details and submit. We’ll send your application to the admissions team immediately.</p>
        </div>
        <div className="course-tabs">
          {dashboard.courses.map((course) => (
            <button
              key={course.id}
              type="button"
              className={`course-tab ${selectedCourse === course.name ? "active" : ""}`}
              onClick={() => setSelectedCourse(course.name)}
            >
              {course.name}
            </button>
          ))}
        </div>
        <div className="application-heading">
          <h3>Selected: {selectedCourse}</h3>
          <p>
            {courseMeta[selectedCourse]?.level} • Duration: {dashboard.courses.find((course) => course.name === selectedCourse)?.duration}
          </p>
        </div>
        <form className="form-grid" onSubmit={submitApplication}>
          <div className="form-group">
            <label>Course</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              {dashboard.courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" />
          </div>
          <div className="form-group full-width">
            <label>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Residential address" rows={4} />
          </div>
          <div className="form-actions full-width">
            <button className="btn" type="submit">
              Submit Application
            </button>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </div>
        </form>
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
