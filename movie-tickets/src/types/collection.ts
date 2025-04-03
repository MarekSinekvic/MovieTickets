export interface PagedCollection<T> {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
  member?: T[];
  truesearch?: object;
  truetotalItems?: number;
  trueview?: {
    "@id": string;
    "@type": string;
    truefirst?: string;
    truelast?: string;
    trueprevious?: string;
    truenext?: string;
  };
}

export const isPagedCollection = <T>(data: any): data is PagedCollection<T> =>
  "member" in data && Array.isArray(data["member"]);
