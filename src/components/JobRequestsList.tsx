'use client';

import { useState, useEffect } from 'react';
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(jobId);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pendingJobs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingJobs.map(j => j._id)));
    }
  };

  const approveSelected = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await handleJobAction(id, 'approve');
    }
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
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="h-4 w-4" onChange={toggleSelectAll} checked={selectedIds.size === pendingJobs.length && pendingJobs.length > 0} />
              <span className="text-sm text-gray-600">Select all</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={approveSelected}
                disabled={selectedIds.size === 0}
                className={`btn-primary ${selectedIds.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Approve Selected ({selectedIds.size})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">
                    <input type="checkbox" className="h-4 w-4" onChange={toggleSelectAll} checked={selectedIds.size === pendingJobs.length && pendingJobs.length > 0} />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted By</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input type="checkbox" className="h-4 w-4" checked={selectedIds.has(job._id)} onChange={() => toggleSelect(job._id)} />
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline" onClick={() => setSelectedJob(job)}>{job.title}</button>
                    </td>
                    <td className="px-4 py-2">{job.company}</td>
                    <td className="px-4 py-2">{job.postedBy}</td>
                    <td className="px-4 py-2">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 space-x-2 text-right">
                      <button className="text-green-600 hover:text-green-800" onClick={() => handleJobAction(job._id, 'approve')}>Approve</button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => handleJobAction(job._id, 'reject')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
