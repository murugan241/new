import React, { memo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./components/Common_Bar/Sidebar";
import Projects from "./components/Job/Projects";
import TaskView from "./components/Task/TaskView";
import Taskboard from "./components/Task/Taskboard";
import JobManagement from "./components/Job/JobManagement";
import Resume from "./components/Job/Resume";
import Shortlist from "./components/Job/Shortlist";
import AdminDepartments from "./components/Department/Admin_Departments";
import EmployeeInputFields from "./components/Task/Termination";
import Offer_Approved from "./components/Job/Offer_Approved";
import AdminAddDepartment from "./components/Department/AdminAddDepartments";
import AdminDepartmentView from "./components/Department/AdminViewDepartment";
import AttendancePage from "./components/Task/AttendancePage";
import Payroll from "./components/Payroll/Payroll";
import Payslip from "./components/Payroll/Payslip";
import Report from "./components/Report/Report";
import NotificationContainer from "./components/Notification/Notification";
import Promotion from "./components/Promotion/Promotion";
import SettingContainer from "./components/Notification/SettingContainer";
import ConfigurationPage from "./components/configuration/Configuration";
import Apraisal from "./components/configuration/ApraisalOrganization";
import PerformanceAppraisal from "./components/configuration/PerfoemaceAppraisale";
import Resignation from "./components/Promotion/Resignation";
// import AttendanceData from "./components/Task/AttendanceData";
import EmployeeAdd from "./components/Employee/AddEmployee";
import AdminEmployee from "./components/Employee/AdminEmployee";
import EditEmployee from "./components/Employee/EditEmployee";
import AdminLogin from "./components/Login/AdminLogin";
import AdminSignup from "./components/Login/AdminSignup";
import ChatUI from "./components/Employee/Message";
import TrainerList from "./components/Notification/TrainerAndTraining";
import Holidays from "./components/Notification/holidays";
import LeaveReport from "./components/Report/Leave_Report";
import DailyReport from "./components/Report/Daily_Report";
import UserReport from "./components/Report/User_Report";
import ExpenseReport from "./components/Report/ExpenseReport";
import ProjectReport from "./components/Report/ProjectReport";
import TaskReport from "./components/Report/TaskReport";
import AttendanceReport from "./components/Report/AttendenceReport";
import Accounting from "./components/Budget/Accounting";
import Dashboard from "./components/Department/Dashboard";
import HRDashboard from "./components/Department/HrDashboard";
import Invite from "./components/Login/Invite";
import UserProfile from "./components/Employee/UserProfile";

const Layout = memo(() => {
  const location = useLocation();
  const routesWithOwnSidebar = [
    "/dashboard",
    "/admin/dashboard",
    "/manager/dashboard",
    "/employee/dashboard",
    "/hr/dashboard",
    "/viewer/dashboard",
    "/configuration",
    "/employee",
    "/report",
    "/projects",
    "/taskboard",
    "/taskview",
    "/admindepartment",
    "/termination",
    "/accounting",
    "/adddepartment",
    "/department",
    "/user",
    "/expense",
    "/project",
    "/task",
    "/attendancereport",
    "/manage-jobs-view",
    "/shortlist",
    "/resume",
    "/offer-approval-view",
    "/attendance",
    "/payroll",
    "/resignation-view",
    "/slip/:employeeId",
    "/promotion",
    "/notification",
    "/settings",
    // "/attendancedata",
    "/leave_report",
    "/daily_report",
    "/apraisal",
    "/performance",
    "/employeeAdd",
    "/editEmployee",
    "/chat",
    "/training",
    "/holidays",
    "/userprofile",
  ];

  const shouldRenderSidebar = !routesWithOwnSidebar.some((route) =>
    location.pathname === route || location.pathname.includes(route.split("/:")[0])
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      {shouldRenderSidebar && (
        <Sidebar
          style={{
            width: "250px",
            flexShrink: 0,
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
            height: "100vh",
            zIndex: 1000,
          }}
          className="layout-sidebar"
        />
      )}
      <div
        className="main-content"
        style={{
          flexGrow: 1,
          marginLeft: shouldRenderSidebar ? "250px" : "0",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
});

const ProtectedRoute = memo(({ children, allowedRoles = ["admin"] }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token || !userRole || !allowedRoles.includes(userRole)) {
    console.log(`ProtectedRoute: Access denied. Token: ${!!token}, Role: ${userRole}, Allowed: ${allowedRoles}`);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log(`ProtectedRoute: Access granted. Role: ${userRole}, Path: ${location.pathname}`);
  return children;
});

const PublicRoute = memo(({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (
    location.pathname === "/login" ||
    location.pathname.startsWith("/login/") ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/invite")
  ) {
    console.log(`PublicRoute: Allowing access to ${location.pathname}`);
    return children;
  }

  if (token && userRole) {
    const redirectPath = `/${userRole}/dashboard`;
    console.log(`PublicRoute: Redirecting authenticated user (${userRole}) to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  console.log(`PublicRoute: Rendering public route ${location.pathname}`);
  return children;
});

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/login/:roleParam"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <AdminSignup />
            </PublicRoute>
          }
        />
        <Route
          path="/invite"
          element={
            <PublicRoute>
              <Invite />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager", "employee", "hr", "viewer"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="manager/dashboard" element={<Dashboard />} />
          <Route path="employee/dashboard" element={<Dashboard />} />
          <Route path="viewer/dashboard" element={<Dashboard />} />
          <Route path="hr/dashboard" element={<HRDashboard />} />
          <Route path="dashboard" element={<Navigate to={`/${localStorage.getItem("userRole")}/dashboard`} replace />} />
          <Route path="projects" element={<Projects />} />
          <Route path="taskboard" element={<Taskboard />} />
          <Route path="taskview" element={<TaskView />} />
          <Route path="admindepartment" element={<AdminDepartments />} />
          <Route path="termination" element={<EmployeeInputFields />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="adddepartment" element={<AdminAddDepartment />} />
          <Route path="department" element={<AdminDepartmentView />} />
          <Route path="report" element={<Report />} />
          <Route path="user" element={<UserReport />} />
          <Route path="expense" element={<ExpenseReport />} />
          <Route path="project" element={<ProjectReport />} />
          <Route path="task" element={<TaskReport />} />
          <Route path="attendancereport" element={<AttendanceReport />} />
          <Route path="manage-jobs-view" element={<JobManagement />} />
          <Route path="shortlist" element={<Shortlist />} />
          <Route path="resume" element={<Resume />} />
          <Route path="offer-approval-view" element={<Offer_Approved />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="resignation-view" element={<Resignation />} />
          <Route path="slip/:employeeId" element={<Payslip />} />
          <Route path="promotion" element={<Promotion />} />
          <Route path="notification" element={<NotificationContainer />} />
          <Route path="settings" element={<SettingContainer />} />
          {/* <Route path="attendancedata" element={<AttendanceData />} /> */}
          <Route path="leave_report" element={<LeaveReport />} />
          <Route path="daily_report" element={<DailyReport />} />
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="apraisal" element={<Apraisal />} />
          <Route path="performance" element={<PerformanceAppraisal />} />
          <Route path="employeeAdd" element={<EmployeeAdd />} />
          <Route path="employee" element={<AdminEmployee />} />
          <Route path="editEmployee" element={<EditEmployee />} />
          <Route path="chat" element={<ChatUI />} />
          <Route path="training" element={<TrainerList />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="userprofile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;