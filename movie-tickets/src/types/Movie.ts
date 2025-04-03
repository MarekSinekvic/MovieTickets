import { Item } from "./item";
import { Media } from "./Media";
import { Tag } from "./Tag";

export class Movie implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public show?: string,
    public tags?: Tag[],
    public preview?: Media,
    public media?: Media[],
    public description?: string
  ) {
    this["@id"] = _id;
  }
}
