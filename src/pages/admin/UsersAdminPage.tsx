import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { AFFILIATION_LABELS } from '../../lib/constants'
import { ROLE_LABELS } from '../../lib/labels'
import type { Profile, UserRole } from '../../types'

export function UsersAdminPage() {
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      return (data ?? []) as Profile[]
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      await supabase.from('profiles').update({ role }).eq('id', id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-ink">จัดการผู้ใช้</h1>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="flex flex-wrap items-center justify-between gap-4 !p-4">
              <div>
                <p className="font-medium text-ink">{u.full_name}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge>{AFFILIATION_LABELS[u.affiliation] ?? u.affiliation}</Badge>
                  <Badge variant="gold">{ROLE_LABELS[u.role] ?? u.role}</Badge>
                </div>
              </div>
              <div className="w-40">
                <Select
                  value={u.role}
                  onChange={(role) => updateRoleMutation.mutate({ id: u.id, role: role as UserRole })}
                  options={roleOptions}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
