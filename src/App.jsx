import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"

import Dashboard from "./pages/Dashboard"
import Subjects from "./pages/Subjects"
import SubjectDetails from "./pages/SubjectDetails"

import ProtectedRoute from "./routes/ProtectedRoute"
import GuestRoute from "./routes/GuestRoute"
import AdminRoute from "./routes/AdminRoute"

import DashboardLayout from "./components/DashboardLayout"

import AdminSubjects from "./pages/admin/subjects/Subjects"
import NewSubject from "./pages/admin/subjects/NewSubject"
import EditSubject from "./pages/admin/subjects/EditSubject"

import AdminTopics from "./pages/admin/subjects/topics/Topics"
import NewTopic from "./pages/admin/subjects/topics/NewTopic"
import EditTopic from "./pages/admin/subjects/topics/EditTopic"

import Lessons from "./pages/admin/subjects/topics/lessons/Lessons"
import NewLesson from "./pages/admin/subjects/topics/lessons/NewLesson"
import EditLesson from "./pages/admin/subjects/topics/lessons/EditLesson"

import Activities from "./pages/admin/subjects/topics/lessons/activities/Activities"
import NewActivity from "./pages/admin/subjects/topics/lessons/activities/NewActivity"
import EditActivity from "./pages/admin/subjects/topics/lessons/activities/EditActivity"

import LessonPlayer from "./pages/LessonPlayer"
import TopicDetails from "./pages/TopicDetails"
import LessonStudy from "./pages/LessonStudy"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Authenticated */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Student */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route
            path="/subjects/:subjectId"
            element={<SubjectDetails />}
          />

          <Route
            path="/subjects/:subjectId/topics/:topicId"
            element={<TopicDetails />}
          />

          <Route
            path="/lessons/:lessonId"
            element={<LessonStudy />}
          />

          <Route
            path="/lessons/:lessonId/learn"
            element={<LessonPlayer />}
          />

          <Route
            path="/lessons/:lessonId/learn"
            element={<LessonPlayer />}
          />



          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin/subjects"
              element={<AdminSubjects />}
            />

            <Route
              path="/admin/subjects/new"
              element={<NewSubject />}
            />

            <Route
              path="/admin/subjects/:subjectId/edit"
              element={<EditSubject />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics"
              element={<AdminTopics />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/new"
              element={<NewTopic />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/edit"
              element={<EditTopic />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/lessons"
              element={<Lessons />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/lessons/new"
              element={<NewLesson />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/lessons/:lessonId/edit"
              element={<EditLesson />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/lessons/:lessonId/activities"
              element={<Activities />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/lessons/:lessonId/activities/new"
              element={<NewActivity />}
            />

            <Route
              path="/admin/subjects/:subjectId/topics/:topicId/lessons/:lessonId/activities/:activityId/edit"
              element={<EditActivity />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App