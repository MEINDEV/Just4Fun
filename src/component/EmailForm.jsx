import React, { useState } from 'react';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/handleEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) alert('Sent!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Styles based on your image
  const styles = {
    container: {
      backgroundColor: '#00040f', // Deep dark background
      color: '#ffffff',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '300px'
    },
    form: {
      width: '100%',
      maxWidth: '350px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
      textAlign: 'left'
    },
    input: {
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid #444',
      color: '#ccc',
      padding: '8px 0',
      fontSize: '14px',
      outline: 'none'
    },
    button: {
      marginTop: '30px',
      backgroundColor: 'transparent',
      color: '#fff',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      textAlign: 'center',
      opacity: loading ? 0.5 : 1,
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.title}>Contact Us</h3>
        
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Recipient Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Recipient Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          style={styles.input}
          type="text"
          name="message"
          placeholder="Generic Message Details"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;