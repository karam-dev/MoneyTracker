import React from 'react'
import ReactDOM from 'react-dom'

import { lazy, Suspense } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import MainLayout from '@routes/_Layout'
import MantineSetUp from '@components/MantineSetUp'
import { Provider as Redux } from 'react-redux'
import { store } from '@redux/index'
import GoogleCallback from '@routes/auth/GoogleCallback'
import { Routes as ModalRoutes } from '@components/ReactRoute/index'

import Auth from '@routes/auth/Auth'
import Profile, { ProfileIndex } from '@routes/profile/profile'
import ProfileUpdate from '@components/Forms/Profile_update'
import Profile_SetPassword from '@components/Forms/Profile_SetPassword'
import Profile_ChangePassword from '@components/Forms/Profile_changePassword'
import { Page } from '@components/ReactRoute/index'

import Notification from '@components/Notifications'
import { NavigateController } from '@redux/actions/app/navigate.action'

const AddLog = lazy(() => import('@components/Forms/Log_add'))
const EditLog = lazy(() => import('@components/Forms/Log_edit'))
const AddCategory = lazy(() => import('@components/Forms/Category_add'))
const EditCategory = lazy(() => import('@components/Forms/Category_edit'))

const Index = lazy(() => import('@routes/index'))
const Categories = lazy(() => import('@routes/categories'))
const Charts = lazy(() => import('@routes/charts'))
const About = lazy(() => import('@routes/about'))
const Export = lazy(() => import('@routes/export'))
const Setting = lazy(() => import('@routes/setting'))
const RateUs = lazy(() => import('@routes/rateUs'))
const E404 = lazy(() => import('@routes/_E404'))

import 'types/schema'
declare module 'types/schema' {
  type isPopulated<A, B> = B
  type Doc = {
    _id: string
    __v: number
  }
  type T = {
    createdAt: string
    updatedAt: string
  }
  type Optional<V> = V | undefined | null
}

function App() {
  return (
    <MantineSetUp>
      <Redux store={store}>
        <BrowserRouter>
          <NavigateController />
          <Suspense fallback={<>waiting</>}>
            <ModalRoutes>
              <Route element={<Page />}>
                <Route element={<MainLayout />}>
                  <Route index element={<Index />} />
                  <Route path="charts" element={<Charts />} />
                  <Route path="categories" element={<Categories />} />
                </Route>

                <Route path="about" element={<About />} />
                <Route path="export" element={<Export />} />
                <Route path="setting" element={<Setting />} />
                <Route path="rate-us" element={<RateUs />} />
                <Route path="addLog" element={<AddLog />} />
                <Route path="editLog/:id" element={<EditLog />} />
                <Route path="addCategory" element={<AddCategory />} />
                <Route path="editCategory/:id" element={<EditCategory />} />

                <Route path="profile" element={<Profile />}>
                  <Route index element={<ProfileIndex />} />
                  <Route path="update" element={<ProfileUpdate />} />
                  <Route path="setPassword" element={<Profile_SetPassword />} />
                  <Route
                    path="changePassword"
                    element={<Profile_ChangePassword />}
                  />
                </Route>

                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/auth/google/callback"
                  element={<GoogleCallback />}
                />

                <Route path={'*'} element={<E404 />} />
              </Route>
            </ModalRoutes>
            <Notification />
          </Suspense>
        </BrowserRouter>
      </Redux>
    </MantineSetUp>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
