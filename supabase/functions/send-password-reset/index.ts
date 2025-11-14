import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    console.log(`Sending password reset email to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Budget Tracker <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Budget Tracker",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #2563eb;
                margin-bottom: 20px;
                font-size: 28px;
              }
              p {
                margin-bottom: 16px;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                padding: 14px 32px;
                background-color: #2563eb;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 24px 0;
                text-align: center;
              }
              .button:hover {
                background-color: #1d4ed8;
              }
              .footer {
                margin-top: 32px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔐 Reset Your Password</h1>
              
              <p>Hi there!</p>
              
              <p>We received a request to reset the password for your Budget Tracker account. Don't worry - we're here to help!</p>
              
              <p>Click the button below to create a new password:</p>
              
              <a href="${resetLink}" class="button">Reset My Password</a>
              
              <div class="warning">
                <strong>⚠️ Security Note:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, you can safely ignore this email.
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>
              
              <div class="footer">
                <p>Need help? We're always here for you!</p>
                <p>Best regards,<br>The Budget Tracker Team 💙</p>
                <p style="margin-top: 20px; font-size: 12px;">
                  If you have any questions or concerns, please don't hesitate to reach out to us.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
