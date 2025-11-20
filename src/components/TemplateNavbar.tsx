"use client";

import Image from "next/image";
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
          <a className="flex items-center" href="/">
              <Image 
                src="https://res.cloudinary.com/daob5eure/image/upload/v1761033298/Kamarajar_Makkal_Munnetra_Sangam-Logo_kcdjwf.png"
                alt="KMMS Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </a>
            <div className="hidden md:flex md:items-center md:space-x-6 ml-8 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900">Home</a>
              <a href="/jobs" className="hover:text-gray-900">Find Jobs</a>
              <a href="/job-seekers" className="hover:text-gray-900">Registered Candidates</a>
              <a href="/#about" className="hover:text-gray-900">About Us</a>
              <a href="/#featured" className="hover:text-gray-900">Featured Jobs</a>
              <a href="/#contact" className="hover:text-gray-900">Contact</a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={onOpenSearchJob} className="hidden sm:inline-flex px-5 py-2 rounded-full text-white btn-primary">
              Register as a Job Seeker?
            </button>
            <button onClick={onOpenPostJob} className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50">
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
