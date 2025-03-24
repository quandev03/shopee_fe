export const purchasesStatus = {
  inCart: -1,
  all: 7,
  waitForConfirmation: 6,
  waitForPicking: 4,
  inProgress: 5,
  delivered: 0,
  cancelled: 2,
  failed: 1,
  refuse: 3
} as const;
