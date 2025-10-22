import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

interface OptimizedQueryConfig<TData>
  extends Omit<UseQueryOptions<TData>, "queryKey" | "queryFn"> {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
}

interface UseOptimizedQueryParams<TData> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  config?: OptimizedQueryConfig<TData>;
  logPrefix?: string;
}

/**
 * Enhanced query hook with performance logging and optimization
 * Tracks query lifecycle and provides detailed performance metrics
 */
export function useOptimizedQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  config = {},
  logPrefix = "Query",
}: UseOptimizedQueryParams<TData>): UseQueryResult<TData> {
  const startTime = performance.now();

  console.log(`🔍 ${logPrefix} Hook Called:`, {
    queryKey,
    enabled,
    timestamp: new Date().toISOString(),
  });

  const wrappedQueryFn = async () => {
    const fetchStartTime = performance.now();
    console.log(`🔄 ${logPrefix} queryFn STARTED - Fetching from database:`, {
      queryKey,
      timestamp: new Date().toISOString(),
    });

    try {
      const data = await queryFn();
      const fetchEndTime = performance.now();

      console.log(`✅ ${logPrefix} queryFn COMPLETED:`, {
        queryKey,
        dataLength: Array.isArray(data) ? data.length : "single record",
        fetchDuration: `${(fetchEndTime - fetchStartTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });

      return data;
    } catch (error) {
      const fetchEndTime = performance.now();
      console.error(`❌ ${logPrefix} queryFn ERROR:`, {
        queryKey,
        error: error instanceof Error ? error.message : "Unknown error",
        fetchDuration: `${(fetchEndTime - fetchStartTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };

  const result = useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    enabled,
    ...config,
  });

  const endTime = performance.now();
  console.log(`📊 ${logPrefix} Hook Result:`, {
    queryKey,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    dataStatus: result.data
      ? Array.isArray(result.data)
        ? `${result.data.length} records`
        : "has data"
      : "no data",
    fetchStatus: result.fetchStatus,
    status: result.status,
    isCached: !result.isFetching && !!result.data,
    hookDuration: `${(endTime - startTime).toFixed(2)}ms`,
    timestamp: new Date().toISOString(),
  });

  return result;
}
