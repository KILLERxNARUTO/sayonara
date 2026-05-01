import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ContactForm.css';

const PROJECT_TYPES = [
  { value: 'web', label: 'Web Application' },
  { value: 'ai', label: 'AI Automation' },
  { value: 'mobile', label: 'Mobile Application' },
];

function CustomSelect({ value, onChange, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = PROJECT_TYPES.find(t => t.value === value)?.label || 'Select a project type';

  return (
    <div className="custom-select" ref={dropdownRef}>
      <button
        type="button"
        className="custom-select-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" className={`select-arrow ${isOpen ? 'open' : ''}`}>
          <path fill="#FF9FFC" d="M6 9L1 4h10z" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`custom-select-option ${value === type.value ? 'selected' : ''}`}
              onClick={() => {
                onChange({ target: { name, value: type.value } });
                setIsOpen(false);
              }}
            >
              <span className="option-dot" />
              {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    projectType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const contentRef = useRef(null);

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background fade in
      gsap.fromTo('.contact-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      // Card slide up
      gsap.fromTo('.contact-card',
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, delay: 0.1, ease: 'expo.out' }
      );

      // Title slides in
      gsap.fromTo('.contact-title',
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, delay: 0.3, ease: 'expo.out' }
      );

      // Subtitle follows
      gsap.fromTo('.contact-subtitle',
        { opacity: 0, y: 30, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, delay: 0.5, ease: 'expo.out' }
      );

      // Form fields stagger
      gsap.utils.toArray('.form-field').forEach((field, i) => {
        gsap.fromTo(field,
          { opacity: 0, y: 25, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.8,
            delay: 0.6 + i * 0.1,
            ease: 'expo.out',
          }
        );
      });

      // Button appears last
      gsap.fromTo('.contact-submit-btn',
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.8,
          delay: 1,
          ease: 'back.out(1.5)',
        }
      );

      // Close button
      gsap.fromTo('.contact-close-btn',
        { opacity: 0, rotation: -90 },
        { opacity: 1, rotation: 0, duration: 0.8, delay: 1, ease: 'expo.out' }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  /* ── Exit animation on close ── */
  const handleClose = () => {
    const ctx = gsap.context(() => {
      gsap.to('.contact-overlay', { opacity: 0, duration: 0.3, ease: 'power2.in' });
      gsap.to('.contact-card', {
        opacity: 0, y: 60, filter: 'blur(10px)',
        duration: 0.5, ease: 'expo.in',
        onComplete: () => onClose(),
      });
    }, formRef);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.projectType) {
      alert('Please fill in all fields');
      return;
    }

    // Show success animation
    const ctx = gsap.context(() => {
      gsap.to('.contact-form', {
        opacity: 0, y: -20,
        duration: 0.5, ease: 'power2.in',
        onComplete: () => setSubmitted(true),
      });
    }, formRef);
  };

  return (
    <div className="contact-overlay" ref={formRef}>
      <div className="contact-card">
        <button className="contact-close-btn" onClick={handleClose} aria-label="Close form">
          ✕
        </button>

        {!submitted ? (
          <div className="contact-form" ref={contentRef}>
            <h2 className="contact-title">Let's Build Together</h2>
            <p className="contact-subtitle">Tell us about your project and we'll get in touch shortly.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="projectType">Project Type</label>
                <CustomSelect
                  value={formData.projectType}
                  onChange={handleChange}
                  name="projectType"
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Start Your Project
              </button>
            </form>
          </div>
        ) : (
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Thank You!</h2>
            <p className="success-message">
              We've received your details and will get back to you within 24 hours.
            </p>
            <button className="success-btn" onClick={handleClose}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
