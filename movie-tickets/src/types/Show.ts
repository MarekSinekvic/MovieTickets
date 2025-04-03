import { Item } from "./item";
import { Movie } from "./Movie";

export class Show implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public movie?: Movie,
    public theater?: string,
    public tickets?: string[],
    public begin_date?: Date,
    public end_date?: Date,
  ) {
    this["@id"] = _id;
  }
}
