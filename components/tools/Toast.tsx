'use client'

// Temporary stub for migrated tools
export default function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      {message}
      <button onClick={onClose} className="ml-4 font-bold">×</button>
    </div>
  )
}
