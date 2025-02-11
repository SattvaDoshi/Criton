import React, { useState } from "react";
import { api } from "../../const";
import { CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const ApproveAdmin = ({ unverifiedTenants }) => {
  const [loading, setLoading] = useState(null);

  const handleVerifyTenant = async (tenantId) => {
    const confirm = window.confirm("Are you sure you want to verify this tenant?");
    if (!confirm) return;

    setLoading(tenantId);
    try {
      await api.put(`/admin/verify-tenant/${tenantId}`);
      toast.success("Tenant verified successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error verifying tenant:", error);
      alert("Failed to verify tenant.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6  bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8 flex items-center justify-center gap-3">
          <CheckCircle2 className="text-green-500" size={32} />
          Unverified Tenants
        </h1>

        {unverifiedTenants.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-md">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">
              No unverified tenants available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unverifiedTenants.map((tenant) => (
              <div
                key={tenant._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-blue-500"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Tenant ID</span>
                    <span className="text-sm font-medium text-blue-600">
                      {tenant.tenantId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-blue-600">
                      {tenant.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleVerifyTenant(tenant.tenantId)}
                  disabled={loading === tenant.tenantId}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                    loading === tenant.tenantId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                  }`}
                >
                  {loading === tenant.tenantId ? "Verifying..." : "Verify Tenant"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveAdmin;