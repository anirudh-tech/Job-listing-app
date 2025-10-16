"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface HomeSearchBarProps {
  onOpenPostJob: () => void;
  onOpenSearchJob?: () => void;
}

export default function HomeSearchBar({ onOpenPostJob, onOpenSearchJob }: HomeSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  
  const tamilNaduDistricts = [
    'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'
  ];

  // Load categories
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

  // Initialize form values from URL params
  useEffect(() => {
    const keywordParam = searchParams.get("keyword");
    const categoryParam = searchParams.get("category");
    const districtParam = searchParams.get("district");
    
    if (keywordParam) setKeyword(keywordParam);
    if (categoryParam) setCategory(categoryParam);
    if (districtParam) setDistrict(districtParam);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (category.trim()) params.set("category", category.trim());
    if (district.trim()) params.set("district", district.trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  };

  return (
    <section className="relative bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2060&auto=format&fit=crop)' }}>
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">One million success stories. <span className="text-green-400">Start yours today.</span></h1>
        <p className="text-white/80 mb-8">Find 40,000+ Jobs, Employment & Career Opportunities</p>

        <div className="bg-white rounded-full shadow-xl p-2 flex flex-col md:flex-row items-stretch gap-2">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-1 px-5 py-4 rounded-full outline-none text-gray-700" placeholder="Enter Skills or job title" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 px-5 py-4 rounded-full outline-none text-gray-700 bg-gray-50">
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="flex-1 px-5 py-4 rounded-full outline-none text-gray-700 bg-gray-50">
            <option value="">Select District</option>
            {tamilNaduDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button onClick={handleSearch} className="px-8 py-4 rounded-full text-white bg-green-500 hover:bg-green-600">Search Job</button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={onOpenPostJob} className="px-6 py-3 rounded-lg border border-blue-600 text-white bg-transparent hover:bg-white/10">Post Your Job</button>
          <button onClick={onOpenSearchJob} className="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Looking for a Job?</button>
        </div>
      </div>
    </section>
  );
}