interface NoteDetailPageProps {
  params: {
    id: string
  }
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Note Details</h1>
      <p className="text-gray-600 mb-4">Note ID: {params.id}</p>
      <div className="bg-white shadow-sm border rounded-lg p-6">
        <p className="text-gray-500">Note content will be displayed here.</p>
      </div>
    </div>
  )
} 