import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Affiliation, Profile } from '../types'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    affiliation?: Affiliation,
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string, metadata?: Record<string, unknown>) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    // ผู้ที่ต้องยืนยันอีเมลก่อน จะยังไม่มี session ตอนสมัคร — เก็บสังกัดจาก metadata
    // มาใส่ให้ตอน login ครั้งแรก และเฉพาะโปรไฟล์ที่ยังไม่เคยถูกแก้ไขเท่านั้น
    const pending = metadata?.affiliation as Profile['affiliation'] | undefined
    const untouched = data && data.created_at === data.updated_at
    if (data && pending && untouched && data.affiliation !== pending) {
      const { data: updated } = await supabase
        .from('profiles')
        .update({ affiliation: pending })
        .eq('id', userId)
        .select('*')
        .maybeSingle()
      setProfile((updated ?? data) as Profile)
      return
    }

    setProfile(data as Profile | null)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.user_metadata)
        } else {
          setProfile(null)
        }
        setLoading(false)
      },
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    affiliation: Affiliation = 'mu_student',
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, affiliation } },
    })
    if (error) return { error: error as Error }

    /**
     * trigger handle_new_user เขียนแค่ full_name/avatar_url — สังกัดที่ผู้ใช้เลือก
     * จึงหายไปทั้งที่ฟอร์มถามไว้ ถ้าสมัครแล้วได้ session ทันที (ปิด email confirm)
     * ให้อัปเดตต่อเลย ส่วนกรณีต้องยืนยันอีเมล ค่าจะถูกอ่านจาก metadata ตอน login ครั้งแรก
     */
    if (data.session?.user) {
      await supabase.from('profiles').update({ affiliation }).eq('id', data.session.user.id)
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signIn, signUp, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
