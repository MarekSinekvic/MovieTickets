import { MouseEventHandler } from "react";

import "../../app/globals.css";

export default function SelectButton({children, onClick, type = "button", style = {}} : {children: React.ReactNode,onClick?:MouseEventHandler,type?:"button"|"submit"|"reset", style?: object}) {
    return (
      <>
        <button style={style} onClick={onClick} type={type}>{children}</button>
      </>
    );
  }