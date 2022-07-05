import { useEffect, useState } from "react";
import $ from "jquery";

function FilePreviewer({ filePrev }) {
  const [isImg, setIsImg] = useState(false);

  useEffect(() => {
    if (filePrev) {
      let fileType = filePrev["mimetype"];
      if (fileType !== "text/plain") {
        setIsImg(true);
        $("#txtHere").attr("data", "");
        let newSrc = `data:${fileType};base64,${filePrev["data"].toString(
          "base64"
        )}`;
        $("#imgHere").attr("src", newSrc);
      } else {
        setIsImg(false);
        $("#imgHere").attr("src", "");
        let newSrc = `data:${fileType};base64,${filePrev["data"].toString(
          "base64"
        )}`;
        $("#txtHere").attr("data", newSrc);
      }
    }
  }, [filePrev]);

  return (
    <div
      className="w-full"
      style={{ display: "block", bottom: "0%", height: "20%" }}
    >
      {filePrev ? (
        <div className="flex shadow-2xl flex-col w-full text-center justify-center">
          <h1>{filePrev.name}</h1>
          <img
            className="rounded-xl w-1/2"
            id="imgHere"
            src=""
            style={{
              marginLeft: "25%",
              visibility: !isImg ? "hidden" : "visible",
            }}
          />
          <object
            className="w-full"
            id="txtHere"
            style={{ minHeight: "300px" }}
          ></object>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default FilePreviewer;