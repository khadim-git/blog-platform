'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Blog Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Successfully Deployed! 🚀
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Backend Connected</h2>
          <p className="text-green-600 font-semibold">
            ✅ API: {process.env.NEXT_PUBLIC_API_URL}
          </p>
          <div className="mt-4 space-x-4">
            <a href="/simple" className="text-blue-600 hover:text-blue-700">
              View Simple Page →
            </a>
            <a href="/posts" className="text-green-600 hover:text-green-700">
              View Posts →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}