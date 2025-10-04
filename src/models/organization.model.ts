export interface OrganizationDto {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export default class Organization implements OrganizationDto {
  id: string;
  name: string;
  description: string;
  logoUrl: string;

  constructor(data: OrganizationDto) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description ?? '';
    this.logoUrl = data.logoUrl ?? '';
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      descriptions: this.description,
      logoUrl: this.logoUrl,
    })
  }
}