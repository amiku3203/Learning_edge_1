
import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api";
import html2pdf from "html2pdf.js";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";

// ================= Currency Symbol =================
const currency = "₹";

// ================= HTML Template =================
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            padding: 20px;
        }
        
        .invoice-container {
            max-width: 1000px; /* Increased from 800px to accommodate wider content */
            margin: 0 auto;
            background: white;
            padding: 30px;
            border: 1px solid #ddd;
        }
        
        .invoice-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #007bff;
            padding-bottom: 15px;
        }
        
        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 8px;
        }
        
        .invoice-number {
            font-size: 14px;
            color: #666;
        }
        
        .parties-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            gap: 30px;
        }
        
        .party-info {
            flex: 1;
        }
        
        .party-title {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 8px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 3px;
        }
        
        .party-details {
            line-height: 1.6;
        }
        
        .party-details div {
            margin-bottom: 3px;
        }
        
        .invoice-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            padding: 12px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        
        .meta-item {
            text-align: center;
        }
        
        .meta-label {
            font-weight: bold;
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .meta-value {
            font-size: 14px;
            color: #333;
            margin-top: 3px;
        }
        
        .status {
            padding: 4px 12px;
            border-radius: 15px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }
        
        .status.draft {
            background-color: #ffc107;
            color: #856404;
        }
        
        .status.sent {
            background-color: #17a2b8;
            color: #0c5460;
        }
        
        .status.paid {
            background-color: #28a745;
            color: #155724;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        
        .items-table th {
            background-color: #007bff;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        
        .items-table th:nth-child(1) { width: 45%; }
        .items-table th:nth-child(2) { width: 15%; text-align: center; }
        .items-table th:nth-child(3) { width: 20%; text-align: right; }
        .items-table th:nth-child(4) { width: 20%; text-align: right; }
        
        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        
        .items-table tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        .items-table tbody tr:last-child td {
            border-bottom: 2px solid #007bff;
        }
        
        .item-description {
            font-weight: 500;
            color: #333;
        }
        
        .item-quantity {
            text-align: center;
            font-weight: bold;
        }
        
        .item-price, .item-total {
            text-align: right;
            font-weight: bold;
            color: #333;
        }
        
        .totals-section {
            margin-left: auto;
            width: 280px;
            margin-top: 15px;
        }
        
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .totals-row.subtotal {
            font-size: 14px;
        }
        
        .totals-row.tax {
            font-size: 14px;
            color: #666;
        }
        
        .totals-row.total {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
            border-bottom: 3px solid #007bff;
            border-top: 2px solid #007bff;
            padding: 12px 0;
            margin-top: 8px;
        }
        
        .currency {
            font-weight: bold;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 11px;
        }
        
        .thank-you {
            font-size: 16px;
            color: #007bff;
            font-weight: bold;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#{{invoiceNumber}}</div>
        </div>
        
        <!-- Parties Information -->
        <div class="parties-section">
            <div class="party-info">
                <div class="party-title">Bill From</div>
                <div class="party-details">
                    <div><strong>{{biller.companyName}}</strong></div>
                    <div>{{biller.email}}</div>
                    <div>{{biller.phone}}</div>
                    <div>{{biller.address}}</div>
                </div>
            </div>
            
            <div class="party-info">
                <div class="party-title">Bill To</div>
                <div class="party-details">
                    <div><strong>{{client.companyName}}</strong></div>
                    <div>{{client.email}}</div>
                    <div>{{client.phone}}</div>
                    <div>{{client.address}}</div>
                </div>
            </div>
        </div>
        
        <!-- Invoice Meta Information -->
        <div class="invoice-meta">
            <div class="meta-item">
                <div class="meta-label">Invoice Date</div>
                <div class="meta-value">{{invoiceDate}}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Due Date</div>
                <div class="meta-value">{{dueDate}}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Status</div>
                <div class="meta-value">
                    <span class="status {{status}}">{{status}}</span>
                </div>
            </div>
        </div>
        
        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {{itemsHTML}}
            </tbody>
        </table>
        
        <!-- Totals Section -->
        <div class="totals-section">
            <div class="totals-row subtotal">
                <span>Subtotal:</span>
                <span><span class="currency">₹</span>{{subtotal}}</span>
            </div>
            <div class="totals-row tax">
                <span>GST ({{taxRate}}%):</span>
                <span><span class="currency">₹</span>{{tax}}</span>
            </div>
            <div class="totals-row total">
                <span>Total Amount:</span>
                <span><span class="currency">₹</span>{{totalAmount}}</span>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="thank-you">Thank you for your business!</div>
            <div>This is a computer-generated invoice.</div>
        </div>
    </div>
</body>
</html>`;

// ================= HTML Generator Function =================
const generateInvoiceHTML = (data, client, biller) => {
  let html = htmlTemplate;
  
  // Generate current date for invoice
  const currentDate = new Date().toLocaleDateString();
  
  // Replace placeholders
  const replacements = {
    '{{invoiceNumber}}': `INV-${Date.now()}`,
    '{{invoiceDate}}': currentDate,
    '{{dueDate}}': data?.dueDate || 'Not specified',
    '{{status}}': data?.status || 'draft',
    '{{biller.companyName}}': biller?.companyName || 'Your Company',
    '{{biller.email}}': biller?.email || 'email@company.com',
    '{{biller.phone}}': biller?.phone || 'Phone not provided',
    '{{biller.address}}': biller?.address || 'Address not provided',
    '{{client.companyName}}': client?.companyName || 'Client Company',
    '{{client.email}}': client?.email || 'client@company.com',
    '{{client.phone}}': client?.phone || 'Phone not provided',
    '{{client.address}}': client?.address || 'Address not provided',
    '{{subtotal}}': (data?.subtotal || 0).toFixed(2),
    '{{taxRate}}': data?.taxRate || 0,
    '{{tax}}': (data?.tax || 0).toFixed(2),
    '{{totalAmount}}': (data?.totalAmount || 0).toFixed(2)
  };
  
  // Replace simple placeholders
  Object.keys(replacements).forEach(key => {
    html = html.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacements[key]);
  });
  
  // Generate items HTML
  let itemsHTML = '';
  if (data?.items && Array.isArray(data.items)) {
    data.items.forEach(item => {
      if (item.description || item.quantity || item.price) {
        itemsHTML += `
          <tr>
            <td class="item-description">${item.description || 'No description'}</td>
            <td class="item-quantity">${item.quantity || 0}</td>
            <td class="item-price"><span class="currency">₹</span>${parseFloat(item.price || 0).toFixed(2)}</td>
            <td class="item-total"><span class="currency">₹</span>${parseFloat(item.total || 0).toFixed(2)}</td>
          </tr>
        `;
      }
    });
  }
  
  if (!itemsHTML) {
    itemsHTML = `
      <tr>
        <td class="item-description">No items added</td>
        <td class="item-quantity">0</td>
        <td class="item-price"><span class="currency">₹</span>0.00</td>
        <td class="item-total"><span class="currency">₹</span>0.00</td>
      </tr>
    `;
  }
  
  html = html.replace('{{itemsHTML}}', itemsHTML);
  
  return html;
};

// ================= Main Component =================
const CreateInvoice = () => {
  const { register, control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      items: [{ description: "", quantity: 1, price: 0, total: 0 }],
      tax: 0,
      dueDate: "",
      status: "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [clients, setClients] = useState([]);
  const [billers, setBillers] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedBiller, setSelectedBiller] = useState(null);

  // Watch individual fields for real-time updates
  const watchItems = watch("items");
  const watchTax = watch("tax");

  // Calculate item totals immediately when quantity or price changes
  useEffect(() => {
    if (watchItems && Array.isArray(watchItems)) {
      watchItems.forEach((item, index) => {
        const quantity = parseFloat(item?.quantity) || 0;
        const price = parseFloat(item?.price) || 0;
        const total = quantity * price;
        const currentTotal = parseFloat(item?.total) || 0;
        
        // Only update if there's a significant difference
        if (Math.abs(total - currentTotal) > 0.001) {
          setValue(`items.${index}.total`, parseFloat(total.toFixed(2)), {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false
          });
        }
      });
    }
  }, [watchItems, setValue]);

  // Watch for changes in individual item fields for immediate updates
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && (name.includes('.quantity') || name.includes('.price'))) {
        const match = name.match(/items\.(\d+)\.(quantity|price)/);
        if (match) {
          const index = parseInt(match[1]);
          const currentItems = value.items || [];
          const item = currentItems[index];
          
          if (item) {
            const quantity = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const total = quantity * price;
            
            // Update the total with a small delay to ensure the UI updates
            setTimeout(() => {
              setValue(`items.${index}.total`, parseFloat(total.toFixed(2)), {
                shouldValidate: false,
                shouldDirty: false,
                shouldTouch: false
              });
            }, 10);
          }
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Calculate totals dynamically
  const subtotal = watchItems?.reduce((acc, item) => acc + (Number(item.total) || 0), 0) || 0;
  const taxRate = Number(watchTax || 0);
  const tax = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + tax;

  // Generate HTML preview with memoization for performance
  const htmlPreview = useMemo(() => {
    const invoiceData = {
      items: watchItems,
      subtotal,
      taxRate,
      tax,
      totalAmount,
      dueDate: watch("dueDate"),
      status: watch("status")
    };
    return generateInvoiceHTML(invoiceData, selectedClient, selectedBiller);
  }, [watchItems, subtotal, taxRate, tax, totalAmount, watch("dueDate"), watch("status"), selectedClient, selectedBiller]);

  // Fetch clients and billers
  useEffect(() => {
    (async () => {
      try {
        const [c, b] = await Promise.all([api.get("/clients"), api.get("/billers")]);
        console.log("Clients:", c.data, "Billers:", b.data);
        setClients(c.data);
        setBillers(b.data);
      } catch (err) {
        console.error("API error:", err);
        toast.error("Error loading clients or billers");
      }
    })();
  }, []);

  // Generate PDF from HTML using html2pdf.js library
  const generatePDFFromHTML = async (htmlContent, filename = "invoice.pdf") => {
    try {
      // Parse HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const invoiceContainer = doc.querySelector('.invoice-container');
      
      if (!invoiceContainer) {
        console.error('Invoice container not found in HTML:', htmlContent);
        throw new Error('Invoice container not found in HTML');
      }

      console.log('Parsed HTML:', invoiceContainer.outerHTML); // Debug: Log parsed HTML

      // Create temporary div
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = invoiceContainer.outerHTML;
      tempDiv.style.width = '1000px'; // Increased from 800px to prevent content clipping
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.position = 'relative'; // Ensure visibility
      document.body.appendChild(tempDiv);

      // Add all styles from htmlTemplate
      const styleElement = document.createElement('style');
      styleElement.textContent = htmlTemplate.match(/<style>([\s\S]*?)<\/style>/)[1];
      tempDiv.appendChild(styleElement);

      // Wait for fonts and rendering
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Configure html2pdf options
      const options = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: tempDiv.scrollWidth, // Use dynamic width
          windowHeight: tempDiv.scrollHeight // Use dynamic height
        },
        jsPDF: { 
          unit: 'mm', 
          format: [297, 420], // Custom format for wider content (equivalent to A3 portrait)
          orientation: 'portrait' 
        }
      };

      // Generate and download PDF
      await html2pdf()
        .set(options)
        .from(tempDiv)
        .save();

      // Clean up
      document.body.removeChild(tempDiv);
      toast.success(`${filename} downloaded successfully!`);
    } catch (error) {
      console.error("PDF generation error:", error);
      console.log("HTML Content:", htmlContent.substring(0, 500));
      toast.error("Error generating PDF. Please try again.");
    }
  };

  // Submit & auto-download PDF
  const onSubmit = async (data) => {
    if (!selectedClient || !selectedBiller) {
      toast.error("Please select both client and biller");
      return;
    }

    if (!watchItems || watchItems.length === 0 || watchItems.every(item => !item.description && !item.quantity && !item.price)) {
      toast.error("Please add at least one valid item");
      return;
    }

    const payload = {
      ...data,
      client: selectedClient,
      biller: selectedBiller,
      subtotal: subtotal.toFixed(2),
      taxRate,
      tax: tax.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };

    try {
      // Save invoice data to backend (API call only for data saving)
      const response = await api.post("/invoice", payload);
      
      // Get invoice number from backend response
      const invoiceNumber = response.data?.invoiceNumber || response.data?.id || `INV-${Date.now()}`;
      
      toast.success(`Invoice ${invoiceNumber} saved to database successfully!`);

      // Generate PDF using frontend library (html2pdf.js)
      // Update the HTML with the actual invoice number from backend
      let finalHtmlContent = htmlPreview.replace(
        /INV-\d+/g, 
        invoiceNumber
      );
      
      // Automatically download PDF with invoice number as filename using html2pdf.js
      await generatePDFFromHTML(finalHtmlContent, `${invoiceNumber}.pdf`);

      // Reset form after successful creation and download
      reset({
        items: [{ description: "", quantity: 1, price: 0, total: 0 }],
        tax: 0,
        dueDate: "",
        status: "draft",
      });
      setSelectedClient(null);
      setSelectedBiller(null);
      
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Error creating invoice");
    }
  };

  // Remove item function
  const handleRemove = (index) => {
    console.log("Remove button clicked:", { index, fieldsLength: fields.length, fields });
    
    if (fields.length > 1) {
      try {
        remove(index);
        toast.success("Item removed successfully");
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
      }
    } else {
      toast.error("Cannot remove the last item");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>🧾 Create Invoice</h1>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <select
            value={selectedBiller?._id || ""}
            onChange={(e) => setSelectedBiller(billers.find((b) => b._id === e.target.value) || null)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select Biller</option>
            {billers.map((b) => (
              <option key={b._id} value={b._id}>{b.companyName}</option>
            ))}
          </select>
          {errors.biller && <span style={{ color: "red" }}>Biller is required</span>}

          <select
            value={selectedClient?._id || ""}
            onChange={(e) => setSelectedClient(clients.find((c) => c._id === e.target.value) || null)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>{c.companyName}</option>
            ))}
          </select>
          {errors.client && <span style={{ color: "red" }}>Client is required</span>}

          <input
            type="date"
            {...register("dueDate")}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <select
            {...register("status")}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>

          <div>
            <h2 style={{ fontWeight: "bold", marginBottom: "6px" }}>Items</h2>
            {fields.map((field, index) => (
              <div
                key={field.id}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "10px", alignItems: "center", marginBottom: "6px" }}
              >
                <input
                  {...register(`items.${index}.description`, { required: "Description is required" })}
                  placeholder="Description"
                  style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                {errors.items?.[index]?.description && (
                  <span style={{ color: "red", gridColumn: "1 / -1" }}>{errors.items[index].description.message}</span>
                )}

                <input
                  type="number"
                  step="1"
                  {...register(`items.${index}.quantity`, { 
                    valueAsNumber: true, 
                    min: { value: 0, message: "Quantity cannot be negative" },
                    onChange: (e) => {
                      const quantity = parseFloat(e.target.value) || 0;
                      const price = parseFloat(watchItems[index]?.price) || 0;
                      const total = quantity * price;
                      setValue(`items.${index}.total`, parseFloat(total.toFixed(2)));
                    }
                  })}
                  style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                {errors.items?.[index]?.quantity && (
                  <span style={{ color: "red", gridColumn: "1 / -1" }}>{errors.items[index].quantity.message}</span>
                )}

                <input
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.price`, { 
                    valueAsNumber: true, 
                    min: { value: 0, message: "Price cannot be negative" },
                    onChange: (e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const quantity = parseFloat(watchItems[index]?.quantity) || 0;
                      const total = quantity * price;
                      setValue(`items.${index}.total`, parseFloat(total.toFixed(2)));
                    }
                  })}
                  style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                {errors.items?.[index]?.price && (
                  <span style={{ color: "red", gridColumn: "1 / -1" }}>{errors.items[index].price.message}</span>
                )}

                <input
                  value={`₹${(watchItems[index]?.total || 0).toFixed(2)}`}
                  readOnly
                  style={{ 
                    padding: "6px", 
                    borderRadius: "6px", 
                    background: "#e8f5e8", 
                    border: "1px solid #28a745",
                    fontWeight: "bold",
                    color: "#155724",
                    textAlign: "right"
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={fields.length <= 1}
                  style={{
                    color: fields.length <= 1 ? "#ccc" : "#dc3545",
                    padding: "8px",
                    border: "1px solid",
                    borderColor: fields.length <= 1 ? "#ccc" : "#dc3545",
                    background: fields.length <= 1 ? "#f8f9fa" : "transparent",
                    borderRadius: "4px",
                    cursor: fields.length <= 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "32px",
                    minHeight: "32px"
                  }}
                  title={fields.length <= 1 ? "Cannot remove the last item" : "Remove item"}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ description: "", quantity: 1, price: 0, total: 0 })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "6px",
                marginTop: "8px",
              }}
            >
              <FaPlus /> Add Item
            </button>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal:</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>GST (%):</span>
              <input
                type="number"
                step="0.01"
                {...register("tax", { valueAsNumber: true, min: { value: 0, message: "Tax rate cannot be negative" } })}
                style={{ width: "60px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              {errors.tax && <span style={{ color: "red" }}>{errors.tax.message}</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>GST Value:</span>
              <span>{currency}{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>Total:</span>
              <span>{currency}{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            style={{ background: "black", color: "white", padding: "10px", borderRadius: "6px" }}
          >
            Create Invoice
          </button>
        </form>
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", marginTop: "20px" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>📄 Invoice Preview</h2>
        <div 
          style={{ 
            height: "600px", 
            border: "1px solid #ccc", 
            borderRadius: "6px",
            overflow: "auto",
            backgroundColor: "#f8f9fa"
          }}
        >
          <iframe
            srcDoc={htmlPreview}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "6px"
            }}
            title="Invoice Preview"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateInvoice;
  