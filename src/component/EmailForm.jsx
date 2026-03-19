import React,{ useState } from "react";

const SERVICES = [
  "Consulting",
  "Software Development",
  "Design & Branding",
  "Cloud Infrastructure",
  "Support & Maintenance",
];

const OFFICES = [
  "New York",
  "San Francisco",
  "London",
  "Berlin",
  "Singapore",
];

const API_ENDPOINT = "/api/handleEmail"; // ← Replace with your endpoint

export default function EmailForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    office: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        office: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Send Us a Message</h2>

        {status === "success" && (
          <div style={{ ...styles.banner, ...styles.successBanner }}>
            ✅ Your message has been sent successfully!
          </div>
        )}
        {status === "error" && (
          <div style={{ ...styles.banner, ...styles.errorBanner }}>
            ❌ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 555 123 4567"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="company">
                Company <span style={styles.required}>*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="service">I'm interested in</label>
              <div style={styles.selectWrapper}>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span style={styles.chevron}>▾</span>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="office">Preferred Office</label>
              <div style={styles.selectWrapper}>
                <select
                  id="office"
                  name="office"
                  value={formData.office}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select preferred office</option>
                  {OFFICES.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <span style={styles.chevron}>▾</span>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div style={{ ...styles.field, width: "100%" }}>
            <label style={styles.label} htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="How can we help you?"
              value={formData.subject}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Message */}
          <div style={{ ...styles.field, width: "100%" }}>
            <label style={styles.label} htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Please provide details about your inquiry..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              style={styles.textarea}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              ...styles.button,
              ...(status === "loading" ? styles.buttonDisabled : {}),
            }}
          >
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
    padding: "32px 16px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "620px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "28px",
  },
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginBottom: "20px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "6px",
  },
  required: {
    color: "#3b82f6",
  },
  input: {
    border: "1.5px solid #d1d5db",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#374151",
    outline: "none",
    transition: "border-color 0.15s",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
  },
  selectWrapper: {
    position: "relative",
    width: "100%",
  },
  select: {
    width: "100%",
    border: "1.5px solid #d1d5db",
    borderRadius: "6px",
    padding: "10px 36px 10px 14px",
    fontSize: "14px",
    color: "#374151",
    appearance: "none",
    backgroundColor: "#fff",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  chevron: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#6b7280",
    fontSize: "14px",
  },
  textarea: {
    border: "1.5px solid #d1d5db",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#374151",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "120px",
  },
  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.15s",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  banner: {
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  successBanner: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },
};