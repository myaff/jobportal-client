export interface OrganizationDto {
  id: string;
  inn: string | null;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string | null;
}

export default class Organization {
  id: string;
  inn: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;

  constructor(data: OrganizationDto) {
    this.id = data.id;
    this.inn = data?.inn ?? ''; // || '7701058410';
    this.name = data.name;
    this.description = data.description ?? '';
    this.logoUrl = data.logoUrl ?? '';
    this.websiteUrl = data?.websiteUrl ?? ''; // 'https://sk.ru/';
  }

  get websiteUrlShort() {
    if (!this.websiteUrl) return '';
    const withoutProtocol = this.websiteUrl.replace(/http:\/\/|https:\/\//gmi, '');
    return withoutProtocol.endsWith('/')
      ? withoutProtocol.slice(0, -1)
      : withoutProtocol;
  }

  toString() {
    return this.name;
  }

  toPlainObject() {
    return {
      id: this.id,
      inn: this.inn,
      name: this.name,
      descriptions: this.description,
      logoUrl: this.logoUrl,
      websiteUrl: this.websiteUrl,
    };
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }
}