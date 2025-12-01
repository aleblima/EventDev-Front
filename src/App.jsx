import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import * as reactRouterDom from 'react-router-dom'
import { SuperTokensWrapper } from 'supertokens-auth-react'
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui'
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui'

import Footer from '@/shared/components/Footer'
import Navbar from '@/shared/components/Navbar'
import ProtectedRoute from '@/shared/components/ProtectedRoute'
import AuthProvider from '@/shared/providers/AuthContext'

// Lazy imports
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))
const AdminPanel = lazy(() => import('@/pages/AdminPanel'))
const Events = lazy(() => import('@/pages/Events'))
const CreateEvent = lazy(() => import('@/pages/CreateEvent'))
const Communities = lazy(() => import('@/pages/Communities'))
const CommunityRegister = lazy(() => import('@/pages/CommunityRegister'))
const CommunityProfile = lazy(() => import('@/pages/CommunityProfile'))
const PageNotFound = lazy(() => import('@/pages/PageNotFound'))
const CommunityEdit = lazy(() => import('@/pages/CommunityEdit'))
const EditEvent = lazy(() => import('@/pages/EditEvent'))
const EventDetails = lazy(() => import('@/pages/EventDetails'))
const MyTickets = lazy(() => import('@/pages/MyTickets'))

export default function App() {
  return (
    <SuperTokensWrapper>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Carregando...</div>}>
            <Routes>
              {/* SuperTokens Routes */}
              {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [EmailPasswordPreBuiltUI])}

              {/* Public Routes */}
              <Route
                path="/"
                element={<Home />} />
              <Route
                path="/eventos"
                element={<Events />} />
              <Route
                path="/eventos/:eventId"
                element={<EventDetails />} />
              <Route
                path="/comunidades"
                element={<Communities />} />
              <Route
                path="/login"
                element={<Login />} />
              <Route
                path="/registrar"
                element={<Register />} />
              <Route
                path="/recuperar-senha"
                element={<ResetPassword />} />
              <Route
                path="/comunidades/:communityId"
                element={<CommunityProfile />} />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute roles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                )} />

              {/* Protected Routes - Community Owner */}
              <Route
                path="/minha-comunidade/:communityId"
                element={(
                  <ProtectedRoute roles={['community']}>
                    <CommunityProfile isOwner={true} />
                  </ProtectedRoute>
                )} />

              <Route
                path="/minha-comunidade/:communityId/editar"
                element={(
                  <ProtectedRoute roles={['community']}>
                    <CommunityEdit />
                  </ProtectedRoute>
                )} />

              <Route
                path="/minha-comunidade/:comunidadeId/eventos/novo"
                element={(
                  <ProtectedRoute roles={['community']}>
                    <CreateEvent />
                  </ProtectedRoute>
                )} />

              <Route
                path="/eventos/:eventoId/editar"
                element={(
                  <ProtectedRoute roles={['community']}>
                    <EditEvent />
                  </ProtectedRoute>
                )} />

              {/* Protected Routes - Authenticated Users (Any role) */}
              <Route
                path="/meus-ingressos"
                element={(
                  <ProtectedRoute>
                    <MyTickets />
                  </ProtectedRoute>
                )} />

              <Route
                path="/comunidades/nova"
                element={(
                  <ProtectedRoute>
                    <CommunityRegister />
                  </ProtectedRoute>
                )} />

              {/* 404 */}
              <Route
                path="*"
                element={<PageNotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </SuperTokensWrapper>
  )
}
