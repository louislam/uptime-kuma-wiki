import { D3Selection } from "../types.ts";
import { xkcdFontUrl } from "./fontData.ts";

const addFont = (selection: D3Selection) => {
    selection.append("defs").append("style").attr("type", "text/css").text(`@font-face {
      font-family: "xkcd";
      src: url(${xkcdFontUrl}) format('woff');
    }`);
};

export default addFont;
