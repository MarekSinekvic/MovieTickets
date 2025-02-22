import { Item } from "./item";

export class Ticket implements Item {
  public "@id"?: string;

  constructor(_id?: string, public show?: string, public client?: string) {
    this["@id"] = _id;
  }
}
