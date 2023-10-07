export const QUERY_KEYS = {
  foods: {
    list: () => ['foods'],
  },
  remedies: {
    list: () => ['remedies'],
  },
  drinks: {
    list: () => ['drinks'],
  },
  stats: () => ['stats'],
  headaches: {
    list: () => ['headaches'],
    detail: (id: string) => [...QUERY_KEYS.headaches.list(), id],
  },
};
