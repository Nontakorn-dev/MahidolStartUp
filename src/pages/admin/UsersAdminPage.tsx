import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { AFFILIATION_LABELS } from '../../lib/constants'
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

  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'pr', label: 'PR' },
    { value: 'core_team', label: 'Core Team' },
    { value: 'admin', label: 'Admin' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-mu-navy">จัดการผู้ใช้</h1>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" /></div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="flex flex-wrap items-center justify-between gap-4 !p-4">
              <div>
                <p className="font-medium text-mu-navy">{u.full_name}</p>
                <div className="mt-1 flex gap-2">
                  <Badge>{AFFILIATION_LABELS[u.affiliation]}</Badge>
                  <Badge variant="gold">{u.role}</Badge>
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
