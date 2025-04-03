import { Item } from "./item";
import { Ticket } from "./Ticket";

export class User implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public uuid?: string,
    public roles?: string[],
    public password?: string,
    public tickets?: Ticket[],
    public userIdentifier?: string
  ) {
    this["@id"] = _id;
  }
}
