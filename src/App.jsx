import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import GuestRoute from "./routes/GuestRoute"
import AdminRoute from "./routes/AdminRoute"
import DashboardLayout from "./components/DashboardLayout"
import Subjects from "./pages/Subjects"
import SubjectDetails from "./pages/SubjectDetails"
import AdminSubjects from "./pages/admin/subjects/Subjects"
import NewSubject from "./pages/admin/subjects/NewSubject"
import EditSubject from "./pages/admin/subjects/EditSubject"
import AdminTopics from "./pages/admin/subjects/topics/Topics"
import NewTopic from "./pages/admin/subjects/topics/NewTopic"
import EditTopic from "./pages/admin/subjects/topics/EditTopic"

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Student */}
          <Route
            path="/subjects"
            element={<Subjects />}
          />

          <Route
            path="/subjects/:subjectId"
            element={<SubjectDetails />}
          />

          {/* Admin */}
          <Route
            path="/admin/subjects"
            element={
              <AdminRoute>
                <AdminSubjects />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/subjects/:subjectId/edit"
            element={
              <AdminRoute>
                <EditSubject />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/subjects/new"
            element={
              <AdminRoute>
                <NewSubject />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/subjects/:subjectId/topics"
            element={
              <AdminRoute>
                <AdminTopics />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/subjects/:subjectId/topics/new"
            element={
              <AdminRoute>
                <NewTopic />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/subjects/:subjectId/topics/:topicId/edit"
            element={
              <AdminRoute>
                <EditTopic />
              </AdminRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App