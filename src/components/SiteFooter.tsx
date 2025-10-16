import React from "react";

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-2xl font-extrabold tracking-tight mb-3">
            <span className="text-blue-500">K</span> <span className="text-white">MMS</span>
          </div>
          <p className="text-sm leading-6">Kamarajar Makkal Munnetra Sangam: A Vision for Social Progress
            The Kamarajar Makkal Munnetra Sangam, as a charitable trust, is dedicated to holistic community development through a multi-pronged approach focusing on social security, economic empowerment, education, and environmental stewardship. The vision is built upon five core pillars that aim to create a strong, ethical, and sustainable society.
          </p>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-3">Address</h5>
          <p className="text-sm leading-6">
            No1, Selvathammal complex, First floor,<br />
            Thandayar Nagar first Street, Tondiarpet,<br />
            Chennai-81
          </p>
          <p className="mt-3 text-sm">Cell: 8015359281</p>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-400">
          © {new Date().getFullYear()} KMMS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
