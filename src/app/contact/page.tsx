"use client";

import TemplateNavbar from "@/components/TemplateNavbar";
import SiteFooter from "@/components/SiteFooter";
import PostJobModal from "@/components/PostJobModal";
import LookForJobModal from "@/components/LookForJobModal";
import { useState } from "react";

export default function ContactPage() {
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
          <h1 className="text-4xl font-extrabold text-white">Contact Us</h1>
          <nav className="mt-3 text-sm text-white/80">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white">Contact Us</span>
          </nav>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-700 mb-3">We'd Love To Hear From You</h2>
            <p className="text-gray-700 leading-7">
              Reach out for any queries, partnerships, or support. We're here to help.
            </p>
            <div className="mt-6 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
              <p className="text-gray-700 text-sm leading-6">
                No1, Selvathammal complex, First floor,<br/>
                Thandayar Nagar first Street, Tondiarpet,<br/>
                Chennai-81
              </p>
              <p className="mt-3 text-gray-700 text-sm">Cell: 8015359281</p>
            </div>
          </div>
          <div className="w-full">
            <img
              src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1600&auto=format&fit=crop"
              alt="Contact office"
              className="w-full rounded-lg shadow-lg border border-white/50"
            />
          </div>
        </section>
      </main>

      <SiteFooter />

      {showPost && <PostJobModal onClose={() => setShowPost(false)} onJobPosted={() => setShowPost(false)} />}
      {showSearch && <LookForJobModal onClose={() => setShowSearch(false)} onJobSeekerRegistered={() => setShowSearch(false)} />}
    </div>
  );
}


