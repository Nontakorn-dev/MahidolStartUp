import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'

interface MediaPickerProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

export function MediaPicker({ value, onChange, label }: MediaPickerProps) {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    if (!user) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file)

    if (uploadError) {
      alert('อัปโหลดไม่สำเร็จ: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)

    await supabase.from('media_assets').insert({
      uploaded_by: user.id,
      file_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })

    onChange(publicUrl)
    setUploading(false)
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-mu-navy">{label}</label>}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-gray-200">
          <img src={value} alt="" className="h-48 w-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
              เปลี่ยนรูป
            </Button>
            <Button size="sm" variant="danger" onClick={() => onChange(null)}>ลบ</Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-mu-gold hover:text-mu-gold"
        >
          {uploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-mu-gold border-t-transparent" />
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span className="text-sm">คลิกเพื่ออัปโหลดรูปภาพ</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
    </div>
  )
}

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-ted-light to-gold-tint/40 ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 text-2xl font-bold text-ted-sky/40">
        MU
      </div>
    </div>
  )
}
