import {
  CooperationRequestStatus,
  DiscountType,
  FinancialRecordStatus,
  FinancialRecordType,
} from "@/shared/types";
import { convertDate, ConvertMap } from "@/shared/utils";

export const discountConvertMap: ConvertMap = [
  [["expireAt", "expireDate"], convertDate],
  [
    "type",
    {
      fixed: DiscountType.fixedAmount,
      percentage: DiscountType.percentage,
      page: DiscountType.countOfPages,
    },
  ],
];

export const cooperationRequestConvertMap: ConvertMap = [
  [["createdAt", "date"], convertDate],
  [
    "status",
    {
      pending: CooperationRequestStatus.pending,
      approved: CooperationRequestStatus.approved,
      rejected: CooperationRequestStatus.rejected,
    },
  ],
];

export const financialRecordConvertMap: ConvertMap = [
  [["createdAt", "date"], convertDate],
  [
    "type",
    {
      debtor: FinancialRecordType.debtor,
      creditor: FinancialRecordType.creditor,
    },
  ],
  [
    "status",
    {
      successful: FinancialRecordStatus.successful,
      unsuccessful: FinancialRecordStatus.unsuccessful,
    },
  ],
];

export const dedicatedDiscountCodeReportConvertMap: ConvertMap = [
  [["createdAt", "date"], convertDate],
];

export const dedicatedLinkReportConvertMap: ConvertMap = [
  [["createdAt", "date"], convertDate],
];

export const customerReportConvertMap: ConvertMap = [
  [["createdAt", "registrationDate"], convertDate],
  [["firstOrderAt", "firstOrderDate"], convertDate],
  [["lastOrderAt", "lastOrderDate"], convertDate],
];
