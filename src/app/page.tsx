'use client';

import { useState, useEffect } from 'react';
import PostJobModal from '@/components/PostJobModal';
import LookForJobModal from '@/components/LookForJobModal';
import JobCard from '@/components/JobCard';
import Navigation from '@/components/Navigation';

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  createdAt: string;
  timeGap: number;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showLookForJobModal, setShowLookForJobModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobPosted = () => {
    setShowPostJobModal(false);
    fetchJobs(); // Refresh the job list
  };

  const handleJobSeekerRegistered = () => {
    setShowLookForJobModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
              <p className="text-gray-600">Find your next opportunity or post a job</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLookForJobModal(true)}
                className="btn-primary"
              >
                Looking for Job?
              </button>
              <button
                onClick={() => setShowPostJobModal(true)}
                className="btn-secondary"
              >
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-600">Be the first to post a job opportunity!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showPostJobModal && (
        <PostJobModal
          onClose={() => setShowPostJobModal(false)}
          onJobPosted={handleJobPosted}
        />
      )}

      {showLookForJobModal && (
        <LookForJobModal
          onClose={() => setShowLookForJobModal(false)}
          onJobSeekerRegistered={handleJobSeekerRegistered}
        />
      )}
    </div>
  );
}
