'use client';

import { useState, useEffect } from 'react';
import JobCard from './JobCard';

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  category?: string;
  district?: string;
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'approved' | 'inactive'>('approved');

  useEffect(() => {
    fetchAllJobs();
  }, [statusFilter]);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs?status=${statusFilter}`);
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

  const markInactive = async (jobId: string) => {
    try {
      setUpdatingId(jobId);
      const res = await fetch(`/api/jobs/${jobId}/inactive`, { method: 'PUT' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to mark inactive');
      }
      await fetchAllJobs();
    } catch (e) {
      alert('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  const markApproved = async (jobId: string) => {
    try {
      setUpdatingId(jobId);
      const res = await fetch(`/api/jobs/${jobId}/approve`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approvedBy: 'admin' }) });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to mark approved');
      }
      await fetchAllJobs();
    } catch (e) {
      alert('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Jobs ({statusFilter === 'approved' ? 'Approved' : 'Inactive'}) ({jobs.length})
          </h2>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
              <option value="approved">Approved</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={fetchAllJobs}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>

      {jobs.length === 0 ? (
        <div className="text-gray-600 px-1 py-6">No jobs found.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Title</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Company</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Category</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">District</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Created</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 truncate max-w-[260px]">{job.title}</div>
                    <div className="text-gray-500 line-clamp-1 max-w-[360px] text-xs">{job.description}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{job.company}</td>
                  <td className="px-4 py-3 text-gray-700">{job.category || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{job.district || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {statusFilter === 'approved' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">Approved</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {statusFilter === 'approved' ? (
                        <button
                          onClick={() => markInactive(job._id)}
                          disabled={updatingId === job._id}
                          className="text-xs px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          {updatingId === job._id ? 'Marking…' : 'Mark Inactive'}
                        </button>
                      ) : (
                        <button
                          onClick={() => markApproved(job._id)}
                          disabled={updatingId === job._id}
                          className="text-xs px-3 py-2 rounded-md border border-green-300 text-green-700 hover:bg-green-50"
                        >
                          {updatingId === job._id ? 'Updating…' : 'Mark Approved'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}
    </div>
  );
}
