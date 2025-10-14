'use client';

import { useState, useEffect } from 'react';
import PendingJobCard from './PendingJobCard';
import JobDetailsModal from './JobDetailsModal';

interface PendingJob {
  _id: string;
  title: string;
  description: string;
  company: string;
  aadharNumber: string;
  aadharFileUrl: string;
  transactionId?: string;
  contactEmail?: string;
  postedBy: string;
  createdAt: string;
}

interface JobRequestsListProps {
  admin: any;
  onJobAction: (jobId: string, action: 'approve' | 'reject') => Promise<void>;
}

export default function JobRequestsList({ admin, onJobAction }: JobRequestsListProps) {
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<PendingJob | null>(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs/pending');
      const data = await response.json();
      setPendingJobs(data);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId: string, action: 'approve' | 'reject') => {
    await onJobAction(jobId, action);
    // Remove the job from pending list
    setPendingJobs(prev => prev.filter(job => job._id !== jobId));
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Job Approvals ({pendingJobs.length})
          </h2>
          <button
            onClick={fetchPendingJobs}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {pendingJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending jobs</h3>
          <p className="text-gray-600">All job postings have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingJobs.map((job) => (
            <PendingJobCard
              key={job._id}
              job={job}
              onApprove={() => handleJobAction(job._id, 'approve')}
              onReject={() => handleJobAction(job._id, 'reject')}
              onOpen={(j) => setSelectedJob(j)}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApprove={(id) => handleJobAction(id, 'approve')}
          onReject={(id) => handleJobAction(id, 'reject')}
        />
      )}
    </div>
  );
}
