import { convert, convertDate, ConvertMap } from "@/shared/utils";
import {
  PrintColor,
  PrintSize,
  PrintSide,
  BindingType,
  BindingMethod,
  CoverColors,
  OrderStatus,
  PostageMethod,
} from "@/shared/types";

export const printFoldersConvertMap: ConvertMap = [
  [
    ["color", "printColor"],
    {
      black_and_white: PrintColor.blackAndWhite,
      normal_color: PrintColor.normalColor,
      full_color: PrintColor.fullColor,
    },
  ],
  [
    ["size", "printSize"],
    {
      a4: PrintSize.a4,
      a5: PrintSize.a5,
      a3: PrintSize.a3,
    },
  ],
  [
    ["side", "printSide"],
    {
      single_sided: PrintSide.singleSided,
      double_sided: PrintSide.doubleSided,
    },
  ],
  [
    ["binding", "bindingOptions"],
    [
      [
        ["type", "bindingType"],
        {
          spring_normal: BindingType.springNormal,
          spring_papco: BindingType.springPapco,
          stapler: BindingType.stapler,
        },
      ],
      [
        ["method", "bindingMethod"],
        {
          all_files_together: BindingMethod.allFilesTogether,
          each_file_separated: BindingMethod.eachFileSeparated,
          count_of_files: BindingMethod.countOfFiles,
        },
      ],
      [
        ["coverColor", "coverColor"],
        {
          black_and_white: CoverColors.blackAndWhite,
          colorful: CoverColors.colorful,
        },
      ],
    ],
  ],
  [["files", "printFiles"], null],
];

export const orderConvertMap: ConvertMap = [
  [["createdAt", "date"], convertDate],
  [
    "status",
    {
      sent: OrderStatus.sent,
      pending: OrderStatus.pending,
      preparing: OrderStatus.preparing,
      canceled: OrderStatus.canceled,
    },
  ],
  [["postageAt", "postageDate"], convertDate],
  [
    "postageMethod",
    {
      express_mail: PostageMethod.expressMail,
    },
  ],
  [["postageAt", "lastUpdateDate"], convertDate],
  [
    ["folders", "printFolders"],
    (items: any[], direction) =>
      items.map((item) => convert(printFoldersConvertMap, item, direction)),
  ],
  [
    ["binding", "bindingOptions"],
    [
      [
        ["type", "bindingType"],
        {
          spring_normal: BindingType.springNormal,
          spring_papco: BindingType.springPapco,
          stapler: BindingType.stapler,
        },
      ],
      [
        ["method", "bindingMethod"],
        {
          all_files_together: BindingMethod.allFilesTogether,
          each_file_separated: BindingMethod.eachFileSeparated,
          count_of_files: BindingMethod.countOfFiles,
        },
      ],
      [
        ["coverColor", "coverColor"],
        {
          black_and_white: CoverColors.blackAndWhite,
          colorful: CoverColors.colorful,
        },
      ],
    ],
  ],
  [["files", "printFiles"], null],
];
