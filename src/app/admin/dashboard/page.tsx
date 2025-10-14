'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PendingJobCard from '@/components/PendingJobCard';
import JobDetailsModal from '@/components/JobDetailsModal';

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

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<PendingJob | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }
    
    setAdmin(JSON.parse(adminData));
    fetchPendingJobs();
  }, [router]);

  const fetchPendingJobs = async () => {
    try {
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
    try {
      const response = await fetch(`/api/jobs/${jobId}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [action === 'approve' ? 'approvedBy' : 'rejectedBy']: admin.username,
        }),
      });

      if (response.ok) {
        // Remove the job from pending list
        setPendingJobs(prev => prev.filter(job => job._id !== jobId));
        setSelectedJob(null);
      } else {
        alert('Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage job postings and approvals</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {admin?.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pending Job Approvals ({pendingJobs.length})
          </h2>
          
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
        </div>
      </main>

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
