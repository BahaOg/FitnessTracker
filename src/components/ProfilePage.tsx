import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  gender: string;
  height: string;
  weight: string;
  birthDate: string;
  GOAL: string;
}

interface ProfilePageProps {
  user: User;
  onProfileUpdate: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    password: '',
    height: user.height,
    weight: user.weight,
    birthDate: user.birthDate,
    GOAL: user.GOAL
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.height.trim()) newErrors.height = 'Height is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.GOAL) newErrors.GOAL = 'Goal is required';

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
      const token = localStorage.getItem('token');
      const updateData: any = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        height: formData.height.trim(),
        weight: formData.weight.trim(),
        birthDate: formData.birthDate,
        GOAL: formData.GOAL
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        alert(data.message);
        return;
      }
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Call the callback to update parent component
      onProfileUpdate(data.user);
      
      alert('Profile updated successfully!');
      
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }));
      
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatGoalDisplay = (goal: string) => {
    switch (goal) {
      case 'lose weight': return 'Lose weight';
      case 'gain weight': return 'Gain weight';
      case 'maintain weight': return 'Maintain weight';
      default: return goal;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Profile Details</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="John"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              className={errors.surname ? 'error' : ''}
              placeholder="Doe"
            />
            {errors.surname && <span className="error-message">{errors.surname}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              disabled
              className="disabled-field"
              placeholder="johndoe@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Leave empty to keep current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '•••••'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                disabled
                className="disabled-field"
                placeholder="Male"
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height</label>
              <input
                type="text"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={errors.height ? 'error' : ''}
                placeholder="180 cm"
              />
              {errors.height && <span className="error-message">{errors.height}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={errors.weight ? 'error' : ''}
                placeholder="75 kg"
              />
              {errors.weight && <span className="error-message">{errors.weight}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="birthdate">Birth Date</label>
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

          <div className="form-group">
            <label htmlFor="GOAL">Goal</label>
            <select
              id="GOAL"
              name="GOAL"
              value={formData.GOAL}
              onChange={handleInputChange}
              className={errors.GOAL ? 'error' : ''}
            >
              <option value="">Select your fitness goal</option>
                                  <option value="lose weight">Lose weight</option>
              <option value="gain weight">Gain weight</option>
              <option value="maintain weight">Maintain weight</option>
            </select>
            {errors.GOAL && <span className="error-message">{errors.GOAL}</span>}
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 