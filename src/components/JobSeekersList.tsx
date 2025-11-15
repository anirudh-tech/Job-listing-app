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
  preferredCategory?: string;
  preferredSubcategory?: string;
  location: string;
  district: string;
  jobTitle: string;
  experience?: number;
  skills?: string;
  resumeUrl?: string;
  expectedSalary?: string;
  availability?: string;
  languageProficiency?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'inactive';
  createdAt: string;
}

interface JobSeekersListProps {
  admin?: any;
  onJobSeekerAction?: (jobSeekerId: string, action: 'approve' | 'reject' | 'inactive') => Promise<void>;
  showPendingOnly?: boolean;
}

export default function JobSeekersList({ admin, onJobSeekerAction, showPendingOnly = false }: JobSeekersListProps) {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<JobSeeker | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'approved' | 'inactive'>('approved');

  useEffect(() => {
    fetchJobSeekers();
  }, [page, limit, showPendingOnly, statusFilter]);

  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      let endpoint: string;
      if (showPendingOnly) {
        endpoint = '/api/job-seekers/pending';
      } else if (admin && !showPendingOnly) {
        // Admin view: show job seekers filtered by status (approved/inactive)
        endpoint = `/api/job-seekers/all?status=${statusFilter}&page=${page}&limit=${limit}`;
      } else {
        // Public view: only approved
        endpoint = `/api/job-seekers?page=${page}&limit=${limit}`;
      }
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        if (showPendingOnly || (admin && !showPendingOnly)) {
          // Pending endpoint or admin all endpoint returns array directly
          if (Array.isArray(data)) {
            setJobSeekers(data);
            setTotal(data.length);
          } else if (data && Array.isArray(data.items)) {
            setJobSeekers(data.items);
            setTotal(data.total || 0);
          } else {
            setJobSeekers([]);
            setTotal(0);
          }
        } else {
          if (data && Array.isArray(data.items)) {
            setJobSeekers(data.items);
            setTotal(data.total || 0);
          } else {
            setJobSeekers(Array.isArray(data) ? data : []);
            setTotal(Array.isArray(data) ? data.length : 0);
          }
        }
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

  const handleJobSeekerAction = async (jobSeekerId: string, action: 'approve' | 'reject' | 'inactive') => {
    if (onJobSeekerAction) {
      try {
        await onJobSeekerAction(jobSeekerId, action);
        // Remove from list if pending and approved/rejected
        if (showPendingOnly && (action === 'approve' || action === 'reject')) {
          setJobSeekers(prev => prev.filter(js => js._id !== jobSeekerId));
        } else {
          // Refresh the list to get updated status
          fetchJobSeekers();
        }
        setSelectedJobSeeker(null);
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(jobSeekerId);
          return next;
        });
      } catch (error) {
        console.error('Error handling job seeker action:', error);
        alert('Failed to update job seeker. Please try again.');
      }
    }
  };

  const markInactive = async (jobSeekerId: string) => {
    try {
      setUpdatingId(jobSeekerId);
      const res = await fetch(`/api/job-seekers/${jobSeekerId}/inactive`, { method: 'PUT' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to mark inactive');
        return;
      }
      // Remove from current list (approved) and refresh
      setJobSeekers(prev => prev.filter(js => js._id !== jobSeekerId));
      // Optionally switch to inactive filter to show the updated user
      // Or just refresh the current list
      await fetchJobSeekers();
    } catch (e) {
      alert('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  const markApproved = async (jobSeekerId: string) => {
    try {
      setUpdatingId(jobSeekerId);
      const res = await fetch(`/api/job-seekers/${jobSeekerId}/approve`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ approvedBy: admin?.username || 'admin' }) 
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to mark approved');
        return;
      }
      
      // Remove from current list (inactive) and refresh
      setJobSeekers(prev => prev.filter(js => js._id !== jobSeekerId));
      // Refresh to update the list
      await fetchJobSeekers();
    } catch (e) {
      console.error('Error marking job seeker as approved:', e);
      alert('Network error. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === jobSeekers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(jobSeekers.map(js => js._id)));
    }
  };

  const approveSelected = async () => {
    if (!onJobSeekerAction) return;
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await handleJobSeekerAction(id, 'approve');
    }
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

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {showPendingOnly ? 'Pending Job Seeker Approvals' : `Job Seekers (${statusFilter === 'approved' ? 'Approved' : 'Inactive'})`} ({jobSeekers.length})
          </h2>
          <div className="flex items-center gap-3">
            {admin && !showPendingOnly && (
              <select 
                value={statusFilter} 
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'approved' | 'inactive');
                  setPage(0);
                }} 
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="approved">Approved</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
            <div className="flex items-center gap-2 text-sm">
              <button disabled={page===0} onClick={() => setPage(p => Math.max(0, p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Page {page+1}{total>0 ? ` of ${Math.max(1, Math.ceil(total/limit))}`: ''}</span>
              <button disabled={(page+1)>=Math.max(1, Math.ceil(total/limit))} onClick={() => setPage(p => p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              {!showPendingOnly && (
                <select value={limit} onChange={(e)=>{setPage(0); setLimit(parseInt(e.target.value,10));}} className="border border-gray-300 rounded px-1 py-1">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              )}
            </div>
            <button
              onClick={fetchJobSeekers}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {jobSeekers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {showPendingOnly ? 'No pending job seekers' : 'No job seekers found'}
          </h3>
          <p className="text-gray-600">
            {showPendingOnly ? 'All job seeker registrations have been reviewed.' : 'No job seekers have registered yet.'}
          </p>
        </div>
      ) : (
        <div>
          {showPendingOnly && admin && onJobSeekerAction && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="h-4 w-4" 
                  onChange={toggleSelectAll} 
                  checked={selectedIds.size === jobSeekers.length && jobSeekers.length > 0} 
                />
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
          )}

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {showPendingOnly && admin && (
                    <th className="px-4 py-2">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4" 
                        onChange={toggleSelectAll} 
                        checked={selectedIds.size === jobSeekers.length && jobSeekers.length > 0} 
                      />
                    </th>
                  )}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  {admin && !showPendingOnly && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                  <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {jobSeekers.map((jobSeeker) => (
                  <tr key={jobSeeker._id} className="hover:bg-gray-50">
                    {showPendingOnly && admin && (
                      <td className="px-4 py-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4" 
                          checked={selectedIds.has(jobSeeker._id)} 
                          onChange={() => toggleSelect(jobSeeker._id)} 
                        />
                      </td>
                    )}
                    <td className="px-4 py-2">
                      <button 
                        className="text-blue-600 hover:underline font-medium" 
                        onClick={() => setSelectedJobSeeker(jobSeeker)}
                      >
                        {jobSeeker.name}
                      </button>
                      <div className="text-gray-500 text-xs">{calculateAge(jobSeeker.dateOfBirth)} years</div>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{jobSeeker.jobTitle}</td>
                    <td className="px-4 py-2 text-gray-700">
                      <div className="flex flex-col">
                        <span>{jobSeeker.preferredCategory || '-'}</span>
                        {jobSeeker.preferredSubcategory && (
                          <span className="text-xs text-purple-600">{jobSeeker.preferredSubcategory}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{jobSeeker.district}</td>
                    <td className="px-4 py-2 text-gray-700">{jobSeeker.qualification}</td>
                    <td className="px-4 py-2 text-gray-700">{jobSeeker.preferredJobType}</td>
                    <td className="px-4 py-2 text-gray-700">{formatDate(jobSeeker.createdAt)}</td>
                    {admin && !showPendingOnly && (
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          jobSeeker.status === 'approved' ? 'bg-green-100 text-green-700' :
                          jobSeeker.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          jobSeeker.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {jobSeeker.status || 'pending'}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2 space-x-2 text-right">
                      {showPendingOnly && admin && onJobSeekerAction ? (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-800" 
                            onClick={() => handleJobSeekerAction(jobSeeker._id, 'approve')}
                          >
                            Approve
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => handleJobSeekerAction(jobSeeker._id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          {jobSeeker.resumeUrl && (
                            <button
                              onClick={() => downloadResume(jobSeeker.resumeUrl!, jobSeeker.name)}
                              disabled={downloading}
                              className="text-xs px-3 py-1.5 rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              {downloading ? 'Downloading…' : 'Resume'}
                            </button>
                          )}
                          {admin && !showPendingOnly && (
                            <>
                              {statusFilter === 'approved' ? (
                                <button
                                  onClick={() => markInactive(jobSeeker._id)}
                                  disabled={updatingId === jobSeeker._id}
                                  className="text-xs px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  {updatingId === jobSeeker._id ? 'Marking…' : 'Mark Inactive'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => markApproved(jobSeeker._id)}
                                  disabled={updatingId === jobSeeker._id}
                                  className="text-xs px-3 py-2 rounded-md border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                >
                                  {updatingId === jobSeeker._id ? 'Updating…' : 'Mark Approved'}
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {!showPendingOnly && (
            <div className="flex items-center justify-between p-3 border-t bg-gray-50">
              <div className="text-sm text-gray-600">Total: {total}</div>
              <div className="flex items-center gap-2 text-sm">
                <button disabled={page===0} onClick={() => setPage(p => Math.max(0, p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                <span>Page {page+1}{total>0 ? ` of ${Math.max(1, Math.ceil(total/limit))}`: ''}</span>
                <button disabled={(page+1)>=Math.max(1, Math.ceil(total/limit))} onClick={() => setPage(p => p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                <select value={limit} onChange={(e)=>{setPage(0); setLimit(parseInt(e.target.value,10));}} className="border border-gray-300 rounded px-1 py-1">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

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
                      <p className="text-sm font-medium text-gray-500">Preferred Category</p>
                      <p className="text-gray-900">
                        {selectedJobSeeker.preferredCategory || '-'}
                        {selectedJobSeeker.preferredSubcategory ? (
                          <>
                            <span className="text-gray-400"> · </span>
                            <span className="text-purple-700 text-sm">{selectedJobSeeker.preferredSubcategory}</span>
                          </>
                        ) : null}
                      </p>
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
