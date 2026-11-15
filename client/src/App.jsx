
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  UploadCloud,
  Files,
  Settings,
  LogOut,
} from "lucide-react";


import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("prescan_token");
    localStorage.removeItem("prescan_user");

    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] transition ${
      isActive
        ? "bg-white text-[#34443D] font-medium"
        : "text-[#65766C] hover:bg-white/60"
    }`;

  return (
    <aside className="w-[250px] min-h-screen shrink-0 bg-[#EAF0E9] px-5 py-7 flex flex-col border-r border-[#DFE7DE]">

      {/* Brand */}
      <div className="mb-14 px-2">
        <h1 className="text-[27px] font-semibold tracking-[-1.5px] text-[#34443D]">
          prescan<span className="text-[#82B9A2]">.</span>
        </h1>

        <p className="text-[9px] tracking-[2px] text-[#789083] mt-1 uppercase">
          Prescription records
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-3 px-3">
        <p className="text-[11px] font-medium text-[#87968A]">
          Workspace
        </p>
      </div>

      <nav className="space-y-1">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={18} strokeWidth={1.6} />
          Dashboard
        </NavLink>

        <NavLink to="/upload" className={navClass}>
          <UploadCloud size={18} strokeWidth={1.6} />
          Upload prescription
        </NavLink>

        <NavLink to="/history" className={navClass}>
          <Files size={18} strokeWidth={1.6} />
          History
        </NavLink>
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto pt-6 border-t border-[#D8E2D8] space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#65766C] hover:bg-white/60 transition text-[14px]"
        >
          <Settings size={18} strokeWidth={1.6} />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#65766C] hover:bg-white/60 transition text-[14px]"
        >
          <LogOut size={18} strokeWidth={1.6} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <Outlet />
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/upload" element={<Upload />} />

            <Route path="/history" element={<History />} />

          </Route>
        </Route>

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
