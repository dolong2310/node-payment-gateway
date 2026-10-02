export type Bank = {
  bankcode: string;
  name: string;
  displayorder: number;
  pmcid: number;
  minamount: number;
  maxamount: number;
};

export type BankList = {
  returncode: number;
  returnmessage: string;
  banks: Record<string, Bank[]>; // key là pmcid (xem enum PmcId)
};
