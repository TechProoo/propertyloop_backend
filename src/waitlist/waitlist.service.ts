import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { UpdateWaitlistDto } from './dto/update-waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  create(createWaitlistDto: CreateWaitlistDto) {
    return this.sendWelcomeEmail(createWaitlistDto);
  }

  private async sendWelcomeEmail(createWaitlistDto: CreateWaitlistDto) {
    const entry = await this.prisma.waitlistEntry.create({
      data: {
        first_name: createWaitlistDto.first_name,
        last_name: createWaitlistDto.last_name,
        company_name: createWaitlistDto.company_name,
        location: createWaitlistDto.location,
        phone: createWaitlistDto.phone,
        email: createWaitlistDto.email,
        type: createWaitlistDto.type,
      },
    });

    // Send welcome email asynchronously (don't wait for it)
    this.mailService
      .sendEmail({
        to: entry.email,
        subject: 'Welcome to PropertyLoop Waitlist',
        text: `Welcome to PropertyLoop! Thank you for joining our waitlist as a ${createWaitlistDto.type.replace(/_/g, ' ')}.`,
        html: this.getWelcomeEmailTemplate(entry.first_name),
      })
      .catch((err) => {
        console.error('Failed to send welcome email:', err);
      });

    return entry;
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PropertyLoop</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              color: #333;
              line-height: 1.6;
            }
            .wrapper { background-color: #f5f5f5; padding: 20px 0; }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #2f9e61 0%, #247a4a 100%);
              color: white; 
              padding: 40px 20px;
              text-align: center;
            }
            .header img {
              max-width: 120px;
              height: auto;
              margin-bottom: 15px;
            }
            .header h1 {
              font-size: 28px;
              font-weight: 600;
              margin: 10px 0 0 0;
            }
            .header p {
              font-size: 14px;
              opacity: 0.9;
              margin-top: 5px;
            }
            .content { 
              padding: 40px;
            }
            .greeting {
              font-size: 16px;
              margin-bottom: 20px;
              color: #333;
            }
            .greeting strong {
              color: #2f9e61;
            }
            .message {
              font-size: 15px;
              color: #555;
              margin-bottom: 25px;
              line-height: 1.8;
            }
            .features {
              background-color: #f9fafb;
              border-left: 4px solid #2f9e61;
              padding: 20px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .features h3 {
              color: #2f9e61;
              font-size: 16px;
              margin-bottom: 15px;
            }
            .features ul {
              list-style: none;
              padding-left: 0;
            }
            .features li {
              padding: 8px 0;
              font-size: 14px;
              color: #555;
              display: flex;
              align-items: center;
            }
            .features li:before {
              content: "✓";
              color: #2f9e61;
              font-weight: bold;
              margin-right: 10px;
              font-size: 16px;
            }
            .cta-section {
              text-align: center;
              margin: 30px 0;
            }
            .cta-button {
              display: inline-block;
              background-color: #2f9e61;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 600;
              font-size: 14px;
              transition: background-color 0.3s;
            }
            .cta-button:hover {
              background-color: #247a4a;
            }
            .closing {
              font-size: 14px;
              color: #666;
              margin-top: 25px;
              padding-top: 25px;
              border-top: 1px solid #eee;
            }
            .signature {
              margin-top: 15px;
              font-size: 14px;
            }
            .signature strong {
              color: #2f9e61;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #eee;
            }
            .footer a {
              color: #2f9e61;
              text-decoration: none;
            }
            .divider {
              height: 1px;
              background-color: #eee;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <!-- Header with Logo -->
              <div class="header">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="58" fill="white" opacity="0.1" stroke="white" stroke-width="2"/>
                  <path d="M60 30L80 50V85H40V50L60 30Z" fill="white"/>
                  <path d="M50 60L60 50L70 60" stroke="white" stroke-width="2" fill="none"/>
                </svg>
                <h1>Welcome to PropertyLoop</h1>
                <p>Your journey to smarter real estate management starts here</p>
              </div>

              <!-- Main Content -->
              <div class="content">
                <div class="greeting">
                  Hi <strong>${firstName}</strong>,
                </div>

                <div class="message">
                  Thank you for joining the PropertyLoop waitlist! We're thrilled to have you as part of our community. Your interest in revolutionizing real estate management means a lot to us.
                </div>

                <!-- Features Section -->
                <div class="features">
                  <h3>What to Expect</h3>
                  <ul>
                    <li>Early access to PropertyLoop's innovative platform</li>
                    <li>Regular updates on our development progress</li>
                    <li>Exclusive launch offers and benefits for early adopters</li>
                    <li>Direct input on features that matter most to you</li>
                  </ul>
                </div>

                <div class="message">
                  We're working hard to bring you the most comprehensive real estate management solution. Stay tuned for exciting announcements and be ready to transform the way you work with property.
                </div>

                <div class="closing">
                  If you have any questions, suggestions, or just want to chat about real estate innovation, feel free to reply to this email. We'd love to hear from you!
                </div>

                <div class="signature">
                  Warm regards,<br>
                  <strong>The PropertyLoop Team</strong><br>
                  <span style="color: #999; font-size: 13px;">Making real estate management smarter</span>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>&copy; 2026 PropertyLoop. All rights reserved.</p>
                <p>
                  <a href="https://propertyloop.ng/privacy">Privacy Policy</a> • 
                  <a href="https://propertyloop.ng/terms">Terms of Service</a>
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  findAll() {
    return this.prisma.waitlistEntry.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.waitlistEntry.findUnique({
      where: { id },
    });
  }

  update(id: string, updateWaitlistDto: UpdateWaitlistDto) {
    return this.prisma.waitlistEntry.update({
      where: { id },
      data: updateWaitlistDto,
    });
  }

  remove(id: string) {
    return this.prisma.waitlistEntry.delete({
      where: { id },
    });
  }

  async export(): Promise<string> {
    const entries = await this.prisma.waitlistEntry.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (entries.length === 0) {
      return 'First Name,Last Name,Email,Phone,Company Name,Location,Type,Created At\n';
    }

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company Name',
      'Location',
      'Type',
      'Created At',
    ];

    const rows = entries.map((entry) => [
      this.escapeCsvField(entry.first_name),
      this.escapeCsvField(entry.last_name),
      this.escapeCsvField(entry.email),
      this.escapeCsvField(entry.phone),
      this.escapeCsvField(entry.company_name || ''),
      this.escapeCsvField(entry.location || ''),
      this.escapeCsvField(entry.type),
      this.escapeCsvField(entry.created_at.toISOString()),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csv;
  }

  private escapeCsvField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}
