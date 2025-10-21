'use client';

import { useState, useEffect, Suspense } from 'react';
import PostJobModal from '@/components/PostJobModal';
import LookForJobModal from '@/components/LookForJobModal';
import JobCard from '@/components/JobCard';
import TemplateNavbar from '@/components/TemplateNavbar';
import HomeSearchBar from '@/components/HomeSearchBar';
import FeaturedJobs from '@/components/FeaturedJobs';
import SiteFooter from '@/components/SiteFooter';
import BannerSlider from '@/components/BannerSlider';
import Reveal from '@/components/Reveal';

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  createdAt: string;
  timeGap: number;
}

function Home() {
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
      {/* <HomeSearchBar 
        onOpenPostJob={() => setShowPostJobModal(true)}
        onOpenSearchJob={() => setShowLookForJobModal(true)}
      /> */}

      <BannerSlider
        onOpenPostJob={() => setShowPostJobModal(true)}
        onOpenSearchJob={() => setShowLookForJobModal(true)}
      />

      {/* Main Content */}

      {/* About content moved from About page */}
      <main id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro section styled like the provided reference */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-12">
          {/* Left: image and mission card */}
          <Reveal variant="left">
            <img
              src="https://res.cloudinary.com/daob5eure/image/upload/v1761034272/kmmsAboutimage_ntdmrn.jpg"
              alt="Team discussion"
              className="w-full rounded-lg shadow-lg border border-white/50"
            />
            {/* Mission statement card */}
            <div className="mt-6 rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: '#0b4383' }}>
              <div className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M12 2a7 7 0 00-4.95 11.95c.24.24.41.54.49.87l.28 1.12a2 2 0 001.94 1.52h4.48a2 2 0 001.94-1.52l.28-1.12c.08-.33.25-.63.49-.87A7 7 0 0012 2zm-1 18a1 1 0 102 0h-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold tracking-wider text-white/80">MISSION STATEMENT</div>
                    <p className="mt-2 text-white text-base leading-7">
                      Our mission is to empower individuals and businesses by delivering secure, efficient,
                      and user‑friendly services for a better future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: badge, headline, copy, key values */}
          <Reveal variant="right">
            <span className="inline-block text-xs font-semibold tracking-wider rounded-full px-3 py-1 mb-4" style={{ backgroundColor: 'rgba(11,67,131,0.08)', color: '#0b4383' }}>ABOUT US</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Kamarajar Makkal Munnetra Sangam
            </h2>
            <p className="mt-5 text-gray-700 leading-7">
              Founded with the vision of uplifting communities, KMMS focuses on social security, economic empowerment,
              education, and environmental stewardship to build a strong, ethical, and sustainable society.
            </p>
            <p className="mt-4 text-gray-700 leading-7">
              Our initiatives are safe, streamlined, and easy to access, empowering you to take control of your journey
              with confidence and convenience.
            </p>

            {/* Key values */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                'Innovation',
                'Security',
                'User‑Centric Design',
                'Transparency',
                'Empowerment',
              ].map((label) => (
                <div key={label} className="flex items-center gap-2 text-gray-800">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(11,67,131,0.1)', color: '#0b4383' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M10.28 15.53a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 111.06-1.06l1.72 1.72 5.22-5.22a.75.75 0 111.06 1.06l-6.75 6.75z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Vision section - 5 rows with image + content card using #0b4383 */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-wider rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(11,67,131,0.08)', color: '#0b4383' }}>VISION</span>
            <h3 className="mt-3 text-3xl font-extrabold text-gray-900">Our Key Pillars</h3>
            <p className="mt-2 text-gray-600">Five focus areas that drive our impact.</p>
          </div>

          {/* Row 1 - Women Safety */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
            <Reveal variant="left">
              <div className="w-full rounded-xl overflow-hidden border border-gray-100 bg-white">
                <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop" alt="Women safety" className="w-full h-64 object-cover" />
              </div>
            </Reveal>
            <Reveal variant="right">
              <div className="rounded-2xl text-white p-6 sm:p-8" style={{ backgroundColor: '#0b4383' }}>
                <h4 className="text-xl font-semibold">Women Safety: Ensuring a Secure Environment</h4>
                <p className="mt-2 text-white/90 text-sm">Creating an environment of security and empowerment.</p>
                <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
                  <li>Awareness & Advocacy: Workshops and campaigns on rights, remedies, and self‑defense.</li>
                  <li>Support Systems: Helplines, safe houses, legal aid, and counseling.</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Row 2 - Job Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
            <Reveal variant="left">
              <div className="order-2 lg:order-1 rounded-2xl text-white p-6 sm:p-8" style={{ backgroundColor: '#0b4383' }}>
                <h4 className="text-xl font-semibold">Job Opportunities for the Youngsters</h4>
                <p className="mt-2 text-white/90 text-sm">Transforming qualifications into tangible opportunities.</p>
                <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
                  <li>Skill Development: Vocational and soft‑skills training aligned to market demand.</li>
                  <li>Guidance & Placement: Job fairs, counseling, mock interviews, and industry tie‑ups.</li>
                  <li>Entrepreneurship: Mentorship, seed support, and resource linkage.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal variant="right">
              <div className="order-1 lg:order-2 w-full rounded-xl overflow-hidden border border-gray-100 bg-white">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop" alt="Job opportunities" className="w-full h-64 object-cover" />
              </div>
            </Reveal>
          </div>

          {/* Row 3 - Morality Teaching */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
            <Reveal variant="left">
              <div className="w-full rounded-xl overflow-hidden border border-gray-100 bg-white">
                <img src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1600&auto=format&fit=crop" alt="Morality teaching" className="w-full h-64 object-cover" />
              </div>
            </Reveal>
            <Reveal variant="right">
              <div className="rounded-2xl text-white p-6 sm:p-8" style={{ backgroundColor: '#0b4383' }}>
                <h4 className="text-xl font-semibold">Morality Teaching to Students</h4>
                <p className="mt-2 text-white/90 text-sm">Instilling values and social responsibility.</p>
                <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
                  <li>Value‑Based Curriculum: Honesty, integrity, empathy, and respect.</li>
                  <li>Role Models: Talks from achievers emphasizing ethics in success.</li>
                  <li>Civic Responsibility: Community service and civic engagement.</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Row 4 - Education Upliftment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
            <Reveal variant="left">
              <div className="order-2 lg:order-1 rounded-2xl text-white p-6 sm:p-8" style={{ backgroundColor: '#0b4383' }}>
                <h4 className="text-xl font-semibold">Education Upliftment</h4>
                <p className="mt-2 text-white/90 text-sm">Expanding access and improving quality.</p>
                <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
                  <li>Infrastructure: Smart classrooms, clean water, and sanitation.</li>
                  <li>Scholarships & Aid: Merit‑cum‑need support and supplies.</li>
                  <li>Teacher Empowerment: Modern pedagogy and subject training.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal variant="right">
              <div className="order-1 lg:order-2 w-full rounded-xl overflow-hidden border border-gray-100 bg-white">
                <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop" alt="Education upliftment" className="w-full h-64 object-cover" />
              </div>
            </Reveal>
          </div>

          {/* Row 5 - Save Nature */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <Reveal variant="left">
              <div className="w-full rounded-xl overflow-hidden border border-gray-100 bg-white">
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop" alt="Save nature" className="w-full h-64 object-cover" />
              </div>
            </Reveal>
            <Reveal variant="right">
              <div className="rounded-2xl text-white p-6 sm:p-8" style={{ backgroundColor: '#0b4383' }}>
                <h4 className="text-xl font-semibold">Save Nature: Environmental Stewardship</h4>
                <p className="mt-2 text-white/90 text-sm">Protecting the environment for future generations.</p>
                <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
                  <li>Green Initiatives: Afforestation, urban gardening, rainwater harvesting.</li>
                  <li>Waste Awareness: Segregation, reduction, reuse, and recycling.</li>
                  <li>Water Conservation: Simple, scalable methods in schools and public areas.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Closing split section */}
        {/* <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-14">
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
        </section> */}

        <section id="featured">
          <FeaturedJobs />
        </section>
        {/* CTA band */}
        <section style={{ backgroundColor: '#0b4383' }} className="mt-14  rounded-xl text-white p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="text-xl font-semibold">Join hands with KMMS</h4>
            <p className="text-blue-100">Partner, volunteer, or support our initiatives to impact lives today.</p>
          </div>
          <div className="space-x-3">
            <a href="/jobs" className="inline-block px-5 py-3 rounded-md bg-white text-blue-700 font-medium hover:bg-blue-50">Explore Jobs</a>
            {/* <a href="/contact" className="inline-block px-5 py-3 rounded-md border border-white/70 hover:bg-white/10">Contact Us</a> */}
          </div>
        </section>
      </main>

      {/* Contact section on home */}
      <section id="contact" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-wider rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(11,67,131,0.08)', color: '#0b4383' }}>CONTACT</span>
            <h3 className="mt-3 text-3xl font-extrabold text-gray-900">Contact Us</h3>
            <p className="mt-2 text-gray-600">Reach out to us and we’ll get back to you shortly.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(11,67,131,0.08)', color: '#0b4383' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M2 5.5C2 4.12 3.12 3 4.5 3h.56c.5 0 .97.24 1.27.64l2 2.62c.39.51.36 1.22-.06 1.69l-1.2 1.34a.75.75 0 00-.08.94 12.03 12.03 0 004.64 4.64.75.75 0 00.94-.08l1.34-1.2c.47-.42 1.18-.45 1.69-.06l2.62 2c.4.3.64.77.64 1.27v.56A2.5 2.5 0 0118.5 21c-8.56 0-15.5-6.94-15.5-15.5z" /></svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900">8015359281</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(11,67,131,0.08)', color: '#0b4383' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M1.5 6.75A2.25 2.25 0 013.75 4.5h16.5A2.25 2.25 0 0122.5 6.75v10.5A2.25 2.25 0 0120.25 19.5H3.75A2.25 2.25 0 011.5 17.25V6.75zm2.477-.53a.75.75 0 00-.954 1.16l7.5 6.165a.75.75 0 00.954 0l7.5-6.165a.75.75 0 00-.954-1.16L12 12.21 3.977 6.22z" /></svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">info@example.com</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(11,67,131,0.08)', color: '#0b4383' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M11.47 3.84a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 5.56 5.03 12.4a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" /><path d="M12 7.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5z" /></svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium text-gray-900">No1, Selvathammal complex, First floor, Thandayar Nagar first Street, Tondiarpet, Chennai-81</div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <form id="contact-form" className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
              } as any;
              try {
                const res = await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (res.ok) {
                  alert('Message sent successfully');
                  form.reset();
                } else {
                  const data = await res.json();
                  alert(data.error || 'Failed to send');
                }
              } catch {
                alert('Network error');
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" required className="w-full border rounded-md px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" required className="w-full border rounded-md px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input name="subject" className="w-full border rounded-md px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" rows={6} required className="w-full border rounded-md px-4 py-2" />
              </div>
              <button type="submit" className="px-5 py-2 rounded-md text-white" style={{ backgroundColor: '#0b4383' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

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

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TemplateNavbar onOpenPostJob={() => { }} onOpenSearchJob={() => { }} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <SiteFooter />
      </div>
    }>
      <Home />
    </Suspense>
  );
}
