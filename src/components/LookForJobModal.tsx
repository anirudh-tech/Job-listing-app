'use client';

import { useState, useEffect } from 'react';

interface LookForJobModalProps {
  onClose: () => void;
  onJobSeekerRegistered: () => void;
}

export default function LookForJobModal({ onClose, onJobSeekerRegistered }: LookForJobModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
  });
  const [availableJobTitles, setAvailableJobTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobTitles();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Looking for a Job?</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> By registering, you'll be notified when new jobs matching your criteria are posted.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register as Job Seeker'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
