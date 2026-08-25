import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface RichTextEditorProps {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  placeholder?: string
}

function isEmptyDoc(content: Record<string, unknown> | null | undefined) {
  return !content || Object.keys(content).length === 0
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'เริ่มเขียนเนื้อหา...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
  })

  /**
   * useEditor สร้าง instance ครั้งเดียว ไม่ตามค่า content ที่เปลี่ยนทีหลัง
   * ตอนแก้ไขบทความเดิม content จะโหลดมาหลัง editor ถูกสร้าง — ถ้าไม่ sync ตรงนี้
   * ทีม PR จะเปิดหน้าแก้ไขแล้วเห็นช่องเนื้อหาว่างเปล่าทั้งที่บทความมีเนื้อหาอยู่
   */
  const hydrated = useRef(false)
  useEffect(() => {
    if (!editor || hydrated.current || isEmptyDoc(content)) return
    hydrated.current = true
    editor.commands.setContent(content, { emitUpdate: false })
  }, [editor, content])

  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg p-1.5 transition-colors',
        active ? 'bg-ink text-white' : 'text-ink-soft hover:bg-paper',
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex flex-wrap gap-1 border-b border-line bg-paper p-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('URL:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          active={editor.isActive('link')}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:text-gray-400 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />
    </div>
  )
}

export function RichTextContent({ content }: { content: Record<string, unknown> }) {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    editable: false,
  })

  useEffect(() => {
    if (editor && !isEmptyDoc(content)) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  if (!editor) return null
  return (
    <EditorContent
      editor={editor}
      className="prose prose-sm max-w-none [&_.tiptap]:outline-none"
    />
  )
}
