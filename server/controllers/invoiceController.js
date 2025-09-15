// controllers/invoiceController.js
const Invoice = require("../models/Invoice");
const User = require("../models/User");

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { invoiceEmailTemplate } = require("../templates/emailtemplate");
const sendMail = require("../services/emailService");

// Load HTML template
const templatePath = path.join(
  process.cwd(),
  "templates",
  "invoice-template.html"
);
const invoiceTemplate = fs.readFileSync(templatePath, "utf-8");
exports.createInvoice = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user.isSubscribed) {
      const invoiceCount = await Invoice.countDocuments({ user: userId });
      if (invoiceCount >= 5) {
        return res.status(403).json({
          message: "Free tier limit reached. Please upgrade your plan.",
        });
      }
    }

    const invoice = new Invoice({
      user: userId,
      ...req.body,
    });

    await invoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating invoice", error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).populate(
      "client biller"
    );

    console.log(JSON.stringify(invoices[0], null, 2));

    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice updated", invoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating invoice", error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting invoice", error: error.message });
  }
};

exports.generateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch invoice with relations
    const invoice = await Invoice.findById(id)
      .populate("client")
      .populate("biller");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Generate dynamic items HTML
    const itemsHTML = invoice.items
      .map(
        (item) => `
          <tr>
            <td class="item-description">${item.description}</td>
            <td class="item-quantity">${item.quantity}</td>
            <td class="item-price">₹${item.price.toFixed(2)}</td>
            <td class="item-total">₹${item.total.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    // Replace placeholders in template
    const filledHTML = invoiceTemplate
      .replace(/{{invoiceNumber}}/g, invoice.invoiceNumber)
      .replace(/{{biller.companyName}}/g, invoice.biller.companyName)
      .replace(/{{biller.email}}/g, invoice.biller.email)
      .replace(/{{biller.phone}}/g, invoice.biller.phone)
      .replace(/{{biller.address}}/g, invoice.biller.address)
      .replace(/{{client.companyName}}/g, invoice.client.companyName)
      .replace(/{{client.email}}/g, invoice.client.email)
      .replace(/{{client.phone}}/g, invoice.client.phone)
      .replace(/{{client.address}}/g, invoice.client.address)
      .replace(/{{invoiceDate}}/g, invoice.createdAt.toDateString())
      .replace(/{{dueDate}}/g, invoice.dueDate?.toDateString() || "-")
      .replace(/{{status}}/g, invoice.status)
      .replace(/{{itemsHTML}}/g, itemsHTML)
      .replace(/{{subtotal}}/g, invoice.subtotal.toFixed(2))
      .replace(/{{taxRate}}/g, "18") // or save taxRate in DB
      .replace(/{{tax}}/g, invoice.tax.toFixed(2))
      .replace(/{{totalAmount}}/g, invoice.totalAmount.toFixed(2));

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new", // 👈 needed in latest versions
    });
    const page = await browser.newPage();
    await page.setContent(filledHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Set headers for file download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

exports.sendInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch invoice from MongoDB
    const invoice = await Invoice.findById(id).populate("client biller");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // 2. Load template
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "invoice-template.html"
    );
    let template = fs.readFileSync(templatePath, "utf-8");

    // 3. Replace placeholders
    template = template
      .replace(/{{invoiceNumber}}/g, invoice._id.toString())
       .replace(/{{biller.companyName}}/g, invoice.biller.companyName)
      .replace(/{{biller.name}}/g, invoice.biller?.name || "")
      .replace(/{{biller.email}}/g, invoice.biller?.email || "")
      .replace(/{{biller.phone}}/g, invoice.biller?.phone || "")
      .replace(/{{biller.address}}/g, invoice.biller?.address || "")
      .replace(/{{client.name}}/g, invoice.client?.name || "")
      .replace(/{{client.email}}/g, invoice.client?.email || "")
      .replace(/{{client.phone}}/g, invoice.client?.phone || "")
      .replace(/{{client.address}}/g, invoice.client?.address || "")
      .replace(/{{client.companyName}}/g, invoice.client.companyName)
      .replace(/{{invoiceDate}}/g, invoice.createdAt.toDateString())
      .replace(/{{dueDate}}/g, invoice.dueDate?.toDateString() || "")
      .replace(/{{status}}/g, invoice.status)
      .replace(/{{subtotal}}/g, invoice.subtotal.toFixed(2))
       .replace(/{{taxRate}}/g, "18") // or save taxRate in DB
      .replace(/{{tax}}/g, invoice.tax.toFixed(2))
      .replace(/{{totalAmount}}/g, invoice.totalAmount.toFixed(2));

    // Render items table
    const itemsHTML = invoice.items
      .map(
        (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${item.total.toFixed(2)}</td>
        </tr>`
      )
      .join("");

    template = template.replace("{{itemsHTML}}", itemsHTML);

    // 4. Generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // 5. Send Email with PDF attachment
    await sendMail({
      to: invoice.client.email,
      subject: `Invoice #${invoice._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h2>Hi ${invoice.client?.name || "Customer"},</h2>
          <p>Please find attached your invoice <b>#${invoice._id}</b>.</p>
          <p>Due Date: <b>${invoice.dueDate?.toDateString() || "N/A"}</b></p>
          <p>Status: <b>${invoice.status}</b></p>
          <p>Thank you for your business!</p>
          <hr/>
          <p style="font-size:12px;color:#888;">This is an automated message. Do not reply.</p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${invoice._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    res.json({ message: "Invoice email sent successfully!" });
  } catch (err) {
    console.error("Error sending invoice email:", err);
    res
      .status(500)
      .json({ message: "Error sending invoice email", error: err.message });
  }
};
