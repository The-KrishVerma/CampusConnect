const baseTemplate = ({title, body, actionText, actionUrl, code}) => {
    const appName = process.env.APP_NAME || 'CampusConnect';
    const logoText = appName;
    const preview = `${appName} security code`;
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#0f172a;font-family:Segoe UI, Arial, sans-serif;color:#e2e8f0;">
    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;">${preview}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0f172a;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#0b1221;border-radius:20px;border:1px solid #1e293b;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg,#111827,#1f2937);">
                <div style="font-size:22px;font-weight:700;color:#ffffff;">${logoText}</div>
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin-top:6px;">Security</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 12px;font-size:24px;color:#ffffff;">${title}</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#cbd5f5;">${body}</p>
                <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:20px;text-align:center;margin-bottom:20px;">
                  <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;">Your code</div>
                  <div style="font-size:36px;font-weight:700;letter-spacing:6px;color:#38bdf8;margin-top:6px;">${code}</div>
                </div>
                ${actionUrl ? `
                <div style="text-align:center;margin-bottom:18px;">
                  <a href="${actionUrl}" style="display:inline-block;background:#ef4444;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;">${actionText}</a>
                </div>` : ''}
                <p style="margin:0;font-size:13px;color:#94a3b8;">If you didn’t request this, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#0b1221;border-top:1px solid #1e293b;text-align:center;font-size:12px;color:#64748b;">
                © ${new Date().getFullYear()} ${appName}. Crafted for bold creators.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const verificationEmail = ({name, code}) => {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    return baseTemplate({
        title: `Verify your ${process.env.APP_NAME || 'CampusConnect'} account`,
        body: `Hi ${name || 'there'}, use the code below to verify your email. It expires in 10 minutes.`,
        actionText: 'Verify Email',
        actionUrl: `${appUrl}/verify-email`,
        code,
    });
};

export const resetPasswordEmail = ({name, code}) => {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    return baseTemplate({
        title: 'Reset your password',
        body: `Hi ${name || 'there'}, we received a request to reset your password. Use the code below within 10 minutes.`,
        actionText: 'Reset Password',
        actionUrl: `${appUrl}/reset-password`,
        code,
    });
};
