import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { RichTextContent } from '../../components/cms/RichTextEditor'
import { ImagePlaceholder } from '../../components/cms/MediaPicker'
import { formatDateTime } from '../../lib/utils'
import type { Event } from '../../types'

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug!)
        .eq('status', 'published')
        .single()
      return data as Event
    },
    enabled: !!slug,
  })

  const { data: isRegistered } = useQuery({
    queryKey: ['event-registration', event?.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', event!.id)
        .eq('user_id', user!.id)
        .eq('status', 'registered')
        .maybeSingle()
      return !!data
    },
    enabled: !!event && !!user,
  })

  const registerMutation = useMutation({
    mutationFn: async () => {
      await supabase.from('event_registrations').insert({
        event_id: event!.id,
        user_id: user!.id,
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-registration'] }),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-500">ไม่พบกิจกรรมนี้</p>
        <Link to="/events" className="mt-4 inline-block text-mu-gold hover:underline">กลับไปหน้ากิจกรรม</Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {event.cover_image_url ? (
        <img src={event.cover_image_url} alt="" className="mb-8 h-64 w-full rounded-2xl object-cover sm:h-80" />
      ) : (
        <ImagePlaceholder className="mb-8 h-64 w-full rounded-2xl sm:h-80" />
      )}

      <Badge variant="gold">{formatDateTime(event.start_at)}</Badge>
      <h1 className="mt-3 text-3xl font-bold text-mu-navy">{event.title}</h1>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDateTime(event.start_at)}</span>
        {event.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>}
      </div>

      <Card className="mt-8">
        <RichTextContent content={event.description} />
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        {event.registration_url ? (
          <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
            <Button><ExternalLink className="h-4 w-4" /> ลงทะเบียน</Button>
          </a>
        ) : user ? (
          isRegistered ? (
            <Button variant="outline" disabled>ลงทะเบียนแล้ว ✓</Button>
          ) : (
            <Button onClick={() => registerMutation.mutate()} disabled={registerMutation.isPending}>
              ลงทะเบียนเข้าร่วม
            </Button>
          )
        ) : (
          <Link to="/login"><Button>เข้าสู่ระบบเพื่อลงทะเบียน</Button></Link>
        )}
        <Link to="/events"><Button variant="ghost">← กลับ</Button></Link>
      </div>
    </article>
  )
}
