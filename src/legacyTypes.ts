export type MetaItem = {
  uuid: string;
  profileUUID: string;
  vaultUUID: string;
  categoryUUID: string;
  itemTitle: string;
  itemDescription: string;
  websiteURLs?: string[];
  accountName?: string;
  vaultName: string;
  categoryPluralName: string;
  categorySingularName: string;
  modifiedAt: number;
  createdAt: number;
};

export type MetaCategory = {
  id: string;
  name: string;
  items: MetaItem[];
};
