import { Item } from "./item";

export class Show implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public movie?: any,
    public theater?: string,
    public tickets?: string[],
    public begin_date?: Date,
    public end_date?: Date,
    public views?: number
  ) {
    this["@id"] = _id;
  }
}
