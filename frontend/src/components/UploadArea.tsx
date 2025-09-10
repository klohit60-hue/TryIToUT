import { useCallback, useState } from 'react'
import { UploadCloud, Image as ImageIcon } from 'lucide-react'

export default function UploadArea({
  label,
  onFile,
  accept = 'image/*',
}: {
  label: string
  onFile: (file: File | null) => void
  accept?: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    const file = files?.[0]
    if (!file) {
      onFile(null)
      setPreview(null)
      return
    }
    onFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [onFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition shadow-sm ${
        isDragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
        {preview ? (
          <img src={preview} alt="preview" className="h-36 w-full rounded-xl object-cover shadow" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-50">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <div className="text-base text-gray-700">
          {label}
        </div>
        <div className="text-xs text-gray-500">Drag & drop or click to upload</div>
        <label className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700">
          <UploadCloud className="h-4 w-4" /> Choose file
          <input type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>
    </div>
  )
}
