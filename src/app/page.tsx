import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Optique
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern product management application built with Next.js 15
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                View Products
              </Link>
              <Link
                href="/products/new"
                className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors"
              >
                Add New Product
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Modern Stack</h3>
              <p className="text-gray-600">Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS</p>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Secure</h3>
              <p className="text-gray-600">Password hashing, session management, and data validation</p>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Fast</h3>
              <p className="text-gray-600">Server components, optimized rendering, and efficient data fetching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
