import React, { useEffect, useState } from "react";
import AllAdmin from "../../components/admin/AllAdmin";
import { api } from "../../const";
import ApproveAdmin from "../../components/admin/ApproveAdmin";


const AdminDashboard = () => {
  const [unverifiedTenants, setUnverifiedTenants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchUnverifiedTenants();
    fetchAllUsers();
  }, []);

  const fetchUnverifiedTenants = async () => {
    try {
      const response =await api.get("/admin/unverified-tenants");
      console.log(response);
      
      setUnverifiedTenants(response.data.unverifiedTenants);
    } catch (error) {
      console.error("Error fetching unverified tenants:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response =await api.get("/admin/all-users");
      console.log(response.data.users);
      setAllUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };



  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Unverified Tenants
        </h2>
          {unverifiedTenants.length > 0 ? (
            <ApproveAdmin unverifiedTenants={unverifiedTenants} />
          ) : (
            <p>No unverified tenants found.</p>
          )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">All Users</h2>
        {allUsers.length > 0 ? (
          <AllAdmin allUsers={allUsers} />
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;