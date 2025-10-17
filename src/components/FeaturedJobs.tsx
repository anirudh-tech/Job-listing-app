"use client";

import React, { useEffect, useState } from "react";
// We'll render a simplified featured card row similar to the template

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  category?: string;
  district?: string;
  createdAt: string;
  timeGap: number;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/jobs");
        const all = await res.json();
        setJobs(all.slice(0, 6));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <section id="featured" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <p className="text-gray-500">Here You Can See</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Featured <span style={{ color: '#0b4383' }}>Jobs</span></h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white border border-gray-100 rounded-xl shadow hover:shadow-md transition p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-blue-600">{job.company}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {job.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{job.category}</span>
                      )}
                      {job.district && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">{job.district}</span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700">Full Time</span>
                      <span className="text-gray-500">- Recently posted</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="/jobs" className="inline-block px-6 py-3 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50">Show All Jobs</a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
