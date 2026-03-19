import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type ContactNotification = {
  email: string;
  inquiryType: string;
  message: string;
};

export async function sendContactNotification(
  to: string,
  inquiry: ContactNotification
): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Gmail credentials not configured. Skipping email notification.");
    return;
  }

  await transporter.sendMail({
    from: `"VTuber Expo お問い合わせ" <${process.env.GMAIL_USER}>`,
    to,
    subject: `【VTuber Expo】新しいお問い合わせ: ${inquiry.inquiryType}`,
    text: [
      "VTuber Expo のお問い合わせフォームから新しいメッセージが届きました。",
      "",
      `■ 種別: ${inquiry.inquiryType}`,
      `■ 送信者: ${inquiry.email}`,
      "",
      "■ 内容:",
      inquiry.message,
      "",
      "---",
      "このメールは自動送信されています。",
      "管理画面からも確認できます。",
    ].join("\n"),
  });
}
