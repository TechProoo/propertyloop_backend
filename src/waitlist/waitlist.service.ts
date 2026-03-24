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
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2f9e61; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; margin-top: 20px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to PropertyLoop</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>Thank you for joining our waitlist! We're excited about your interest in PropertyLoop.</p>
              <p>We'll keep you updated on our progress and notify you as soon as we launch.</p>
              <p style="margin-top: 20px; font-weight: bold;">What's next?</p>
              <ul>
                <li>Stay tuned for updates on PropertyLoop's development</li>
                <li>We'll notify you when we're ready to launch</li>
                <li>You'll be among the first to access our platform</li>
              </ul>
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>Best regards,<br><strong>PropertyLoop Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2026 PropertyLoop. All rights reserved.</p>
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
