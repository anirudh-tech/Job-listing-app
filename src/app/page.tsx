'use client';

import { useState, useEffect } from 'react';
import PostJobModal from '@/components/PostJobModal';
import LookForJobModal from '@/components/LookForJobModal';
import JobCard from '@/components/JobCard';
import TemplateNavbar from '@/components/TemplateNavbar';
import HomeSearchBar from '@/components/HomeSearchBar';
import FeaturedJobs from '@/components/FeaturedJobs';
import SiteFooter from '@/components/SiteFooter';

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
      <TemplateNavbar 
        onOpenPostJob={() => setShowPostJobModal(true)} 
        onOpenSearchJob={() => setShowLookForJobModal(true)} 
      />
      <HomeSearchBar 
        onOpenPostJob={() => setShowPostJobModal(true)}
        onOpenSearchJob={() => setShowLookForJobModal(true)}
      />

      {/* Main Content */}
      {/* Removed legacy jobs list from homepage as requested */}

      <FeaturedJobs />
      <SiteFooter />

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
