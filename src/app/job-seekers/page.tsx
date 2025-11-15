"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import TemplateNavbar from "@/components/TemplateNavbar";
import SiteFooter from "@/components/SiteFooter";
import PostJobModal from "@/components/PostJobModal";
import LookForJobModal from "@/components/LookForJobModal";

interface JobSeeker {
  _id: string;
  name: string;
  jobTitle: string;
  district: string;
  preferredCategory?: string;
  preferredSubcategory?: string;
  preferredJobType?: string;
  expectedSalary?: string;
  resumeUrl?: string;
  createdAt: string;
}

function JobSeekersPageInner() {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showLookForJobModal, setShowLookForJobModal] = useState(false);

  const fetchJobSeekers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/job-seekers?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load job seekers");
      }

      const items: JobSeeker[] = Array.isArray(data) ? data : data?.items || [];
      setJobSeekers(items);
      setTotal(Array.isArray(data) ? items.length : data?.total ?? items.length);
    } catch (err) {
      console.error("Error fetching job seekers:", err);
      setError("Unable to load job seekers right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchJobSeekers();
  }, [fetchJobSeekers]);

  const handleJobPosted = () => {
    setShowPostJobModal(false);
  };

  const handleJobSeekerRegistered = () => {
    setShowLookForJobModal(false);
    fetchJobSeekers();
  };

  const totalPages = useMemo(() => {
    if (total === 0) {
      return jobSeekers.length > 0 ? page + 1 : 1;
    }
    return Math.max(1, Math.ceil(total / limit));
  }, [total, jobSeekers.length, limit, page]);

  const formatRegisteredDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TemplateNavbar
        onOpenPostJob={() => setShowPostJobModal(true)}
        onOpenSearchJob={() => setShowLookForJobModal(true)}
      />

      <main className="flex-1 sm:px-6 lg:px-8 py-8 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <header className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Job Seekers</h1>
                <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                  Browse candidates who are actively looking for opportunities. Adjust the page size below
                  and explore profiles similar to how you review job listings.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPostJobModal(true)}
                  className="px-5 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium"
                >
                  Post a Job
                </button>
                <button
                  onClick={() => setShowLookForJobModal(true)}
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  Register as Job Seeker
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing page <span className="font-semibold text-gray-900">{page + 1}</span>{" "}
              of <span className="font-semibold text-gray-900">{totalPages}</span>
              {total ? (
                <span className="block sm:inline sm:ml-2">
                  ({total} candidates total)
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <label htmlFor="limit" className="text-gray-600">
                Results per page
              </label>
              <select
                id="limit"
                className="border border-gray-300 rounded-md px-3 py-2"
                value={limit}
                onChange={(event) => {
                  setPage(0);
                  setLimit(parseInt(event.target.value, 10));
                }}
              >
                {[9, 12, 18].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 border border-red-200 bg-red-50 rounded-lg px-4 py-6 mt-8">
              {error}
            </div>
          ) : jobSeekers.length === 0 ? (
            <div className="text-center text-gray-600 py-12 mt-8">
              No job seekers found for the selected filters.
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
                {jobSeekers.map((seeker) => (
                  <article
                    key={seeker._id}
                    className="bg-white border border-gray-100 rounded-xl shadow hover:shadow-md transition p-6 flex flex-col gap-3"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{seeker.name}</h2>
                      <p className="text-sm text-blue-600 font-medium">{seeker.jobTitle}</p>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium text-gray-700">District:</span>{" "}
                        {seeker.district || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Preferred Category:</span>{" "}
                        {seeker.preferredCategory || "Any"}
                        {seeker.preferredSubcategory ? (
                          <span className="text-xs text-purple-600 ml-1">
                            ({seeker.preferredSubcategory})
                          </span>
                        ) : null}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Job Type:</span>{" "}
                        {seeker.preferredJobType || "Flexible"}
                      </p>
                      {seeker.expectedSalary ? (
                        <p>
                          <span className="font-medium text-gray-700">Expected Salary:</span>{" "}
                          {seeker.expectedSalary}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>Registered {formatRegisteredDate(seeker.createdAt)}</span>
                      {seeker.resumeUrl ? (
                        <a
                          href={seeker.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Resume
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M7 7h10v10" />
                            <path d="M7 17 17 7" />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                <div className="text-sm text-gray-600">
                  Showing {jobSeekers.length} of {total || jobSeekers.length} results
                </div>
                <div className="inline-flex items-center gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    disabled={page === 0 || loading}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page + 1 >= totalPages || loading}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />

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

export default function JobSeekersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <TemplateNavbar onOpenPostJob={() => { }} onOpenSearchJob={() => { }} />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          </main>
          <SiteFooter />
        </div>
      }
    >
      <JobSeekersPageInner />
    </Suspense>
  );
}

