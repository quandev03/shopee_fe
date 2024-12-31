export const purchasesStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmation: 1,
  waitForPicking: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5
} as const;
