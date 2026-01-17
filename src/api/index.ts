import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {get} from './client';
import { EventsRoot, EventRoot } from './types';

type QueryConfig<TData, TError = Error> = Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>;

export function getAttraction<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/attractions/${id}`, params);
}

export function useAttractionQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['attraction', id, params],
    queryFn: () => getAttraction<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function getClassification<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/classifications/${id}`, params);
}

export function useClassificationQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['classification', id, params],
    queryFn: () => getClassification<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function getGenre<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/classifications/genres/${id}`, params);
}

export function useGenreQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['genre', id, params],
    queryFn: () => getGenre<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function getSegment<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/classifications/segments/${id}`, params);
}

export function useSegmentQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['segment', id, params],
    queryFn: () => getSegment<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function getSubGenre<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/classifications/subgenres/${id}`, params);
}

export function useSubGenreQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['subgenre', id, params],
    queryFn: () => getSubGenre<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function getEvent<T = EventRoot>(id: string, params?: { locale?: string; domain?: string }) {
  return get<T>(`/discovery/v2/events/${id}`, params);
}

export function useEventQuery<T = EventRoot>(id: string, params?: { locale?: string; domain?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['event', id, params],
    queryFn: () => getEvent<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function searchEvents<T = unknown>(params?: { keyword?: string; size?: number; page?: number; locale?: string; domain?: string }) {
  return get<T>("/discovery/v2/events", params);
}

export function useEventsQuery<T = EventsRoot>(params?: { keyword?: string; size?: number; page?: number; locale?: string; domain?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['events', params],
    queryFn: () => searchEvents<T>(params),
    ...config,
  });
}

export function getEventImages<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/events/${id}/images`, params);
}

export function useEventImagesQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['eventImages', id, params],
    queryFn: () => getEventImages<T>(id, params),
    enabled: !!id,
    ...config,
  });
}

export function getVenue<T = unknown>(id: string, params?: { locale?: string }) {
  return get<T>(`/discovery/v2/venues/${id}`, params);
}

export function useVenueQuery<T = unknown>(id: string, params?: { locale?: string }, config?: QueryConfig<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: ['venue', id, params],
    queryFn: () => getVenue<T>(id, params),
    enabled: !!id,
    ...config,
  });
}


// /discovery/v2/attractions/{id}	查询单个演出方 / 吸引力的详情（如艺人的简介、图片、关联活动数）	id：演出方唯一 ID（如 “K8vZ917uc57”）	locale（语言地区，默认 “*”，返回所有支持的语言）
// /discovery/v2/classifications/{id}	查询单个分类的详情（如 “体育” 分类下的所有子分类）	id：分类唯一 ID（如 “KZFzniwnSyZfZ7v7nE” 对应 “Sports”）	locale（默认 “*”）
// /discovery/v2/classifications/genres/{id}	查询单个 genre（二级分类）的详情（如 “Golf” 高尔夫）	id：genre 唯一 ID（如 “KnvZfZ7vAdt”）	locale（默认 “*”）
// /discovery/v2/classifications/segments/{id}	查询单个 segment（一级分类）的详情（如 “Music” 音乐、“Sports” 体育）	id：segment 唯一 ID（如 “KZFzniwnSyZfZ7v7nJ” 对应 “Music”）	locale（默认 “*”）
// /discovery/v2/classifications/subgenres/{id}	查询单个 subgenre（三级分类）的详情（如 “PGA Tour” 美巡赛）	id：subgenre 唯一 ID（如 “KZazBEonSMnZfZ7vFI7”）	locale（默认 “*”）
// /discovery/v2/events/{id}	查询单个活动的详情（如演唱会的时间、场馆、票价、购票链接）	id：活动唯一 ID（如 “G5diZfkn0B - bh”）	locale（默认 “*”）、domain（按域名筛选）
// /discovery/v2/events/{id}/images	查询单个活动的所有图片资源（单独提取图片，避免详情接口数据过大）	id：活动唯一 ID	locale（默认 “*”）
// /discovery/v2/venues/{id}
