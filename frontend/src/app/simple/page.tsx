'use client';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Blog Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Working! Backend connected.
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">API Status</h2>
          <p className="text-green-600 font-semibold">
            ✅ {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
      </div>
    </div>
  );
}