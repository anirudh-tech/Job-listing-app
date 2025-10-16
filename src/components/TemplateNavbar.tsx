"use client";

import React from "react";

interface TemplateNavbarProps {
  onOpenPostJob: () => void;
  onOpenSearchJob: () => void;
}

export default function TemplateNavbar({ onOpenPostJob, onOpenSearchJob }: TemplateNavbarProps) {
  return (
    <nav className="bg-white/90 backdrop-blur sticky top-0 z-40 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a className="text-2xl font-extrabold tracking-tight flex items-center" href="/">
              <span className="text-blue-600">K</span>
              <span className="ml-1 text-gray-900">MMS</span>
            </a>
            <div className="hidden md:flex md:items-center md:space-x-6 ml-8 text-sm text-gray-600">
              <a href="/jobs" className="hover:text-gray-900">Jobs</a>
              <a href="/contact" className="hover:text-gray-900">Contact</a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={onOpenSearchJob} className="hidden sm:inline-flex px-5 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700">
              Looking for a Job?
            </button>
            <button onClick={onOpenPostJob} className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50">
              Post Your Job
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
