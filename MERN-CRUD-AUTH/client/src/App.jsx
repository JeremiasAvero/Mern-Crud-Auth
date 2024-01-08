import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import TasksPage from "./pages/TasksPage.jsx";
import TasksFormPage from "./pages/TaskFormPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import Navbar from "./components/NavBar.jsx";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
       <main className="container mx-auto px-10">
       <Navbar/>
          <Routes>
            {/* public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* private */}
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/new" element={<TasksFormPage />} />
              <Route path="/tasks/:id" element={<TasksFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
       </main>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
