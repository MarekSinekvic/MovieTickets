import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import SelectButton from "../common/SelectButton";


export default function DatesSelector({onApply = undefined, defaultValue = "", ref = undefined} : {dateSetter?: Dispatch<SetStateAction<string|string[]>>,onApply?: Dispatch<SetStateAction<string|string[]>>, defaultValue?: string|string[], ref?: MutableRefObject<string|string[]|undefined>}) {
    const [isExpanded, expand] = useState<boolean>(false);
    return (
      <div>
        <div>
          <SelectButton onClick={()=>{expand(!isExpanded)}}>Dates</SelectButton>
        </div>
      </div>
    );
  }