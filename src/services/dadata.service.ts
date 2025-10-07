import axios from "axios";
import type { DaDataApi } from "dadata-api";

interface Suggestions<T> {
  suggestions: DaDataApi.Suggestion<T>[];
}
export default class DadataService {
  resource = 'suggestions/api/4_1';
  static readonly api = axios.create({
    baseURL: import.meta.env.VITE_DADATA_API,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${import.meta.env.VITE_DADATA_KEY}`,
    }
  });

  getCompanyInfo(inn: string) {
    return DadataService.api
      .post<Suggestions<DaDataApi.Party>>(
        `${this.resource}/rs/findById/party`,
        { query: inn }
      )
      .then(res => res.data);
  }
}