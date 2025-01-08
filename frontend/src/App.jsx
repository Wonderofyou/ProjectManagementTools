import './App.css'
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage.jsx";
import InvitationPage from './pages/InvitationPage.jsx';
import TasksPage from "./pages/TasksPage.jsx";
import AddNewTaskPage from "./pages/AddNewTaskPage.jsx";
import AddNewProjectPage from "./pages/AddNewProjectPage.jsx";
import ReportPage from './pages/ReportPage.jsx';
import ReportsListPage from './pages/ReportsListPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';



axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/projects' element={<ProjectsPage />} />
          <Route path="/account/projects/new" element={<AddNewProjectPage />} />
          <Route path="/messages" element={<InvitationPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path='/projects/new' element={<AddNewProjectPage />} />
          <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
          <Route path="/projects/:projectId/tasks/new" element={<AddNewTaskPage />} />
          <Route path="/report" element={<ReportsListPage />} />
          <Route path="/report/:projectId" element={<ReportPage />} />
        </Route>


      </Routes>
    </UserContextProvider>
  )
}

export default App
