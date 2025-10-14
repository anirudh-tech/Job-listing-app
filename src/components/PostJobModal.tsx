'use client';

import { useState } from 'react';

interface PostJobModalProps {
  onClose: () => void;
  onJobPosted: () => void;
}

export default function PostJobModal({ onClose, onJobPosted }: PostJobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    aadharNumber: '',
    aadharFileUrl: '',
    transactionId: '',
    contactEmail: '',
    postedBy: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aadhaarExists, setAadhaarExists] = useState(false);
  const [checkingAadhaar, setCheckingAadhaar] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAadhaarBlur = async () => {
    const number = formData.aadharNumber.trim();
    if (number.length < 12) return;
    try {
      setCheckingAadhaar(true);
      const res = await fetch(`/api/aadhaar/check?number=${encodeURIComponent(number)}`);
      const data = await res.json();
      setAadhaarExists(Boolean(data.exists));
    } catch (e) {
      // ignore check error; treat as not existing
      setAadhaarExists(false);
    } finally {
      setCheckingAadhaar(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/aadhaar', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, aadharFileUrl: data.url }));
      } else {
        setError(data.error || 'Failed to upload Aadhaar file');
      }
    } catch (err) {
      setError('Failed to upload Aadhaar file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onJobPosted();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to post job');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
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
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Software Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Tech Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
                placeholder="Describe the job requirements, responsibilities, and benefits..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="postedBy"
                value={formData.postedBy}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number *
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                onBlur={handleAadhaarBlur}
                required
                className="input-field"
                placeholder="12-digit Aadhaar number"
                maxLength={12}
              />
              {checkingAadhaar && (
                <p className="text-xs text-gray-500 mt-1">Checking Aadhaar...</p>
              )}
              {aadhaarExists && (
                <p className="text-xs text-amber-600 mt-1">This Aadhaar was used before. Complete payment details below.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Aadhaar (image/PDF) *
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}
              {formData.aadharFileUrl && (
                <p className="text-xs text-green-600 mt-1">File uploaded.</p>
              )}
            </div>

            {aadhaarExists && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded">
                    <span className="text-xs text-gray-500">GPay QR</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Please scan and pay using GPay. Then enter the Transaction ID and your Email. You will receive an email if the admin approves.
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID *</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    required={aadhaarExists}
                    className="input-field"
                    placeholder="Enter payment transaction ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required={aadhaarExists}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}


            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

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
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
