import { useEffect, useState } from "react";
import FilePreviewer from './FilePreviewer'
import TableEntry from './TableEntry.js';
import SortButtons from "./SortButtons";
import $ from "jquery"

function Files() {
  const [allFiles, setAllFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState();
  const [sortFilter, setSortFilter] = useState();
  const [searchedFiles, setSearchedFiles] = useState([]);
  const [searchStr, setSearchStr] = useState("");

  const sortBy = {
    DATE: "date",
    NAME: "name",
    TYPE: "type",
  };

  useEffect(() => {
    if (allFiles.length == 0) {
      console.log("im about to fetch")
      fetch("http://localhost:3001/allFiles")
        .then(async (data) => {
          console.log("All Files Retrieved")
          let parsedData = await data.json();
          setAllFiles(parsedData.results);
        })
        .catch((e) => {
          console.log(e);
          $("#messageHere").html("There was an error retrieving the files");
          setInterval(() => {
            $("#messageHere").html("");
          }, 3000);
        });
    }
  }, []);

  const sortList = (sortType) => {
    if (sortType != sortFilter) {
      setSortFilter(sortType);
    }
    let temp = allFiles.slice();
    switch (sortType) {
      case sortBy.DATE:
        temp.sort((a, b) => {
          if (new Date(a["upload_date"]) > new Date(b["upload_date"])) {
            return 1;
          }
          if (new Date(b["upload_date"]) > new Date(a["upload_date"])) {
            return -1;
          }
          return 0;
        });
        break;
      case sortBy.NAME:
        temp.sort((a, b) => a.file.name.localeCompare(b.file.name));
        break;
      case sortBy.TYPE:
        temp.sort((a, b) => a.file.mimetype.localeCompare(b.file.mimetype));
        break;
      default:
        break;
    }
    setAllFiles(temp);
  };

  useEffect(() => {
    if (searchStr == "") {
      setSearchedFiles(allFiles);
    } else {
      let matchedFiles = allFiles.filter((f) =>
        f.file.name.includes(searchStr)
      );
      setSearchedFiles(matchedFiles);
    }
  }, [allFiles]);

  const onFileChange = (e) => {
    let yourFile = e.target.files[0];
    const formData = new FormData();
    let currDate = new Date();
    formData.append("file", yourFile);
    formData.append("date", currDate);

    fetch("http://localhost:3001/upload", {
      method: "post",
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          let downloadStatus = await response.json();
          if (downloadStatus["acknowledged"]) {
            fetch(
              `http://localhost:3001/getDoc/${downloadStatus["insertedId"]}`
            ).then(async (doc) => {
              console.log("im uploaded!");
              let newDoc = await doc.json();
              let temp = [...allFiles.slice(), newDoc[0]];
              setAllFiles(temp);
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
        $("#messageHere").html("There was an error uploading the file!");
        setInterval(() => {
          $("#messageHere").html("");
        }, 3000);
      });
  };

  const viewFile = (id) => {
    setCurrentFile(allFiles.find((entry) => entry._id === id).file);
  };

  const downloadFile = (id) => {
    fetch(`http://localhost:3001/getDoc/${id}`)
      .then(async (fileData) => {
        let fileD = await fileData.json({});
        var link = document.createElement("a");
        link.href = `data:${
          fileD[0].file.mimetype
        };base64,${fileD[0].file.data.toString("base64")}`;
        link.download = fileD[0].file.name;
        link.click();
      })
      .catch((e) => {
        console.log(e);
        $("#messageHere").html("There was an error downloading the file!");
        setInterval(() => {
          $("#messageHere").html("");
        }, 3000);
      });
  };

  const handleSearch = (e) => {
    console.log(allFiles);
    let searchValue = e.target.value;
    let matchedFiles = allFiles.filter((f) =>
      f.file.name.includes(searchValue)
    );
    setSearchStr(searchValue);
    setSearchedFiles(matchedFiles);
  };

  return (
    <div className="flex flex-col space-y-10 m-5 overflow-x-auto space-y-5 w-full h-full">
      <p id="messageHere"></p>
      <div className="flex flex-row space-x-5 p-5">
        <input
          className="flex inline-block rounded-lg"
          type="file"
          accept="image/*,.txt"
          onChange={(e) => onFileChange(e)}
        />
        <input
          type="text"
          onChange={handleSearch}
          placeHolder="Search for file..."
          className="ring-2 ring-black rounded-xl p-2"
        />
        <SortButtons sortList={sortList} />
      </div>
      <table
        className=" w-full text-sm text-left text-gray-500 overflow-y-auto"
        style={{ display: "block", height: "75%" }}
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 w-full ">
          <tr>
            <th scope="col" className="px-6 py-3">
              File Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Date Uploaded
            </th>
            <th scope="col" className="px-6 py-3">
              <span class="sr-only">Download</span>
            </th>
            <th scope="col" className="px-6 py-3">
              <span class="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody id="tableBody">
          {searchedFiles.map((entry) => (
            <TableEntry
              _id={entry._id}
              name={entry.file.name}
              upload_date={entry.upload_date}
              mimetype={entry.file.mimetype}
              viewFile={viewFile}
              downloadFile={downloadFile}
            />
          ))}
        </tbody>
      </table>
      <FilePreviewer filePrev={currentFile} />
    </div>
  );
}

export default Files;