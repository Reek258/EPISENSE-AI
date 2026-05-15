import apiClient from './client';

export interface WaterReport {
  id?: string;
  zone_id: string;
  latitude: number;
  longitude: number;
  severity: 'Low' | 'Medium' | 'High';
  description?: string;
  status?: string;
  reported_at?: string;
  reporter_name: string;
  contact_number?: string;
  image_url?: string;
}

export const reportsApi = {
  getAllReports: async () => {
    const response = await apiClient.get<WaterReport[]>('/reports/');
    return response.data;
  },
  createReport: async (report: WaterReport) => {
    const response = await apiClient.post<WaterReport>('/reports/', report);
    return response.data;
  },
  deleteReport: async (id: string) => {
    const response = await apiClient.delete(`/reports/${id}`);
    return response.data;
  }
};
