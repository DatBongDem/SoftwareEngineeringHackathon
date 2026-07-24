import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { PendingApprovalPage } from './pages/PendingApprovalPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ProfilePage } from '@/features/auth/pages/ProfilePage'
import { PendingUsersPage } from '@/features/auth/pages/PendingUsersPage'
import { GuestJudgePage } from '@/features/auth/pages/GuestJudgePage'
import { EventsListPage } from '@/features/events/pages/EventsListPage'
import { EventDetailPage } from '@/features/events/pages/EventDetailPage'
import { TrackDetailPage } from '@/features/tracks/pages/TrackDetailPage'
import { TeamDetailPage } from '@/features/teams/pages/TeamDetailPage'
import { SubmissionDetailPage } from '@/features/submissions/pages/SubmissionDetailPage'
import { RoundSubmissionsPage } from '@/features/submissions/pages/RoundSubmissionsPage'
import { JudgingQueuePage } from '@/features/judging/pages/JudgingQueuePage'
import { RoundJudgingPage } from '@/features/judging/pages/RoundJudgingPage'
import { CalibrationDashboardPage } from '@/features/judging/pages/CalibrationDashboardPage'
import { RoundRankingPage } from '@/features/ranking/pages/RoundRankingPage'
import { CriteriaTemplatesPage } from '@/features/criteria/pages/CriteriaTemplatesPage'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage'

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: 'pending-approval', element: <PendingApprovalPage /> },
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'events', element: <EventsListPage /> },
          { path: 'events/:eventId', element: <EventDetailPage /> },
          { path: 'tracks/:trackId', element: <TrackDetailPage /> },
          { path: 'teams/:teamId', element: <TeamDetailPage /> },
          { path: 'submissions/:submissionId', element: <SubmissionDetailPage /> },
          { path: 'rounds/:roundId/submissions', element: <RoundSubmissionsPage /> },
          { path: 'rounds/:roundId/ranking', element: <RoundRankingPage /> },
          {
            element: <RoleRoute allowedRoles={['Judge', 'Coordinator']} />,
            children: [
              { path: 'judging', element: <JudgingQueuePage /> },
              { path: 'rounds/:roundId/judge', element: <RoundJudgingPage /> },
              { path: 'rounds/:roundId/calibration', element: <CalibrationDashboardPage /> },
            ],
          },
          {
            element: <RoleRoute allowedRoles={['Coordinator']} />,
            children: [
              { path: 'admin/pending-users', element: <PendingUsersPage /> },
              { path: 'admin/guest-judges', element: <GuestJudgePage /> },
              { path: 'admin/criteria-templates', element: <CriteriaTemplatesPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  { path: '403', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
])
