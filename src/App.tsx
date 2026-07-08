import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute'

import { HomePage } from './pages/public/HomePage'
import { AboutPage } from './pages/public/AboutPage'
import { EventsPage } from './pages/public/EventsPage'
import { EventDetailPage } from './pages/public/EventDetailPage'
import { PostsPage } from './pages/public/PostsPage'
import { PostDetailPage } from './pages/public/PostDetailPage'

import { MatchHubPage } from './pages/match/MatchHubPage'
import { DiscoverPage } from './pages/match/DiscoverPage'
import { StartupDetailPage } from './pages/match/StartupDetailPage'
import { MentorDetailPage } from './pages/match/MentorDetailPage'
import { CreateStartupProfilePage } from './pages/match/CreateStartupProfilePage'
import { CreateMentorProfilePage } from './pages/match/CreateMentorProfilePage'
import { ConnectionsPage } from './pages/match/ConnectionsPage'

import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ProfileSettingsPage } from './pages/profile/ProfileSettingsPage'

import { DashboardPage } from './pages/admin/DashboardPage'
import { PostsAdminPage } from './pages/admin/PostsAdminPage'
import { PostEditPage } from './pages/admin/PostEditPage'
import { EventsAdminPage } from './pages/admin/EventsAdminPage'
import { EventEditPage } from './pages/admin/EventEditPage'
import { UsersAdminPage } from './pages/admin/UsersAdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:slug" element={<EventDetailPage />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="posts/:slug" element={<PostDetailPage />} />
              <Route path="match" element={<MatchHubPage />} />
              <Route path="match/discover" element={<DiscoverPage />} />
              <Route path="match/startup/:id" element={<StartupDetailPage />} />
              <Route path="match/mentor/:id" element={<MentorDetailPage />} />
              <Route path="match/startup/new" element={<ProtectedRoute><CreateStartupProfilePage /></ProtectedRoute>} />
              <Route path="match/mentor/new" element={<ProtectedRoute><CreateMentorProfilePage /></ProtectedRoute>} />
              <Route path="match/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
            </Route>

            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <RoleRoute minRole="pr">
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="posts" element={<PostsAdminPage />} />
              <Route path="posts/new" element={<PostEditPage />} />
              <Route path="posts/:id/edit" element={<PostEditPage />} />
              <Route path="events" element={<EventsAdminPage />} />
              <Route path="events/new" element={<EventEditPage />} />
              <Route path="events/:id/edit" element={<EventEditPage />} />
              <Route
                path="users"
                element={
                  <RoleRoute minRole="core_team">
                    <UsersAdminPage />
                  </RoleRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
