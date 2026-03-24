export class WaitlistResponseDto {
  id: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  location?: string;
  phone: string;
  email: string;
  type: string;
  created_at: Date;
}
