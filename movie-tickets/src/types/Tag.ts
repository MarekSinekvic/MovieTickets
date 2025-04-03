import { Item } from "./item";
import { Movie } from "./Movie";

export class Tag implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public movies?: Movie[]
  ) {
    this["@id"] = _id;
  }
}
