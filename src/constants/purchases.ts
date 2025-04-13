export const purchasesStatus = {
  inCart: -1,
  all: 5,
  waitForConfirmation: 0,
  waitForPicking: 1,
  inProgress: 2,
  delivered: 3,
  cancelled: 4,
  failed: 6,
  refuse: 7
} as const;
