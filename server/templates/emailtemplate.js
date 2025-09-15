 
const otpTemplate = (name, otp, expireMinutes = 5) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hello ${name},</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This OTP will expire in ${expireMinutes} minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr />
      <p style="font-size: 12px; color: #999;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;
};

const invoiceEmailTemplate = (clientName, invoiceNumber, totalAmount) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hello ${clientName},</h2>
      <p>Please find attached your invoice <strong>#${invoiceNumber}</strong>.</p>
      <p>Total Amount Due: <strong style="color:#007bff;">₹${totalAmount}</strong></p>
      <p>We appreciate your business and prompt payment.</p>
      <hr />
      <p style="font-size: 12px; color: #999;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;
};

 
module.exports = { otpTemplate,invoiceEmailTemplate };
