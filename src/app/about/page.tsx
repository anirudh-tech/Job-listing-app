"use client";

import TemplateNavbar from "@/components/TemplateNavbar";
import SiteFooter from "@/components/SiteFooter";
import PostJobModal from "@/components/PostJobModal";
import LookForJobModal from "@/components/LookForJobModal";
import { useState } from "react";

export default function AboutPage() {
  const [showPost, setShowPost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateNavbar onOpenPostJob={() => setShowPost(true)} onOpenSearchJob={() => setShowSearch(true)} />

      {/* Hero header */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop)",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-extrabold text-white">About Us</h1>
          <nav className="mt-3 text-sm text-white/80">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white">About Us</span>
          </nav>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro section with image */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-700 mb-4">Our Perfect Platform</h2>
            <p className="text-gray-700 leading-7">
              Kamarajar Makkal Munnetra Sangam (KMMS) is a charitable trust dedicated to holistic community
              development. We focus on social security, economic empowerment, education, and environmental
              stewardship to build a strong, ethical, and sustainable society.
            </p>
          </div>
          <div className="w-full">
            <img
              src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1600&auto=format&fit=crop"
              alt="Team discussion"
              className="w-full rounded-lg shadow-lg border border-white/50"
            />
          </div>
        </section>

        {/* KMMS pillars as animated cards */}
        <section>
          <div className="mb-8">
            <p className="text-gray-700 leading-7">
              The Kamarajar Makkal Munnetra Sangam is dedicated to holistic community development through
              social security, economic empowerment, education, and environmental stewardship. Our vision rests on five
              core pillars to build a strong, ethical, and sustainable society.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 1. Women Safety */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900">Women Safety: Ensuring a Secure Environment</h3>
                <p className="mt-2 text-gray-600 text-sm">Creating an environment of security and empowerment.</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li><span className="font-medium">Awareness & Advocacy:</span> Workshops and campaigns on rights, remedies, and self‑defense.</li>
                  <li><span className="font-medium">Support Systems:</span> Helplines, safe houses, legal aid, and counseling.</li>
                </ul>
              </div>
            </div>

            {/* 2. Job Opportunities */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900">Job Opportunities for the Youngsters</h3>
                <p className="mt-2 text-gray-600 text-sm">Transforming qualifications into tangible opportunities.</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li><span className="font-medium">Skill Development:</span> Vocational and soft‑skills training aligned to market demand.</li>
                  <li><span className="font-medium">Guidance & Placement:</span> Job fairs, counseling, mock interviews, and industry tie‑ups.</li>
                  <li><span className="font-medium">Entrepreneurship:</span> Mentorship, seed support, and resource linkage.</li>
                </ul>
              </div>
            </div>

            {/* 3. Morality Teaching */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900">Morality Teaching to Students</h3>
                <p className="mt-2 text-gray-600 text-sm">Instilling values and social responsibility.</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li><span className="font-medium">Value‑Based Curriculum:</span> Honesty, integrity, empathy, and respect.</li>
                  <li><span className="font-medium">Role Models:</span> Talks from achievers emphasizing ethics in success.</li>
                  <li><span className="font-medium">Civic Responsibility:</span> Community service and civic engagement.</li>
                </ul>
              </div>
            </div>

            {/* 4. Education Upliftment */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 xl:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900">Education Upliftment</h3>
                <p className="mt-2 text-gray-600 text-sm">Expanding access and improving quality.</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li><span className="font-medium">Infrastructure:</span> Smart classrooms, clean water, and sanitation.</li>
                  <li><span className="font-medium">Scholarships & Aid:</span> Merit‑cum‑need support and supplies.</li>
                  <li><span className="font-medium">Teacher Empowerment:</span> Modern pedagogy and subject training.</li>
                </ul>
              </div>
            </div>

            {/* 5. Save Nature */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 xl:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900">Save Nature: Environmental Stewardship</h3>
                <p className="mt-2 text-gray-600 text-sm">Protecting the environment for future generations.</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
                  <li><span className="font-medium">Green Initiatives:</span> Afforestation, urban gardening, rainwater harvesting.</li>
                  <li><span className="font-medium">Waste Awareness:</span> Segregation, reduction, reuse, and recycling.</li>
                  <li><span className="font-medium">Water Conservation:</span> Simple, scalable methods in schools and public areas.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Closing split section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-14">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop"
              alt="Community work"
              className="w-full rounded-lg shadow-lg border border-white/50"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-extrabold text-blue-700 mb-3">Building A Better Tomorrow</h3>
            <p className="text-gray-700 leading-7 mb-4">
              KMMS brings people together to create safer neighborhoods, stronger families, and greener cities
              through actionable programs and partnerships.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 rounded-full bg-blue-600"></span> Inclusive programs for women, youth, and students</li>
              <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 rounded-full bg-blue-600"></span> Practical training and placement assistance</li>
              <li className="flex items-start"><span className="mt-1 mr-2 h-2 w-2 rounded-full bg-blue-600"></span> Scalable environmental initiatives and awareness</li>
            </ul>
          </div>
        </section>

        {/* CTA band */}
        <section className="mt-14 bg-blue-600 rounded-xl text-white p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="text-xl font-semibold">Join hands with KMMS</h4>
            <p className="text-blue-100">Partner, volunteer, or support our initiatives to impact lives today.</p>
          </div>
          <div className="space-x-3">
            <a href="/jobs" className="inline-block px-5 py-3 rounded-md bg-white text-blue-700 font-medium hover:bg-blue-50">Explore Jobs</a>
            <a href="/contact" className="inline-block px-5 py-3 rounded-md border border-white/70 hover:bg-white/10">Contact Us</a>
          </div>
        </section>
      </main>

      <SiteFooter />

      {showPost && <PostJobModal onClose={() => setShowPost(false)} onJobPosted={() => setShowPost(false)} />}
      {showSearch && <LookForJobModal onClose={() => setShowSearch(false)} onJobSeekerRegistered={() => setShowSearch(false)} />}
    </div>
  );
}
