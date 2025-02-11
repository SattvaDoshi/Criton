import React from "react";
import { Link } from "react-router-dom";

const AllAdmin = ({ allUsers }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
              Tenant ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
              Verification Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user._id} className="border-b border-blue-50">
              <td className="px-6 py-4 text-sm text-blue-900">
                {user.tenantId}
              </td>
              <td className="px-6 py-4 text-sm text-blue-900">
                {user.email}
              </td>
              <td className="px-6 py-4 text-sm text-blue-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-blue-900">
                {user.isVerified ? 'Verified' : 'Unverified'}
              </td>
              <td className="px-6 py-4 text-sm text-blue-900">
                <Link
                  to={`/edit/${user.tenantId}/${user._id}`}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Edit
                </Link>
                <Link
                  to={`/delete/${user.tenantId}/${user._id}`}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAdmin;