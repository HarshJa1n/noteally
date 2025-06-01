import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Noteally
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Transform your book photos into searchable digital notes with AI-powered OCR
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto mb-12 sm:mb-16">
          <Link href="/upload" className="group">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-6 text-center touch-manipulation">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-indigo-200 transition-colors">
                <span className="text-xl sm:text-2xl">📸</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Upload</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Upload photos of book pages for AI text extraction
              </p>
            </div>
          </Link>

          <Link href="/editor" className="group">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-6 text-center touch-manipulation">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-xl sm:text-2xl">✍️</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Editor</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Rich text editor for creating and editing notes
              </p>
            </div>
          </Link>

          <Link href="/notes" className="group">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-6 text-center touch-manipulation">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Browse and manage your digital notes with filtering by tags and categories
              </p>
            </div>
          </Link>
        </div>

        {/* How It Works Section */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📷</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">1. Capture</h3>
              <p className="text-sm sm:text-base text-gray-600">Take photos of book pages or upload existing images</p>
            </div>
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🤖</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">2. Extract</h3>
              <p className="text-sm sm:text-base text-gray-600">AI-powered OCR extracts text automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📝</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">3. Edit</h3>
              <p className="text-sm sm:text-base text-gray-600">Edit, organize, and search your digital notes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
