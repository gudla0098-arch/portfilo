const ALLOWED_ORIGIN = process.env.SITE_ORIGIN;

function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.json(payload);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const origin = req.headers.origin;
  if (ALLOWED_ORIGIN && origin && new URL(origin).origin !== new URL(ALLOWED_ORIGIN).origin) {
    return sendJson(res, 403, { error: "Request origin is not allowed." });
  }

  const { name, email, subject, message, website } = req.body || {};

  // Quietly accept bot submissions without forwarding them.
  if (website) return sendJson(res, 200, { success: true });

  const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
  const senderName = clean(name, 100);
  const senderEmail = clean(email, 254);
  const senderSubject = clean(subject, 160);
  const senderMessage = clean(message, 5000);

  if (!senderName || !senderSubject || !senderMessage ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    return sendJson(res, 400, { error: "Please provide a valid name, email, subject and message." });
  }

  if (!process.env.RESEND_API_KEY) {
    return sendJson(res, 503, { error: "The contact service is not configured yet. Please email me directly at gudla0098@gmail.com." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>",
        to: ["gudla0098@gmail.com"],
        reply_to: senderEmail,
        subject: `Portfolio enquiry: ${senderSubject}`,
        text: [
          "You received a new message from your portfolio contact form.",
          "",
          `Name: ${senderName}`,
          `Email: ${senderEmail}`,
          `Subject: ${senderSubject}`,
          "",
          "Message:",
          senderMessage
        ].join("\n")
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend delivery failed:", response.status, detail);
      return sendJson(res, 502, { error: "Your message could not be sent right now. Please try again or email me directly." });
    }

    return sendJson(res, 200, { success: true, message: "Thanks! Your message has been sent successfully." });
  } catch (error) {
    console.error("Contact API error:", error);
    return sendJson(res, 500, { error: "Something went wrong while sending your message. Please try again." });
  }
};
