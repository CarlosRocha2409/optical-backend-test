export class StaffDTO {
  id: string;
  name: string;
  lastname: string;
  fullname: string;
  email: string;
  createdAt: string;

  constructor(staff: any) {
    this.id = staff.id;
    this.name = staff.name;
    this.lastname = staff.lastname;
    this.fullname = `${staff.name} ${staff.lastname}`;
    this.email = staff.email;
    this.createdAt = staff.created_at;
  }
}
