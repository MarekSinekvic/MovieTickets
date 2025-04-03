import { Item } from "./item";

export class Media implements Item {
  public "@id"?: string;

  constructor(_id?: string, 
    public movie?: string,
    public file?: string,
    public uri?: string) {
    this["@id"] = _id;
  }
}
