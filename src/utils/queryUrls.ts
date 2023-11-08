export const QUERY_URLS = {
  foods: {
    list: () => '/foods',
    create: () => '/foods',
  },
  remedies: {
    list: () => '/remedies',
    create: () => '/remedies',
  },
  drinks: {
    list: () => '/drinks',
    create: () => '/drinks',
  },
  headaches: {
    list: () => '/headaches',
    create: () => '/headaches',
    detail: (id: string) => `/headaches/${id}`,
    unended: () => '/headaches/unended',
    remedies: (id: string) => `/headaches/${id}/remedies`,
    remedyResult: (id: string, remedyId: string) =>
      `/headaches/${id}/remedies/${remedyId}/result`,
    foodsAndDrinks: (id: string) => `/headaches/${id}/foods-and-drinks`,
    end: (id: string) => `/headaches/${id}/`,
  },
  session: {
    signIn: () => '/sessions/sign-in',
    verify: () => '/sessions/verify',
  },
  stats: {
    get: () => '/stats',
  },
};
