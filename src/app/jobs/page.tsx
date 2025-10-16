"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateNavbar from "@/components/TemplateNavbar";
import JobCard from "@/components/JobCard";
import SiteFooter from "@/components/SiteFooter";
import PostJobModal from "@/components/PostJobModal";
import LookForJobModal from "@/components/LookForJobModal";
import { useRouter, useSearchParams } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  createdAt: string;
  timeGap: number;
}

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPost, setShowPost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const district = searchParams.get("district") || "";

  const [keywordInput, setKeywordInput] = useState(keyword);
  const [categoryInput, setCategoryInput] = useState(category);
  const [districtInput, setDistrictInput] = useState(district);
  const [categories, setCategories] = useState<string[]>([]);
  const tamilNaduDistricts = [
    'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.map((c: any) => c.name));
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);
        if (district) params.set('district', district);
        const qs = params.toString();
        const res = await fetch(`/api/jobs${qs ? `?${qs}` : ''}`);
        const data = await res.json();
        setJobs(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [keyword, category, district]);

  useEffect(() => {
    setKeywordInput(keyword);
    setCategoryInput(category);
    setDistrictInput(district);
  }, [keyword, category, district]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keywordInput.trim()) params.set('keyword', keywordInput.trim());
    if (categoryInput.trim()) params.set('category', categoryInput.trim());
    if (districtInput.trim()) params.set('district', districtInput.trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TemplateNavbar onOpenPostJob={() => setShowPost(true)} onOpenSearchJob={() => setShowSearch(true)} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Jobs</h1>
        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-3 mb-6 flex flex-col md:flex-row items-stretch gap-2">
          <input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} className="flex-1 px-4 py-3 rounded-lg outline-none border border-gray-200" placeholder="Enter Skills or job title" />
          <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} className="flex-1 px-4 py-3 rounded-lg outline-none border border-gray-200 bg-white">
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={districtInput} onChange={(e) => setDistrictInput(e.target.value)} className="flex-1 px-4 py-3 rounded-lg outline-none border border-gray-200 bg-white">
            <option value="">Select District</option>
            {tamilNaduDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button type="submit" className="px-6 py-3 rounded-lg text-white bg-green-500 hover:bg-green-600">Search Job</button>
        </form>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No jobs found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />

      {showPost && <PostJobModal onClose={() => setShowPost(false)} onJobPosted={() => setShowPost(false)} />}
      {showSearch && <LookForJobModal onClose={() => setShowSearch(false)} onJobSeekerRegistered={() => setShowSearch(false)} />}
    </div>
  );
}
