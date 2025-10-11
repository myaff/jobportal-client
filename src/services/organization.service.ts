import Organization, { OrganizationDto } from "@/models/organization.model";
import { ApiService } from "./api.service";

export class OrganizationService extends ApiService {
  resource = 'v1/organization';

  getList() {
    return OrganizationService.api
      .get<OrganizationDto[]>(this.resource)
      .then(res => res.data.map(item => new Organization(item)));
  }

  create(formData: Omit<OrganizationDto, 'id'>) {
    return OrganizationService.api
      .post(this.resource, formData);
  }

  update(formData: Pick<OrganizationDto, 'id'> & Partial<OrganizationDto>) {
    return OrganizationService.api
      .put(this.resource, formData);
  }
}