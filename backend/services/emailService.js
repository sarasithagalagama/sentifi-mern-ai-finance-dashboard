const nodemailer = require("nodemailer");

// Configure transporter
// FOR DEVELOPMENT: asking user to provide credentials via env vars later
// or using a ethereal test account if no env vars present
const createTransporter = async () => {
  // In production, use SendGrid, Mailgun, or Gmail OAuth
  // For this demo, we will check if ENV vars exist, otherwise mock it
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail", // or user configured host
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Fallback to Ethereal for testing (prints URL to console)
    const testAccount = await nodemailer.createTestAccount();
    console.log("Using Ethereal Mail for testing (no real email sent)");
    console.log("Creds:", testAccount.user, testAccount.pass);

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

const sendFinancialReport = async (user, data) => {
  try {
    const transporter = await createTransporter();

    const { totalIncome, totalExpenses, savings, aiAdvice } = data;
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #18181b; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #4ade80; margin: 0; font-size: 24px;">Sentifi Financial Report</h1>
          <p style="color: #a1a1aa; margin: 10px 0 0;">${date}</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #e4e4e7;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Here is your financial summary for this month.</p>
          
          <div style="display: flex; gap: 15px; margin: 25px 0;">
            <div style="flex: 1; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
              <div style="font-size: 12px; color: #15803d; text-transform: uppercase; font-weight: bold;">Income</div>
              <div style="font-size: 20px; color: #166534; font-weight: bold;">$${totalIncome.toLocaleString()}</div>
            </div>
            <div style="flex: 1; background: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
              <div style="font-size: 12px; color: #b91c1c; text-transform: uppercase; font-weight: bold;">Expenses</div>
              <div style="font-size: 20px; color: #991b1b; font-weight: bold;">$${totalExpenses.toLocaleString()}</div>
            </div>
             <div style="flex: 1; background: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe;">
              <div style="font-size: 12px; color: #1e40af; text-transform: uppercase; font-weight: bold;">Savings</div>
              <div style="font-size: 20px; color: #1e3a8a; font-weight: bold;">$${savings.toLocaleString()}</div>
            </div>
          </div>

          <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #27272a;">AI Financial Advice</h3>
            <p style="color: #52525b; line-height: 1.6; font-style: italic;">
              "${
                aiAdvice ||
                "Keep tracking your expenses to get personalized AI insights!"
              }"
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #71717a; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Sentifi Finance. All rights reserved.
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Sentifi AI" <details@sentifi.app>',
      to: user.email,
      subject: `Your Monthly Financial Report - ${date}`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    if (info.messageId && !process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Failed to send email report");
  }
};

module.exports = { sendFinancialReport };
