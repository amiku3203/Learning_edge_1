import React, { useEffect, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaUsers, FaFileInvoice, FaBuilding } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

const Analytics = () => {
  const [data, setData] = useState({ clients: 0, billers: 0, invoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics"); // backend route
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ImSpinner2 className="animate-spin text-blue-500 text-5xl" />
      </div>
    );
  }

  const chartData = [
    { name: "Clients", value: data.clients || 0 },
    { name: "Billers", value: data.billers || 0 },
    { name: "Invoices", value: data.invoices || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">📊 Analytics Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        <div className="bg-white p-6 rounded-2xl shadow text-center flex flex-col items-center">
          <FaUsers className="text-blue-500 text-4xl mb-2" />
          <h2 className="text-gray-600 text-sm uppercase">Clients</h2>
          <p className="text-3xl font-bold text-blue-500">
            {data.clients || "00"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center flex flex-col items-center">
          <FaBuilding className="text-green-500 text-4xl mb-2" />
          <h2 className="text-gray-600 text-sm uppercase">Billers</h2>
          <p className="text-3xl font-bold text-green-500">
            {data.billers || "00"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center flex flex-col items-center">
          <FaFileInvoice className="text-purple-500 text-4xl mb-2" />
          <h2 className="text-gray-600 text-sm uppercase">Invoices</h2>
          <p className="text-3xl font-bold text-purple-500">
            {data.invoices || "00"}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">📈 Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
