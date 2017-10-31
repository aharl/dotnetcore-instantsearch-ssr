declare interface ICatalogProps {
  cat1: string;
  cat2: string;
  cat3: string;
}

declare interface ISearchState {
  configure?: ISearchConfig;
  page?: number;
  query?: string;
  menu?: ISearchMenu;
  hierarchicalMenu?: ISearchHierarchicalMenu;
}
declare interface ISearchConfig {
  hitsPerPage: string;
}
declare interface ISearchHierarchicalMenu {
  category1: string;
}
declare interface ISearchMenu {
  capacity: string;
  color: string;
  material: string;
  neckfinish: string;
  industries: string;
}

declare interface ISearchHit {
  objectID: string;
  name: string;
  title: string;
  industries: string[];
  category1: string[];
  category2: string[];
  category3: string[];
  type: string;
  color: string;
  capacity: string;
  diameter: number;
  height: number;
  width: number;
  length: number;
  neckfinish: string;
  material: string;
  rank: number;
  webStatus: string;
  isLidIncluded: boolean;
  lidSize: number;
  liner: number;
  imageCount: number;
  printWidth: number;
  printHeight: number;
  labelWidth: number;
  labelHeight: number;
  isSampleAllowed: boolean;
  temperatureTolerances: number;
  clarity: number;
  chemicalResistance: number;
  impactResistance: number;
  rigidity: number;
  scratchResistance: number;
  isFoodGrade: boolean;
  isRecyclable: boolean;
  printDiameter: number;
  searchTerms: string;
  productDesc: string;
  longDesc: string;
  isAvailable: boolean;
  isFullCaseOnly: boolean;
  sCase: number;
  basePrice: number;
  casePrice: number;
  lCase: number;
  productGroupName: string;
  productGroupKey: number;
}
