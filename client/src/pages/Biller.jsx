import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api";

const Billers = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [billers, setBillers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch all billers
  const fetchBillers = async () => {
    try {
      const res = await api.get("/billers");
      setBillers(res.data);
    } catch (err) {
      toast.error("Failed to load billers");
    }
  };

  useEffect(() => {
    fetchBillers();
  }, []);

  // ✅ Add or Update biller
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/billers/${editingId}`, data);
        toast.success("Biller updated");
      } else {
        await api.post("/billers", data);
        toast.success("Biller added");
      }
      reset();
      setEditingId(null);
      fetchBillers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving biller");
    }
  };

  // ✅ Delete biller
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this biller?")) return;
    try {
      await api.delete(`/billers/${id}`);
      toast.success("Biller deleted");
      fetchBillers();
    } catch (err) {
      toast.error("Error deleting biller");
    }
  };

  // ✅ Load biller into form for editing
  const handleEdit = (biller) => {
    setEditingId(biller._id);
    setValue("companyName", biller.companyName);
    setValue("email", biller.email);
    setValue("phone", biller.phone);
    setValue("address", biller.address);
    setValue("gstNumber", biller.gstNumber);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        🏢 Billers Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            {editingId ? "✏️ Edit Biller" : "➕ Add New Biller"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("companyName", { required: true })}
              placeholder="Company Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              {...register("address")}
              placeholder="Address"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              {...register("gstNumber")}
              placeholder="GST Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              {editingId ? "Update Biller" : "Add Biller"}
            </button>
          </form>
        </div>

        {/* Billers Table */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            📋 Billers List
          </h2>
          {billers.length === 0 ? (
            <p className="text-gray-500">No billers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border">Company Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Phone</th>
                    <th className="p-3 border">GST</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billers.map((biller) => (
                    <tr
                      key={biller._id}
                      className="hover:bg-gray-50 transition text-sm"
                    >
                      <td className="p-3 border">{biller.companyName}</td>
                      <td className="p-3 border">{biller.email}</td>
                      <td className="p-3 border">{biller.phone}</td>
                      <td className="p-3 border">{biller.gstNumber || "-"}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => handleEdit(biller)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(biller._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billers;
