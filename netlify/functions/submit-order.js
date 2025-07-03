const nodemailer = require('nodemailer');

// Utility function to sanitize input
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .replace(/["]/g, '&quot;') // Escape quotes
    .replace(/[']/g, '&#x27;'); // Escape single quotes
}

// Utility function to validate cart items
function validateCartItems(items) {
  const errors = [];
  
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

const sendOrderNotification = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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

    // Send notification to admin
    await transporter.sendMail({
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
        
        <p style="color: #666; font-style: italic;">This is an automated notification. Please review the order details in your admin dashboard.</p>
      `
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: '"DirectPromo" <orders@directpromo.com>',
      to: sanitizedData.email,
      subject: 'Order Confirmation - DirectPromo',
      html: `
        <h2>Thank you for your order!</h2>
        <p>We have received your order request and will contact you shortly with a detailed quote.</p>
        
        <h3>Order Summary:</h3>
        <p><strong>Name:</strong> ${sanitizedData.firstName} ${sanitizedData.lastName}</p>
        <p><strong>Company:</strong> ${sanitizedData.company}</p>
        <p><strong>Total Items:</strong> ${sanitizedData.cartItems.length}</p>
        <p><strong>Estimated Total:</strong> $${totalAmount.toFixed(2)}</p>
        
        <p>We'll be in touch within 24 hours to discuss your order details and provide a final quote.</p>
        
        <p>Best regards,<br>The DirectPromo Team</p>
      `
    });

    return true;
  } catch (error) {
    console.error('Error sending order notification:', error);
    return false;
  }
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.company) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate cart items
    const cartErrors = validateCartItems(data.cartItems);
    if (cartErrors.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Invalid cart data', details: cartErrors })
      };
    }

    // Send order notification
    const emailSent = await sendOrderNotification(data);

    if (!emailSent) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Failed to send order notification' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Order submitted successfully',
        orderId: Date.now().toString()
      })
    };

  } catch (error) {
    console.error('Error processing order:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Failed to process order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
}; 