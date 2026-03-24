import { Controller, Get, Post, Body, Patch, Param, Delete, Response } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { WaitlistService } from './waitlist.service';
import { MailService } from '../mail/mail.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { UpdateWaitlistDto } from './dto/update-waitlist.dto';
import { SendEmailDto } from '../mail/dto/send-email.dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(
    private readonly waitlistService: WaitlistService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  create(@Body() createWaitlistDto: CreateWaitlistDto) {
    return this.waitlistService.create(createWaitlistDto);
  }

  @Get()
  findAll() {
    return this.waitlistService.findAll();
  }

  @Get('export')
  async export(@Response() res: ExpressResponse) {
    const csv = await this.waitlistService.export();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="waitlist.csv"');
    res.send(csv);
  }

  @Post(':id/send-email')
  async sendEmail(
    @Param('id') id: string,
    @Body() emailDto: SendEmailDto,
  ) {
    await this.mailService.sendEmail(emailDto);
    return { success: true, message: 'Email sent successfully' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waitlistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaitlistDto: UpdateWaitlistDto) {
    return this.waitlistService.update(id, updateWaitlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waitlistService.remove(id);
  }
}
