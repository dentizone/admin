export interface University {
  id?: string;
  name: string;
  domain?: string;
  isSupported?: boolean;
}

export interface CreateUniversityDto {
  name: string;
  domain?: string;
}

export interface UpdateUniversityDto {
  name?: string;
  isSupported?: boolean;
}

export interface PagedResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
} 