import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { TagGroup, TagOption } from '../types/msc-connect'

const FALLBACK_TAGS: TagOption[] = [
  { id: '1', tag_group: 'industry', tag_key: 'foodtech', label_th: 'FoodTech', label_en: 'FoodTech', is_active: true, sort_order: 1 },
  { id: '2', tag_group: 'industry', tag_key: 'healthtech', label_th: 'HealthTech', label_en: 'HealthTech', is_active: true, sort_order: 2 },
  { id: '3', tag_group: 'industry', tag_key: 'edtech', label_th: 'EdTech', label_en: 'EdTech', is_active: true, sort_order: 3 },
  { id: '4', tag_group: 'industry', tag_key: 'fintech', label_th: 'FinTech', label_en: 'FinTech', is_active: true, sort_order: 4 },
  { id: '5', tag_group: 'industry', tag_key: 'deeptech', label_th: 'Deep Tech', label_en: 'Deep Tech', is_active: true, sort_order: 5 },
  { id: '6', tag_group: 'industry', tag_key: 'sustainability', label_th: 'Sustainability', label_en: 'Sustainability', is_active: true, sort_order: 6 },
  { id: '7', tag_group: 'need_offer', tag_key: 'mentor_tech', label_th: 'Mentor ด้านเทคนิค', label_en: 'Technical Mentor', is_active: true, sort_order: 1 },
  { id: '8', tag_group: 'need_offer', tag_key: 'funding', label_th: 'เงินทุน', label_en: 'Funding', is_active: true, sort_order: 2 },
  { id: '9', tag_group: 'need_offer', tag_key: 'pilot_partner', label_th: 'Pilot Partner', label_en: 'Pilot Partner', is_active: true, sort_order: 3 },
  { id: '10', tag_group: 'need_offer', tag_key: 'beta_customers', label_th: 'ลูกค้าทดสอบ', label_en: 'Beta Customers', is_active: true, sort_order: 4 },
  { id: '11', tag_group: 'need_offer', tag_key: 'distribution', label_th: 'ช่องทาง Distribution', label_en: 'Distribution', is_active: true, sort_order: 5 },
  { id: '12', tag_group: 'need_offer', tag_key: 'legal', label_th: 'คำแนะนำด้านกฎหมาย', label_en: 'Legal Advice', is_active: true, sort_order: 6 },
  { id: '13', tag_group: 'need_offer', tag_key: 'connection', label_th: 'Connection', label_en: 'Connection', is_active: true, sort_order: 7 },
  { id: '14', tag_group: 'need_offer', tag_key: 'feedback', label_th: 'Feedback ทั่วไป', label_en: 'Feedback', is_active: true, sort_order: 8 },
]

export function useTagOptions(group?: TagGroup) {
  return useQuery({
    queryKey: ['tag-options', group],
    queryFn: async () => {
      let query = supabase
        .from('tag_options')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (group) query = query.eq('tag_group', group)

      const { data, error } = await query
      if (error || !data?.length) {
        return group
          ? FALLBACK_TAGS.filter((t) => t.tag_group === group)
          : FALLBACK_TAGS
      }
      return data as TagOption[]
    },
    staleTime: 5 * 60_000,
  })
}

export function tagLabel(tags: TagOption[], key: string): string {
  return tags.find((t) => t.tag_key === key)?.label_th ?? key
}
