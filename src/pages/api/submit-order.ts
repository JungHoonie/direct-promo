import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
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
  name: string;
  firstName?: string;
  lastName?: string;
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

// Utility function to normalize form fields
function normalizeField(field: string | string[] | undefined): string | null {
  if (Array.isArray(field)) return field[0] ?? null;
  if (typeof field === 'string') return field;
  return null;
}

// Utility function to validate cart items
function validateCartItems(items: CartItem[]): string[] {
  const errors: string[] = [];
  
  if (!Array.isArray(items)) {
    return ['Cart items must be an array'];
  }

  items.forEach((item, index) => {
    if (!item.name) errors.push(`Item ${index + 1}: Name is required`);
    if (!item.selectedColor) errors.push(`Item ${index + 1}: Color is required`);
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Invalid quantity`);
    }
    if (typeof item.price !== 'number' || item.price < 0) {
      errors.push(`Item ${index + 1}: Invalid price`);
    }
    if (!Array.isArray(item.sizeBreakdown)) {
      errors.push(`Item ${index + 1}: Size breakdown must be an array`);
    } else {
      item.sizeBreakdown.forEach((size, sizeIndex) => {
        if (!size.size) errors.push(`Item ${index + 1}, Size ${sizeIndex + 1}: Size is required`);
        if (typeof size.quantity !== 'number' || size.quantity <= 0) {
          errors.push(`Item ${index + 1}, Size ${sizeIndex + 1}: Invalid quantity`);
        }
      });
    }
  });

  return errors;
}

// Utility function to sanitize input
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .replace(/["]/g, '&quot;') // Escape quotes
    .replace(/[']/g, '&#x27;'); // Escape single quotes
}

const sendOrderNotification = async (data: OrderData, logoFile: formidable.File | undefined): Promise<boolean> => {
  try {
    // Create a test account if you don&apos;t have real credentials
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

    // Sanitize data before using in email
    const sanitizedData = {
      ...data,
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      company: sanitizeInput(data.company),
      notes: data.notes ? sanitizeInput(data.notes) : undefined,
    };

    const cartItemsHtml = sanitizedData.cartItems
      .map((item) => `
        <tr>
          <td>${sanitizeInput(item.name)}</td>
          <td>${sanitizeInput(item.selectedColor)}</td>
          <td>${item.quantity}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
        ${item.sizeBreakdown.map((size) => `
          <tr>
            <td colspan="2"></td>
            <td>Size ${sanitizeInput(size.size)}</td>
            <td>${size.quantity} units</td>
          </tr>
        `).join('')}
      `)
      .join('');

    const totalAmount = sanitizedData.cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    // Prepare attachments if logo exists
    const attachments = [];
    if (logoFile?.filepath) {
      try {
        // Verify file exists and is readable
        await fs.promises.access(logoFile.filepath, fs.constants.R_OK);
        attachments.push({
          filename: sanitizeInput(logoFile.originalFilename || 'company-logo'),
          content: fs.createReadStream(logoFile.filepath)
        });
      } catch (error) {
        console.error('Error accessing logo file:', error);
        // Continue without the logo if there's an error
      }
    }

    // Send notification to admin
    const adminEmail = await transporter.sendMail({
      from: '"DirectPromo Orders" <orders@directpromo.com>',
      to: 'directpromo@rogers.com',
      subject: 'New Order Received - DirectPromo',
      html: `
        <h2>New Order Received</h2>
        
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${sanitizedData.firstName} ${sanitizedData.lastName}</p>
        <p><strong>Email:</strong> ${sanitizedData.email}</p>
        <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
        <p><strong>Company:</strong> ${sanitizedData.company}</p>
        
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
        
        <p><strong>Additional Notes:</strong> ${sanitizedData.notes || 'None'}</p>
        ${logoFile ? '<p><strong>Logo:</strong> Attached to this email</p>' : ''}
        
        <p style="color: #666; font-style: italic;">This is an automated notification. Please review the order details in your admin dashboard.</p>
      `,
      attachments
    });

    // Send confirmation to customer
    const customerEmail = await transporter.sendMail({
      from: '"DirectPromo" <orders@directpromo.com>',
      to: sanitizedData.email,
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
        
        <p>If you have any questions, please don&apos;t hesitate to contact us.</p>
        
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
      filter: ({ mimetype }) => {
        // Only allow image files
        return mimetype?.startsWith('image/') ?? false;
      }
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
      const rawContact = normalizeField(fields.contactInfo);
      if (!rawContact) {
        return res.status(400).json({ error: 'Missing or invalid contact information' });
      }

      contactInfo = JSON.parse(rawContact);
    } catch (error) {
      console.error('Error parsing contact info:', error);
      return res.status(400).json({ error: 'Invalid contact information' });
    }

    // Parse the order details (cart items)
    let orderDetails: CartItem[];
    try {
      const rawOrder = normalizeField(fields.orderDetails);
      if (!rawOrder) {
        return res.status(400).json({ error: 'Missing or invalid order details' });
      }

      orderDetails = JSON.parse(rawOrder);
    } catch (error) {
      console.error('Error parsing order details:', error);
      return res.status(400).json({ error: 'Invalid order details' });
    }

    // Validate cart items
    const cartValidationErrors = validateCartItems(orderDetails);
    if (cartValidationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cart items',
        details: cartValidationErrors
      });
    }

    // Process the form data
    const name = sanitizeInput(contactInfo.name);
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');

    const orderData: OrderData = {
      firstName: contactInfo.firstName ? sanitizeInput(contactInfo.firstName) : firstName || '',
      lastName: contactInfo.lastName ? sanitizeInput(contactInfo.lastName) : lastName || '',
      email: sanitizeInput(contactInfo.email),
      phone: sanitizeInput(contactInfo.phone),
      company: sanitizeInput(contactInfo.company),
      notes: contactInfo.notes ? sanitizeInput(contactInfo.notes) : undefined,
      cartItems: orderDetails
    };

    // Validate required fields with more specific error messages
    const validationErrors: string[] = [];
    
    if (!orderData.firstName) {
      validationErrors.push('First name is required');
    }
    if (!orderData.email) {
      validationErrors.push('Email is required');
    }
    if (!orderData.phone) {
      validationErrors.push('Phone number is required');
    }
    if (!orderData.company) {
      validationErrors.push('Company name is required');
    }
    if (!orderData.cartItems?.length) {
      validationErrors.push('Cart is empty');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(orderData.phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format'
      });
    }

    // Send order notifications with the logo file
    try {
      await sendOrderNotification(orderData, logoFile);
    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send order notification'
      });
    }

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