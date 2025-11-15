import Image from "next/image";
import React from "react";

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-2xl font-extrabold tracking-tight mb-3">
          <Image
                src="https://res.cloudinary.com/daob5eure/image/upload/v1761033298/Kamarajar_Makkal_Munnetra_Sangam-Logo_kcdjwf.png"
                alt="KMMS Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
          </div>
          <p className="text-sm leading-6">Kamarajar Makkal Munnetra Sangam: A Vision for Social Progress
            The Kamarajar Makkal Munnetra Sangam, as a charitable trust, is dedicated to holistic community development through a multi-pronged approach focusing on social security, economic empowerment, education, and environmental stewardship. The vision is built upon five core pillars that aim to create a strong, ethical, and sustainable society.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-white font-semibold mb-3">Contact Us</h5>
            <p className="text-sm leading-6">
              No1, Selvathammal complex, First floor,<br />
              Thandayar Nagar first Street, Tondiarpet,<br />
              Chennai-600081
            </p>
            <p className="mt-3 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              +91 8015359281
            </p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Connect with us</h5>
            <p className="text-sm leading-6">
              <a href="mailto:kmms@gmail.com" className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block">
                kmms@gmail.com
              </a>
            </p>
            <h6 className="text-white font-semibold mt-4 mb-2">Follow us on social media platforms for updates :</h6>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-400">
          © {new Date().getFullYear()} KMMS. All rights reserved.
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-400">
          Designed and Developed by <a href="https://disbydigital.com" className="text-blue-400 hover:text-blue-300 text-sm  inline-block">Disby Digital</a>
        </div>
      </div>
    </footer>
  );
}
