import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const TableEntry = ({_id, name, upload_date, mimetype, viewFile, downloadFile }) => {

  return (
    <tr key={_id} id={_id}>
              <th
                scope="row"
                className="px-6 py-4 text-md text-black whitespace-nowrap">
                {name}
              </th>
              <td className="px-6 py-4 text-black text-md">{mimetype}</td>
              <td className="px-6 py-4 text-black text-md">
                {new Date(upload_date).toString()}
              </td>
              <td className="px-6 py-4 text-right text-black text-md">
                <button onClick={() => downloadFile(_id)}>
                  <FontAwesomeIcon  icon={faFileArrowDown} />
                </button>
              </td>
              <td className="px-6 py-4 text-right text-black text-md">
                <button onClick={() => viewFile(_id)}>
                  <FontAwesomeIcon  icon={faEye} />
                </button>
              </td>
            </tr>
  );
}

export default TableEntry;