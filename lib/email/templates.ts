export function emailShell(title: string, body: string) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f7f1ea; padding:32px;">
      <div style="max-width:600px; margin:0 auto; background:#fffaf5; border:1px solid #dfd2c4; border-radius:16px; overflow:hidden;">
        <div style="padding:28px 28px 8px;">
          <div style="font-size:13px; letter-spacing:0.08em; text-transform:uppercase; color:#8a6b53;">Stayro</div>
          <h1 style="margin:12px 0 0; font-size:28px; line-height:1.15; color:#20160f;">${title}</h1>
        </div>
        <div style="padding:24px 28px 32px; color:#46372b; font-size:16px; line-height:1.6;">
          ${body}
        </div>
      </div>
    </div>
  `;
}

export function bookingReceivedGuestEmail(propertyName: string) {
  return emailShell(
    "Your request is in",
    `<p>Thanks for requesting a stay at <strong>${propertyName}</strong>. The host has received your dates and will reply soon.</p>`,
  );
}

export function bookingReceivedHostEmail(propertyName: string, guestName: string) {
  return emailShell(
    "New booking request",
    `<p>${guestName} submitted a new booking request for <strong>${propertyName}</strong>. Review it from your Stayro inbox.</p>`,
  );
}

export function bookingApprovedEmail(propertyName: string) {
  return emailShell(
    "Your stay was approved",
    `<p>Your request for <strong>${propertyName}</strong> has been approved. The host will follow up with next steps.</p>`,
  );
}

export function bookingDeclinedEmail(propertyName: string) {
  return emailShell(
    "Update on your request",
    `<p>Your recent request for <strong>${propertyName}</strong> was declined. You can reply to the host to explore alternate dates.</p>`,
  );
}

export function publishSuccessEmail(propertyName: string, link: string) {
  return emailShell(
    "Your site is live",
    `<p>${propertyName} is now live. View your published site here: <a href="${link}">${link}</a>.</p>`,
  );
}

export function billingUpgradeEmail() {
  return emailShell(
    "Stayro Pro is active",
    "<p>Your Stayro Pro plan is active. You can now connect a custom domain, remove the Stayro badge, and manage booking approvals from one place.</p>",
  );
}

export function welcomeEmail(name: string) {
  return emailShell(
    "Welcome to Stayro",
    `<p>Hi ${name},</p><p>You can now generate a direct-booking site for your rental, publish it to a Stayro subdomain, and manage booking requests in one calm workspace.</p>`,
  );
}
