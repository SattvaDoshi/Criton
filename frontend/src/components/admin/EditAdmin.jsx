import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditAdmin = () => {
  const { tenantId, userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    companyName: "",
    companyGST: "",
    comapnyAddress: "",
    number: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/all-users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const tenant = response.data.users.find((t) => t.tenantId === tenantId);
        const userData = tenant.users.find((u) => u._id === userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [tenantId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/edit-user/${tenantId}/${userId}`, user, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Edit User</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Company Name</label>
            <input
              type="text"
              value={user.companyName}
              onChange={(e) => setUser({ ...user, companyName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Company GST</label>
            <input
              type="text"
              value={user.companyGST}
              onChange={(e) => setUser({ ...user, companyGST: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Company Address</label>
            <input
              type="text"
              value={user.comapnyAddress}
              onChange={(e) => setUser({ ...user, comapnyAddress: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Phone Number</label>
            <input
              type="text"
              value={user.number}
              onChange={(e) => setUser({ ...user, number: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAdmin;