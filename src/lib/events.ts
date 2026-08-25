import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import { excerpt, formatDate, tiptapToText } from './utils'
import { CLUB_EVENTS, sortEvents, type ClubEvent } from '../data/events'
import type { Event } from '../types'

/**
 * กิจกรรมของเว็บมาจากสองที่: ชุดที่เขียนไว้ในโค้ด (CLUB_EVENTS) และกิจกรรมที่ทีม PR
 * สร้างผ่าน Admin CMS (ตาราง events) — ก่อนหน้านี้หน้าเว็บอ่านแค่ชุดแรก
 * ทำให้กิจกรรมที่สร้างจากหลังบ้านไม่เคยขึ้นหน้าเว็บเลย
 */
function fromCmsEvent(row: Event): ClubEvent {
  const text = tiptapToText(row.description)
  const startTime = new Date(row.start_at).getTime()
  const hasStarted = Number.isFinite(startTime) && startTime < Date.now()

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: row.title,
    tagline: text ? excerpt(text, 140) : 'กิจกรรมจาก Mahidol Startup Club',
    coverImage: row.cover_image_url,
    category: 'กิจกรรม',
    status: row.status === 'completed' || hasStarted ? 'closed' : row.registration_url ? 'open' : 'upcoming',
    deadline: row.start_at,
    deadlineLabel: formatDate(row.start_at),
    startAt: row.start_at,
    location: row.location ?? '',
    registrationUrl: row.registration_url,
    highlights: [],
    body: [],
    richBody: row.description,
    organizer: 'Mahidol Startup Club',
    source: 'cms',
  }
}

const CURATED: ClubEvent[] = CLUB_EVENTS.map((e) => ({ ...e, source: 'curated' }))

function useCmsEvents() {
  return useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_at', { ascending: false })
      return (data ?? []) as Event[]
    },
    staleTime: 60_000,
  })
}

export function useClubEvents() {
  const { data: cmsRows = [], isLoading } = useCmsEvents()

  return useMemo(() => {
    const cms = cmsRows.map(fromCmsEvent)
    // กิจกรรมจาก CMS ที่ใช้ slug ซ้ำกับชุดที่เขียนไว้ในโค้ด ให้ชุดในโค้ดชนะ
    const curatedSlugs = new Set(CURATED.map((e) => e.slug))
    const merged = [...CURATED, ...cms.filter((e) => !curatedSlugs.has(e.slug))]
    return { ...sortEvents(merged), isLoading }
  }, [cmsRows, isLoading])
}

export function useClubEvent(slug: string | undefined) {
  const { all, isLoading } = useClubEvents()
  const event = slug ? all.find((e) => e.slug === slug) : undefined
  const related = all.filter((e) => e.slug !== slug).slice(0, 3)
  return { event, related, isLoading }
}
