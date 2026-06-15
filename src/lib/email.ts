import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'Beb Fragrance <noreply@bebfragrance.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bebfragrance.com';

export interface OrderDetailItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

export interface OrderEmailDetails {
  orderNumber: string;
  items: OrderDetailItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function buildEmailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beb Fragrance</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fdf2f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(168, 85, 247, 0.15);">
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #f59e0b 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px; font-family: Georgia, serif;">
                BEB FRAGRANCE
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 13px; letter-spacing: 1px;">
                Premium Parfyumeriya
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color: #faf5ff; padding: 24px 40px; text-align: center; border-top: 1px solid #e9d5ff;">
              <p style="margin: 0 0 8px; color: #6b21a8; font-size: 13px;">
                © ${new Date().getFullYear()} Beb Fragrance. Barcha huquqlar himoyalangan.
              </p>
              <p style="margin: 0; color: #9333ea; font-size: 12px;">
                <a href="https://bebfragrance.com" style="color: #9333ea; text-decoration: none;">bebfragrance.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildOrderItemsTable(items: OrderDetailItem[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f3e8ff; color: #374151; font-size: 14px;">
          ${item.name}${item.size ? ` <span style="color: #9333ea;">(${item.size})</span>` : ''}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f3e8ff; color: #374151; font-size: 14px; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f3e8ff; color: #374151; font-size: 14px; text-align: right;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <th style="padding: 8px 0; border-bottom: 2px solid #a855f7; color: #581c87; font-size: 12px; text-align: left; text-transform: uppercase; letter-spacing: 1px;">Mahsulot</th>
        <th style="padding: 8px 0; border-bottom: 2px solid #a855f7; color: #581c87; font-size: 12px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Soni</th>
        <th style="padding: 8px 0; border-bottom: 2px solid #a855f7; color: #581c87; font-size: 12px; text-align: right; text-transform: uppercase; letter-spacing: 1px;">Narx</th>
      </tr>
      ${rows}
    </table>`;
}

export async function sendOrderConfirmation(
  orderId: string,
  customerEmail: string,
  customerName: string,
  orderDetails: OrderEmailDetails,
  total: number
): Promise<void> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY is not configured. Skipping order confirmation email.');
    return;
  }

  const content = `
    <h2 style="margin: 0 0 8px; color: #831843; font-size: 22px; font-family: Georgia, serif;">
      Buyurtmangiz qabul qilindi!
    </h2>
    <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Assalomu alaykum, <strong style="color: #831843;">${customerName}</strong>! Buyurtmangiz uchun rahmat. 
      Biz sizning buyurtmangizni qayta ishlayapmiz.
    </p>
    <div style="background-color: #fdf2f8; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0; color: #9d174d; font-size: 13px;">
        <strong>Buyurtma raqami:</strong> ${orderDetails.orderNumber}
      </p>
      <p style="margin: 4px 0 0; color: #9d174d; font-size: 13px;">
        <strong>Buyurtma ID:</strong> ${orderId}
      </p>
    </div>
    ${buildOrderItemsTable(orderDetails.items)}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Oraliq summa</td>
        <td style="padding: 4px 0; color: #374151; font-size: 14px; text-align: right;">${formatCurrency(orderDetails.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Yetkazib berish</td>
        <td style="padding: 4px 0; color: #374151; font-size: 14px; text-align: right;">${formatCurrency(orderDetails.shippingCost)}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Soliq</td>
        <td style="padding: 4px 0; color: #374151; font-size: 14px; text-align: right;">${formatCurrency(orderDetails.tax)}</td>
      </tr>
      ${
        orderDetails.discount > 0
          ? `<tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Chegirma</td>
        <td style="padding: 4px 0; color: #059669; font-size: 14px; text-align: right;">-${formatCurrency(orderDetails.discount)}</td>
      </tr>`
          : ''
      }
      <tr>
        <td style="padding: 12px 0 0; color: #581c87; font-size: 16px; font-weight: 700; border-top: 2px solid #a855f7;">Jami</td>
        <td style="padding: 12px 0 0; color: #581c87; font-size: 16px; font-weight: 700; text-align: right; border-top: 2px solid #a855f7;">${formatCurrency(total)}</td>
      </tr>
    </table>
    <p style="margin: 32px 0 0; color: #6b7280; font-size: 13px; line-height: 1.6; text-align: center;">
      Savollaringiz bo'lsa, biz bilan bog'laning. Sizni yana kutib qolamiz!
    </p>`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Buyurtma tasdiqlandi — ${orderDetails.orderNumber} | Beb Fragrance`,
    html: buildEmailLayout(content),
  });

  if (error) {
    throw new Error(`Failed to send order confirmation email: ${error.message}`);
  }
}

export async function sendAdminNotification(
  orderId: string,
  customerName: string,
  total: number
): Promise<void> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY is not configured. Skipping admin notification email.');
    return;
  }

  const content = `
    <h2 style="margin: 0 0 8px; color: #581c87; font-size: 22px; font-family: Georgia, serif;">
      Yangi buyurtma keldi!
    </h2>
    <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Yangi buyurtma tizimga qo'shildi. Iltimos, admin panel orqali ko'rib chiqing.
    </p>
    <div style="background-color: #faf5ff; border-radius: 8px; padding: 20px; border-left: 4px solid #a855f7;">
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong style="color: #581c87;">Buyurtma ID:</strong> ${orderId}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong style="color: #581c87;">Mijoz:</strong> ${customerName}
      </p>
      <p style="margin: 0; color: #374151; font-size: 14px;">
        <strong style="color: #581c87;">Jami summa:</strong> 
        <span style="color: #d97706; font-size: 18px; font-weight: 700;">${formatCurrency(total)}</span>
      </p>
    </div>
    <p style="margin: 24px 0 0; text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders/${orderId}" 
         style="display: inline-block; background: linear-gradient(135deg, #ec4899, #a855f7); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 600;">
        Buyurtmani ko'rish
      </a>
    </p>`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Yangi buyurtma: ${customerName} — ${formatCurrency(total)}`,
    html: buildEmailLayout(content),
  });

  if (error) {
    throw new Error(`Failed to send admin notification email: ${error.message}`);
  }
}
