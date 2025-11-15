import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            JobListings
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
