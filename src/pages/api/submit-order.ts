import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface CartItem {
  name: string;
  selectedColor: string;
  quantity: number;
  price: number;
  sizeBreakdown: Array<{
    size: string;
    quantity: number;
  }>;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  notes?: string;
}

interface OrderData {
  cartItems: CartItem[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  notes?: string;
}

const saveFile = async (file: formidable.File | undefined): Promise<string | null> => {
  if (!file || !file.filepath) return null;
  
  try {
    const data = fs.readFileSync(file.filepath);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const fileName = `${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, data);
    fs.unlinkSync(file.filepath);
    
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
};

const sendOrderNotification = async (data: OrderData, logoFile: formidable.File | undefined): Promise<boolean> => {
  try {
    // Create a test account if you don't have real credentials
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || testAccount.user,
        pass: process.env.SMTP_PASS || testAccount.pass,
      },
    });

    const cartItemsHtml = data.cartItems
      .map((item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.selectedColor}</td>
          <td>${item.quantity}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
        ${item.sizeBreakdown.map((size) => `
          <tr>
            <td colspan="2"></td>
            <td>Size ${size.size}</td>
            <td>${size.quantity} units</td>
          </tr>
        `).join('')}
      `)
      .join('');

    const totalAmount = data.cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    // Prepare attachments if logo exists
    const attachments = [];
    if (logoFile?.filepath) {
      attachments.push({
        filename: logoFile.originalFilename || 'company-logo',
        content: fs.createReadStream(logoFile.filepath)
      });
    }

    // Send notification to admin
    const adminEmail = await transporter.sendMail({
      from: '"DirectPromo Orders" <orders@directpromo.com>',
      to: process.env.ADMIN_EMAIL || 'brandon.hoon.lee@gmail.com',
      subject: 'New Order Received - DirectPromo',
      html: `
        <h2>New Order Received</h2>
        
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        
        <h3>Order Details:</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${cartItemsHtml}
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
            <td><strong>$${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </table>
        
        <p><strong>Additional Notes:</strong> ${data.notes || 'None'}</p>
        ${logoFile ? '<p><strong>Logo:</strong> Attached to this email</p>' : ''}
        
        <p style="color: #666; font-style: italic;">This is an automated notification. Please review the order details in your admin dashboard.</p>
      `,
      attachments
    });

    // Send confirmation to customer
    const customerEmail = await transporter.sendMail({
      from: '"DirectPromo" <orders@directpromo.com>',
      to: data.email,
      subject: 'Order Confirmation - DirectPromo',
      html: `
        <h2>Thank you for your order!</h2>
        <p>We have received your order request and will contact you shortly with a detailed quote.</p>
        
        <h3>Order Summary:</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Quantity</th>
            <th>Estimated Price</th>
          </tr>
          ${cartItemsHtml}
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Estimated Total:</strong></td>
            <td><strong>$${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </table>
        
        <p><em>Note: Final pricing may vary based on customization options and quantity.</em></p>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>The DirectPromo Team</p>
      `,
      attachments
    });

    // Log test URLs if using Ethereal
    if (!process.env.SMTP_HOST) {
      console.log('Admin email preview URL:', nodemailer.getTestMessageUrl(adminEmail));
      console.log('Customer email preview URL:', nodemailer.getTestMessageUrl(customerEmail));
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize formidable with options
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxTotalFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Parse the form
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          if (err.code === 1009 || err.httpCode === 413) {
            // File too large
            return res.status(413).json({
              success: false,
              error: 'The uploaded file is too large. Please upload a file smaller than 10MB.'
            });
          }
          reject(err);
          return;
        }
        resolve([fields, files]);
      });
    });

    // Log the received fields for debugging
    console.log('Received fields:', fields);

    // Handle logo file if provided
    const logoFile = files.logo?.[0] || files.logo as formidable.File | undefined;

    // Parse the contact information
    let contactInfo: ContactInfo;
    try {
      contactInfo = JSON.parse(fields.contactInfo as string);
    } catch (error) {
      console.error('Error parsing contact info:', error);
      return res.status(400).json({ error: 'Invalid contact information' });
    }

    // Parse the order details (cart items)
    let orderDetails: CartItem[];
    try {
      orderDetails = JSON.parse(fields.orderDetails as string);
    } catch (error) {
      console.error('Error parsing order details:', error);
      return res.status(400).json({ error: 'Invalid order details' });
    }

    // Process the form data
    const name = contactInfo.name || '';
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');

    const orderData: OrderData = {
      firstName: contactInfo.firstName || firstName || '',
      lastName: contactInfo.lastName || lastName || '',
      email: contactInfo.email,
      phone: contactInfo.phone,
      company: contactInfo.company,
      notes: contactInfo.notes,
      cartItems: orderDetails
    };

    // Validate required fields
    if (!orderData.firstName || !orderData.email || !orderData.cartItems?.length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Send order notifications with the logo file
    await sendOrderNotification(orderData, logoFile);

    res.status(200).json({ 
      success: true, 
      message: 'Order submitted successfully' 
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process order'
    });
  }
} 