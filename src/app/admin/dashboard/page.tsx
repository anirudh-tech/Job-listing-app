'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import JobRequestsList from '@/components/JobRequestsList';
import AllJobsList from '@/components/AllJobsList';
import JobSeekersList from '@/components/JobSeekersList';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'jobs' | 'job-requests' | 'job-seekers'>('job-requests');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }
    
    setAdmin(JSON.parse(adminData));
    setLoading(false);
  }, [router]);

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

      if (!response.ok) {
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

  const handleViewChange = (view: 'jobs' | 'job-requests' | 'job-seekers') => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout
      currentView={currentView}
      onViewChange={handleViewChange}
      admin={admin}
      onLogout={handleLogout}
    >
      {currentView === 'job-requests' ? (
        <JobRequestsList 
          admin={admin} 
          onJobAction={handleJobAction} 
        />
      ) : currentView === 'jobs' ? (
        <AllJobsList />
      ) : (
        <JobSeekersList />
      )}
    </AdminLayout>
  );
}
