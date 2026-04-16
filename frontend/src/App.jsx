import { useEffect, useMemo, useState } from "react";
import {
  FaLaptopCode,
  FaFlask,
  FaUserGraduate,
  FaBriefcase,
  FaRocket,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = { name: "", email: "", password: "" };
const initialApplicationForm = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
};
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

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [applicationForm, setApplicationForm] = useState(initialApplicationForm);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
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

  const titleText = useMemo(
    () => (isLoginMode ? "Student Login" : "New Student Registration"),
    [isLoginMode]
  );
  const dashboardHeading = useMemo(() => {
    if (!dashboard?.heading) return "Welcome to GROWUP ADMISSIONS";
    return dashboard.heading.replace(/Prince College Admission Portal/gi, "GROWUP ADMISSIONS");
  }, [dashboard]);
  const contactDetails = useMemo(() => {
    const fallback = {
      phone: "8962253601",
      email: "growupadmissions@gmail.com",
      address: "MIG-210, Gautam Nagar, Bhopal, MP 462023",
    };
    return {
      phone: dashboard?.contact?.phone || fallback.phone,
      email: dashboard?.contact?.email || fallback.email,
      address: dashboard?.contact?.address || fallback.address,
    };
  }, [dashboard]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplicationChange = (event) => {
    const { name, value } = event.target;
    setApplicationForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveAuthData = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
  };

  const loadDashboard = async (authToken) => {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not load dashboard");
    }
    setDashboard(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const endpoint = isLoginMode ? "login" : "register";
    const payload = isLoginMode
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      saveAuthData(data);
      setMessage(data.message);
      setFormData(initialForm);
      await loadDashboard(data.token);
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage("Server se connection nahi hua. Backend run hai ya nahi check karo.");
      } else {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setDashboard(null);
    setMessage("Logged out successfully");
  };

  const openApplyModal = (courseName) => {
    setSelectedCourse(courseName);
    setApplicationForm(initialApplicationForm);
    setApplicationMessage("");
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplicationLoading(false);
  };

  const handleApplySubmit = async (event) => {
    event.preventDefault();
    setApplicationLoading(true);
    setApplicationMessage("");

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseName: selectedCourse,
          ...applicationForm,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not submit application");
      }

      setApplicationMessage("Form submitted successfully!");
      setTimeout(() => {
        closeApplyModal();
      }, 1200);
    } catch (error) {
      setApplicationMessage(error.message);
    } finally {
      setApplicationLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    loadDashboard(token).catch(() => {
      handleLogout();
      setMessage("Session expired. Please login again.");
    });
  }, [token]);

  if (token && user && dashboard) {
    return (
      <main className="container">
        <header className="hero">
          <div>
            <p className="badge">Admissions Open {dashboard.admissionYear}</p>
            <h1 className="hero-title">{dashboardHeading}</h1>
            <p>
              Welcome <strong>{user.name}</strong>! Explore available courses and
              contact us for admission support.
            </p>
          </div>
          <div className="profile-box">
            <div className="profile-top">
              <FaUserCircle />
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
            </div>
            <button className="btn logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <section className="courses-wrap">
          <div className="section-head">
            <h2>Popular Programs</h2>
            <p>Swipe and explore top career-focused courses</p>
          </div>
          <div className="carousel-track">
            {dashboard.courses.map((course) => (
              <article key={course.id} className="card course-card">
                <div className="course-top">
                  <div className="course-icon">
                    {(() => {
                      const Icon = courseMeta[course.name]?.icon || FaRocket;
                      return <Icon />;
                    })()}
                  </div>
                  <span className="pill">{courseMeta[course.name]?.level || "Program"}</span>
                </div>
                <h3>{course.name}</h3>
                <p className="course-duration">Duration: {course.duration}</p>
                <button className="btn" onClick={() => openApplyModal(course.name)}>
                  Apply Now
                </button>
              </article>
            ))}
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

        <section className="testimonial">
          <h2>Student Voice</h2>
          <p>
            "GrowUp Admissions process was very smooth and helpful. Faculty and
            support team guided me at each step."
          </p>
          <strong>- Riya Sharma, B.Tech Student</strong>
        </section>

        <section className="events">
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            <article>
              <h4>Campus Tour Day</h4>
              <p>Visit labs, classrooms and student activity zone.</p>
            </article>
            <article>
              <h4>Career Counselling</h4>
              <p>Get one-to-one guidance for best course selection.</p>
            </article>
            <article>
              <h4>Scholarship Help Desk</h4>
              <p>Learn about financial support and merit scholarships.</p>
            </article>
          </div>
        </section>

        <section className="faq">
          <h2>Quick FAQ</h2>
          <div className="faq-list">
            <p>Q: Is the admission process online? <strong>A: Yes, it is fully online.</strong></p>
            <p>
              Q: When do I submit documents?{" "}
              <strong>A: After form submission, at the counseling stage.</strong>
            </p>
          </div>
        </section>

        <section className="contact">
          <h2>Contact Us</h2>
          <p>Phone: {contactDetails.phone}</p>
          <p>Email: {contactDetails.email}</p>
          <p>Address: {contactDetails.address}</p>
        </section>

        {showApplyModal && (
          <section className="modal-overlay">
            <div className="modal">
              <div className="modal-head">
                <h3>Apply for {selectedCourse}</h3>
                <button className="close-btn" onClick={closeApplyModal}>
                  X
                </button>
              </div>
              <form onSubmit={handleApplySubmit} className="apply-form">
                <label>
                  First Name
                  <input
                    name="firstName"
                    value={applicationForm.firstName}
                    onChange={handleApplicationChange}
                    required
                  />
                </label>
                <label>
                  Last Name
                  <input
                    name="lastName"
                    value={applicationForm.lastName}
                    onChange={handleApplicationChange}
                    required
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    name="phoneNumber"
                    value={applicationForm.phoneNumber}
                    onChange={handleApplicationChange}
                    required
                  />
                </label>
                <label>
                  Address
                  <textarea
                    name="address"
                    value={applicationForm.address}
                    onChange={handleApplicationChange}
                    rows={3}
                    required
                  />
                </label>
                <button className="btn" type="submit" disabled={applicationLoading}>
                  {applicationLoading ? "Submitting..." : "Submit Application"}
                </button>
                {applicationMessage && (
                  <p className="message application-message">{applicationMessage}</p>
                )}
              </form>
            </div>
          </section>
        )}
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-box">
        <p className="badge">GROWUP ADMISSIONS</p>
        <h1>{titleText}</h1>

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <label>
              Full Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Enter password"
            />
          </label>

          <button className="btn submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLoginMode ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch">
          {isLoginMode ? "New here?" : "Already registered?"}
          <button
            className="link-btn"
            type="button"
            onClick={() => {
              setIsLoginMode((prev) => !prev);
              setMessage("");
              setFormData(initialForm);
            }}
          >
            {isLoginMode ? "Create account" : "Login now"}
          </button>
        </p>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
}

export default App;
