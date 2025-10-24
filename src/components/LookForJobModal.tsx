'use client';

import { useState, useEffect } from 'react';

interface LookForJobModalProps {
  onClose: () => void;
  onJobSeekerRegistered: () => void;
}

export default function LookForJobModal({ onClose, onJobSeekerRegistered }: LookForJobModalProps) {
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    district: '',
    location: '',
    // Step 2: Education & Skills
    qualification: '',
    skills: '',
    experience: '',
    // Step 3: Job Preferences
    preferredJobType: '',
    preferredCategory: '',
    preferredSubcategory: '',
    jobTitle: '',
    expectedSalary: '',
    availability: '',
    languageProficiency: '',
    // Step 4: Resume
    resumeUrl: '',
  });
  const [availableJobTitles, setAvailableJobTitles] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const tamilNaduDistricts = [
    'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'
  ];

  useEffect(() => {
    fetchJobTitles();
    fetchCategories();
  }, []);

  const fetchJobTitles = async () => {
    try {
      const response = await fetch('/api/jobs');
      const jobs = await response.json();
      const titles: any = [...new Set(jobs.map((job: any) => job.title))];
      setAvailableJobTitles(titles);
    } catch (error) {
      console.error('Error fetching job titles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Handle category change to update subcategories
    if (name === 'preferredCategory') {
      const selectedCategory = categories.find(c => c.name === value);
      setSubcategories(selectedCategory?.subcategories || []);
      setFormData(prev => ({ ...prev, preferredSubcategory: '' })); // Reset subcategory
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/resume', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, resumeUrl: data.url }));
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/job-seekers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onJobSeekerRegistered();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to register as job seeker');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.dateOfBirth && formData.gender && 
               formData.contactNumber && formData.email && formData.district && formData.location;
      case 2:
        return formData.qualification;
      case 3:
        return formData.preferredJobType && formData.jobTitle;
      case 4:
        return true; // Resume is optional
      default:
        return false;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Looking for a Job?</h2>
              <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              {[
                { step: 1, label: 'Personal Info' },
                { step: 2, label: 'Education' },
                { step: 3, label: 'Job Preferences' },
                { step: 4, label: 'Resume' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= item.step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.step}
                    </div>
                    <span className="mt-2 text-xs text-gray-600 text-center whitespace-nowrap">{item.label}</span>
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-1 mx-4 ${
                      currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Enter your contact number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select district</option>
                      {tamilNaduDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education & Skills */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education & Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification/Education Level *
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="e.g., Bachelor's in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language Proficiency
                    </label>
                    <input
                      type="text"
                      name="languageProficiency"
                      value={formData.languageProficiency}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., English, Hindi, Tamil"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills/Specialization
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows={3}
                      className="input-field"
                      placeholder="List your skills and specializations"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Job Preferences */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Job Type *
                    </label>
                    <select
                      name="preferredJobType"
                      value={formData.preferredJobType}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select job type</option>
                      <option value="Full time">Full time</option>
                      <option value="Part time">Part time</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Category
                    </label>
                    <select
                      name="preferredCategory"
                      value={(formData as any).preferredCategory || ''}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {subcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Subcategory
                      </label>
                      <select
                        name="preferredSubcategory"
                        value={(formData as any).preferredSubcategory || ''}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select subcategory</option>
                        {subcategories.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary/Range
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 3-5 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability/Joining Date
                    </label>
                    <input
                      type="date"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title You're Looking For *
                    </label>
                    {availableJobTitles.length > 0 ? (
                      <select
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select a job title</option>
                        {availableJobTitles.map((title, index) => (
                          <option key={index} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter the job title you're looking for"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Resume Upload */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Resume & Submit</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Upload (PDF/DOC) - Optional
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && (
                      <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                    )}
                    {formData.resumeUrl && (
                      <p className="text-xs text-green-600 mt-1">Resume uploaded successfully.</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> By registering, you'll be notified when new jobs matching your criteria are posted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}


            <div className="flex justify-between pt-4">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                {currentStep < 4 ? (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !isStepValid(currentStep)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register as Job Seeker'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
