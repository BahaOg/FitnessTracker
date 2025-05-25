import React, { useState } from 'react';
import './RegisterPage.css';

interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  gender: string;
  height: string;
  weight: string;
  birthDate: string;
  GOAL: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    gender: '',
    height: '',
    weight: '',
    birthDate: '',
    GOAL: ''
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof UserData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.height.trim()) newErrors.height = 'Height is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.GOAL) newErrors.GOAL = 'Fitness goal is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create user object with the form data
      const userObject: UserData = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        gender: formData.gender,
        height: formData.height.trim(),
        weight: formData.weight.trim(),
        birthDate: formData.birthDate,
        GOAL: formData.GOAL
      };

      console.log('User object created:', userObject);
      
      // Here you would typically send the data to your backend
      // For now, we'll just log it and show a success message
      alert('Registration successful! User object created.');
      
      // Reset form
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        gender: '',
        height: '',
        weight: '',
        birthDate: '',
        GOAL: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Create Your Account</h1>
        <p className="register-subtitle">Join our fitness community and start your journey</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">First Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter your first name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="surname">Last Name *</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className={errors.surname ? 'error' : ''}
                  placeholder="Enter your last name"
                />
                {errors.surname && <span className="error-message">{errors.surname}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Create a password (min. 6 characters)"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Birth Date *</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className={errors.birthDate ? 'error' : ''}
              />
              {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
            </div>
          </div>

          {/* Body Information */}
          <div className="form-section">
            <h3 className="section-title">Body Information</h3>
            
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height *</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={errors.height ? 'error' : ''}
                  placeholder="e.g., 175 cm or 5'9&quot;"
                />
                {errors.height && <span className="error-message">{errors.height}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight *</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={errors.weight ? 'error' : ''}
                  placeholder="e.g., 70 kg or 154 lbs"
                />
                {errors.weight && <span className="error-message">{errors.weight}</span>}
              </div>
            </div>
          </div>

          {/* Fitness Goal */}
          <div className="form-section">
            <h3 className="section-title">Fitness Goal</h3>
            
            <div className="form-group">
              <label htmlFor="GOAL">What's your primary fitness goal? *</label>
              <select
                id="GOAL"
                name="GOAL"
                value={formData.GOAL}
                onChange={handleInputChange}
                className={errors.GOAL ? 'error' : ''}
              >
                <option value="">Select your fitness goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
              </select>
              {errors.GOAL && <span className="error-message">{errors.GOAL}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 