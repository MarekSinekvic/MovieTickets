import { Item } from "./item";
import { Show } from "./Show";
import { User } from "./User";

export class Ticket implements Item {
  public "@id"?: string;

  constructor(_id?: string, 
    public show?: Show,
    public client?: User, 
    public seat?: number) {
    this["@id"] = _id;
  }
}
