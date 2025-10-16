'use client';

import React, { useState, useEffect } from 'react';

interface BannerSliderProps {
  onOpenPostJob: () => void;
  onOpenSearchJob?: () => void;
}

export default function BannerSlider({ onOpenPostJob, onOpenSearchJob }: BannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
      title: 'One million success stories.',
      subtitle: 'Start yours today.',
      description: 'Find 40,000+ Jobs, Employment & Career Opportunities'
    },
    {
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2087&auto=format&fit=crop',
      title: 'Your Dream Job Awaits',
      subtitle: 'Discover Opportunities',
      description: 'Connect with top employers across Tamil Nadu'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      title: 'Build Your Career',
      subtitle: 'With KMMS',
      description: 'Empowering youth with quality job opportunities'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gray-900/60" />
          
          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              {slide.title}{' '}
              <span className="text-green-400">{slide.subtitle}</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">{slide.description}</p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenPostJob}
                className="px-6 py-3 rounded-lg border border-blue-600 text-white bg-transparent hover:bg-white/10 transition-colors"
              >
                Post Your Job
              </button>
              <button
                onClick={onOpenSearchJob}
                className="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Looking for a Job?
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}