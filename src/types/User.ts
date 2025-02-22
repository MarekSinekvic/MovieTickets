import { Item } from "./item";

export class User implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public uuid?: string,
    public roles?: string[],
    public password?: string,
    public tickets?: string[],
    public userIdentifier?: string
  ) {
    this["@id"] = _id;
  }
}
