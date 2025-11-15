'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import JobRequestsList from '@/components/JobRequestsList';
import AllJobsList from '@/components/AllJobsList';
import JobSeekersList from '@/components/JobSeekersList';
import CategoriesAdmin from '@/components/CategoriesAdmin';
import ContactsAdmin from '@/components/ContactsAdmin';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'jobs' | 'job-requests' | 'job-seekers' | 'job-seeker-requests' | 'categories' | 'contacts'>('job-requests');
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

  const handleViewChange = (view: 'jobs' | 'job-requests' | 'job-seekers' | 'job-seeker-requests' | 'categories' | 'contacts') => {
    setCurrentView(view);
  };

  const handleJobSeekerAction = async (jobSeekerId: string, action: 'approve' | 'reject' | 'inactive') => {
    try {
      let endpoint: string;
      let body: any = {};
      
      if (action === 'inactive') {
        endpoint = `/api/job-seekers/${jobSeekerId}/inactive`;
      } else {
        endpoint = `/api/job-seekers/${jobSeekerId}/${action}`;
        body = {
          [action === 'approve' ? 'approvedBy' : 'rejectedBy']: admin?.username || 'admin',
        };
      }
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update job seeker:', errorData);
        alert(errorData.error || 'Failed to update job seeker status');
        throw new Error(errorData.error || 'Failed to update job seeker status');
      }
      
      const result = await response.json();
      console.log('Job seeker updated successfully:', result);
    } catch (error) {
      console.error('Error updating job seeker:', error);
      alert('Network error. Please try again.');
      throw error; // Re-throw so the component can handle it
    }
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
      ) : currentView === 'categories' ? (
        // @ts-ignore - imported dynamically below
        <CategoriesAdmin />
      ) : currentView === 'contacts' ? (
        <ContactsAdmin />
      ) : currentView === 'job-seeker-requests' ? (
        <JobSeekersList 
          admin={admin}
          onJobSeekerAction={handleJobSeekerAction}
          showPendingOnly={true}
        />
      ) : (
        <JobSeekersList 
          admin={admin}
          onJobSeekerAction={handleJobSeekerAction}
        />
      )}
    </AdminLayout>
  );
}
