import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedPage } from "../actions/getFeed";

export function useFeed(tag?: string) {
  return useInfiniteQuery({
    queryKey: ["feed", tag],
    queryFn: async ({ pageParam }) => {
      const result = await getFeedPage(pageParam, 10, tag);
      return result;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
}
