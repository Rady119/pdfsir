import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Email configuration
    const emailBody = `
      New Contact Form Submission
      
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    // Send email using nodemailer
    const nodemailer = require('nodemailer');
    
    // Log SMTP configuration (excluding password)
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug logging
      logger: true  // Enable built-in logger
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('SMTP verification failed:', {
        error: verifyError,
        message: verifyError.message,
        code: verifyError.code
      });
      throw verifyError;
    }

    // Send email
    const mailResult = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL,
      subject: 'New Contact Form Submission',
      text: emailBody,
    });

    console.log('Email sent successfully:', mailResult);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form error:', {
      error: error,
      message: error.message,
      code: error.code,
      command: error.command
    });

    let errorMessage = 'Failed to send message';
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check SMTP credentials.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Could not connect to email server. Please check SMTP settings.';
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
