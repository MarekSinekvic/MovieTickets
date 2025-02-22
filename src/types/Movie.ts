import { Item } from "./item";
import { Tag } from "./Tag";

export class Movie implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public show?: string,
    public tags?: Tag[],
    public preview?: string,
    public media?: string[],
    public description?: string
  ) {
    this["@id"] = _id;
  }
}
