import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api";

const Clients = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch all clients
  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (err) {
      toast.error("Failed to load clients");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ Add or Update client
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, data);
        toast.success("Client updated");
      } else {
        await api.post("/clients", data);
        toast.success("Client added");
      }
      reset();
      setEditingId(null);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving client");
    }
  };

  // ✅ Delete client
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success("Client deleted");
      fetchClients();
    } catch (err) {
      toast.error("Error deleting client");
    }
  };

  // ✅ Load client data into form for editing
  const handleEdit = (client) => {
    setEditingId(client._id);
    setValue("name", client.name);
    setValue("email", client.email);
    setValue("phone", client.phone);
    setValue("address", client.address);
    setValue("companyName", client.companyName);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        👥 Clients Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            {editingId ? "✏️ Edit Client" : "➕ Add New Client"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("name", { required: true })}
              placeholder="Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              {...register("email")}
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
              {...register("companyName")}
              placeholder="Company Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              {editingId ? "Update Client" : "Add Client"}
            </button>
          </form>
        </div>

        {/* Clients Table */}
        <div className="bg-white shadow-lg rounded-2xl p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            📋 Clients List
          </h2>
          {clients.length === 0 ? (
            <p className="text-gray-500">No clients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Phone</th>
                    <th className="p-3 border">Company</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client._id}
                      className="hover:bg-gray-50 transition text-sm"
                    >
                      <td className="p-3 border">{client.name}</td>
                      <td className="p-3 border">{client.email}</td>
                      <td className="p-3 border">{client.phone}</td>
                      <td className="p-3 border">{client.companyName}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
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

export default Clients;
