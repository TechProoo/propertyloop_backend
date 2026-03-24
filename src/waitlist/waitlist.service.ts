import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { UpdateWaitlistDto } from './dto/update-waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  create(createWaitlistDto: CreateWaitlistDto) {
    return this.prisma.waitlistEntry.create({
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
}
