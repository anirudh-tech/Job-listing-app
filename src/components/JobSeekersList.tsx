'use client';

import { useState, useEffect } from 'react';

interface JobSeeker {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  qualification: string;
  preferredJobType: string;
  location: string;
  district: string;
  jobTitle: string;
  experience?: number;
  skills?: string;
  resumeUrl?: string;
  expectedSalary?: string;
  availability?: string;
  languageProficiency?: string;
  createdAt: string;
}

export default function JobSeekersList() {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<JobSeeker | null>(null);
  const [downloading, setDownloading] = useState(false);


  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/job-seekers');
      const data = await response.json();
      
      if (response.ok) {
        setJobSeekers(data);
      } else {
        setError(data.error || 'Failed to fetch job seekers');
      }
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const downloadResume = async (url: string, candidateName: string) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      
      const blob = await response.blob();
      
      // Create filename from candidate name
      const filename = `${candidateName.replace(/\s+/g, '_')}_resume.pdf`;
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download resume. Please try again.');
    } finally {
      setDownloading(false);
    }
  };
  
  
  

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading job seekers</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchJobSeekers}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (jobSeekers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No job seekers found</h3>
        <p className="text-gray-600">No one has registered for job opportunities yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Job Seekers ({jobSeekers.length})
          </h2>
          <button
            onClick={fetchJobSeekers}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobSeekers.map((jobSeeker) => (
          <div
            key={jobSeeker._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer"
            onClick={() => setSelectedJobSeeker(jobSeeker)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{jobSeeker.name}</h3>
              <span className="text-sm text-gray-500">{calculateAge(jobSeeker.dateOfBirth)} years</span>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-medium">Job Title:</span> {jobSeeker.jobTitle}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-medium">Location:</span> {jobSeeker.location}, {jobSeeker.district}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-medium">Qualification:</span> {jobSeeker.qualification}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Job Type:</span> {jobSeeker.preferredJobType}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Registered {formatDate(jobSeeker.createdAt)}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {jobSeeker.gender}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Job Seeker Details Modal */}
      {selectedJobSeeker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Job Seeker Details</h2>
                <div className="flex items-center space-x-3">
                {selectedJobSeeker?.resumeUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadResume(selectedJobSeeker.resumeUrl!, selectedJobSeeker.name);
                      }}
                      disabled={downloading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {downloading ? 'Downloading...' : 'Download Resume'}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedJobSeeker(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{selectedJobSeeker.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="text-gray-900">{calculateAge(selectedJobSeeker.dateOfBirth)} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="text-gray-900">{selectedJobSeeker.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Number</p>
                      <p className="text-gray-900">{selectedJobSeeker.contactNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedJobSeeker.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">{selectedJobSeeker.location}, {selectedJobSeeker.district}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Title</p>
                      <p className="text-gray-900">{selectedJobSeeker.jobTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Type</p>
                      <p className="text-gray-900">{selectedJobSeeker.preferredJobType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Qualification</p>
                      <p className="text-gray-900">{selectedJobSeeker.qualification}</p>
                    </div>
                    {selectedJobSeeker.experience && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Experience</p>
                        <p className="text-gray-900">{selectedJobSeeker.experience} years</p>
                      </div>
                    )}
                    {selectedJobSeeker.expectedSalary && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expected Salary</p>
                        <p className="text-gray-900">{selectedJobSeeker.expectedSalary}</p>
                      </div>
                    )}
                    {selectedJobSeeker.availability && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Availability</p>
                        <p className="text-gray-900">{formatDate(selectedJobSeeker.availability)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedJobSeeker.skills || selectedJobSeeker.languageProficiency) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                    <div className="space-y-4">
                      {selectedJobSeeker.skills && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Skills</p>
                          <p className="text-gray-900">{selectedJobSeeker.skills}</p>
                        </div>
                      )}
                      {selectedJobSeeker.languageProficiency && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Language Proficiency</p>
                          <p className="text-gray-900">{selectedJobSeeker.languageProficiency}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resume */}
                {selectedJobSeeker.resumeUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                    <button
                      onClick={() => downloadResume(selectedJobSeeker.resumeUrl!, selectedJobSeeker.name)}
                      disabled={downloading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {downloading ? 'Downloading...' : 'Download Resume'}
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Registered on {formatDate(selectedJobSeeker.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
