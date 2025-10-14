'use client';

import { useState, useEffect } from 'react';
import JobCard from './JobCard';

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  aadharNumber: string;
  aadharFileUrl: string;
  transactionId?: string;
  contactEmail?: string;
  postedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllJobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data);
      } else {
        setError(data.error || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading jobs</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAllJobs}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">There are no approved job postings yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            All Approved Jobs ({jobs.length})
          </h2>
          <button
            onClick={fetchAllJobs}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={{
              _id: job._id,
              title: job.title,
              description: job.description,
              company: job.company,
              createdAt: job.createdAt,
              timeGap: 30, // Default time gap for approved jobs
            }}
          />
        ))}
      </div>
    </div>
  );
}
