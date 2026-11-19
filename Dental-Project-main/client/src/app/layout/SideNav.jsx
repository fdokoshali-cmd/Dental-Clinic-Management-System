/* eslint-disable no-unused-vars */
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "../../utils/SlideBar.css";
import { useState } from "react";

const SideNav = ({ setActiveTopic }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("User"));
  const [showUserSubsetUser, setShowUserSubsetUser] = useState(() => {
    const savedState = localStorage.getItem("showSubsetUser");
    return savedState === "true";
  });
  const [showStockSubset, setShowStockSubset] = useState(() => {
    const savedState = localStorage.getItem("showSubsetStock");
    return savedState === "true";
  });

  const toggleUserSubset = () => {
    setShowUserSubsetUser((prev) => {
      const newState = !prev;
      localStorage.setItem("showSubsetUSer", newState);
      return newState;
    });
  };

  const toggleStockSubset = () => {
    setShowStockSubset((prev) => {
      const newState = !prev;
      localStorage.setItem("showSubsetStock", newState);
      return newState;
    });
  };

  const NavItem = ({ to, Icon, topic, label }) => {
    const isActive = location.pathname === to;
    NavItem.propTypes = {
      to: PropTypes.string.isRequired,
      Icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      topic: PropTypes.string.isRequired,
    };

    return (
      <Link to={to} onClick={() => setActiveTopic(topic)}>
        <div
          className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
            ${
              isActive ? "text-white bg-slate-900 font-bold" : "text-gray-300"
            }`}
        >
          <Icon className="h-6 w-6" />
          <p className="flex items-center">{label}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-[200px] bg-zinc-700 flex flex-col h-full">
        <div className="flex-shrink-0 flex items-center justify-center h-16 bg-zinc-700 mb-4">
          <h1 className="text-white font-bold text-lg">Dental Clinic</h1>
        </div>
        <div className="flex-1 overflow-y-auto sidebar">
          {user?.role === "Super Admin" && (
            <NavItem
              to="/app/dashboard"
              Icon={() => <i className="bi bi-card-text"></i>}
              label="Dashboard"
              topic="Dashboard"
            />
          )}

          {user?.role === "patient" && (
            <NavItem
              to="/app/upcomingAppointment"
              Icon={() => <i className="bi bi-file-earmark-text"></i>}
              label="Appointments"
              topic="Upcoming Appointment"
            />
          )}

          {user?.role !== "patient" && (
            <NavItem
              to="/app/todayAppointment"
              Icon={() => <i className="bi bi-file-earmark-text"></i>}
              label="Appointments"
              topic="Today Appointment"
            />
          )}

          {user?.role !== "Assistant" && (
            <NavItem
              to="/app/pastAppointment"
              Icon={() => <i className="bi bi-clock-history"></i>}
              label="History"
              topic="Patient History"
            />
          )}

          {user?.role === "Super Admin" && (
            <NavItem
              to="/app/treatmentData"
              Icon={() => <i className="bi bi-life-preserver"></i>}
              label="Treatment Data"
              topic="Treatment Data"
            />
          )}

          {user?.role === "Super Admin" && (
            <div
              className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
        ${
          showUserSubsetUser
            ? "text-white border border-gray-300 font-bold"
            : "text-gray-300"
        }`}
              onClick={toggleUserSubset}
            >
              <i className="bi bi-people"></i>
              <p>User Management</p>
            </div>
          )}

          {showUserSubsetUser && (
            <div className="pl-3">
              <NavItem
                to="/app/memberManagemnt"
                Icon={() => <i className="bi bi-person-fill-gear"></i>}
                label="Members"
                topic="Member Management"
              />
              <NavItem
                to="/app/supplierManagemnt"
                Icon={() => <i className="bi bi-boxes"></i>}
                label="Suppliers"
                topic="Supplier Management"
              />
              <NavItem
                to="/app/patientManagemnt"
                Icon={() => <i className="bi bi-diagram-3"></i>}
                label="patients"
                topic="Patients Management"
              />
            </div>
          )}

          {user?.role !== "patient" && (
            <div
              className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
        ${
          showStockSubset
            ? "text-white border border-gray-300 font-bold"
            : "text-gray-300"
        }`}
              onClick={toggleStockSubset}
            >
              <i className="bi bi-box"></i>
              <p>Stock</p>
            </div>
          )}

          {showStockSubset && (
            <div className="pl-3">
              {user.role === "Super Admin" && (
                <NavItem
                  to="/app/addItems"
                  Icon={() => <i className="bi bi-plus-square"></i>}
                  label="Add Items"
                  topic="Add Items"
                />
              )}

              <NavItem
                to="/app/grn"
                Icon={() => <i className="bi bi-file-earmark-plus"></i>}
                label="GRN"
                topic="GRN"
              />

              {user.role === "Super Admin" && (
                <NavItem
                  to="/app/reqestNote"
                  Icon={() => <i className="bi bi-file-earmark-text"></i>}
                  label="Request Note"
                  topic="Request Note"
                />
              )}

              {user.role !== "Assistant" && (
                <NavItem
                  to="/app/stock"
                  Icon={() => <i className="bi bi-box"></i>}
                  label="Stock"
                  topic="Stock"
                />
              )}
            </div>
          )}

          <NavItem
            to="/app/profile"
            Icon={() => <i className="bi bi-person-circle"></i>}
            label="Profile"
            topic="Profile"
          />

          {user?.role === "Super Admin" && (
            <NavItem
              to="/app/setting"
              Icon={() => <i className="bi bi-gear"></i>}
              label="Settings"
              topic="Settings"
            />
          )}
        </div>

        <div className="flex-shrink-0 w-full bg-zinc-700 py-4">
          <div
            className="flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer text-gray-300"
            onClick={() => {
              localStorage.clear();
              setTimeout(() => {
                window.location.href = "/";
              }, 0);
            }}
          >
            <i className="bi bi-door-open-fill"></i>
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SideNav.propTypes = {
  setActiveTopic: PropTypes.func.isRequired,
};

export default SideNav;
