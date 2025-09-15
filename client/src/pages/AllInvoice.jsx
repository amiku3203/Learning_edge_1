import React, { useEffect, useState } from "react";
import { FaDownload, FaEnvelope } from "react-icons/fa";
import api from "../api";
import { toast } from "react-hot-toast";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]); // ✅ initialize as array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await api.get("/invoice");
        console.log("INVOUCE_DATA", data);
        // If backend returns { invoices: [...] }
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const downloadInvoice = async (id) => {
    try {
      const response = await api.get(`/generate-pdf/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    }
  };

  const sendInvoiceEmail = async (id) => {
    try {
      await api.post(`/send-invoice-email/${id}`);
      toast.success("Invoice sent to email!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send invoice");
    }
  };

  if (loading) return <p className="text-center">Loading invoices...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📑 All Invoices</h1>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Invoice #</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{invoice.invoiceNumber}</td>
                <td className="p-3">{invoice.client?.companyName}</td>
                <td className="p-3">₹{invoice.totalAmount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="p-3 flex justify-center space-x-4">
                  <button
                    onClick={() => downloadInvoice(invoice._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaDownload size={18} />
                  </button>
                  <button
                    onClick={() => sendInvoiceEmail(invoice._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEnvelope size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllInvoices;
