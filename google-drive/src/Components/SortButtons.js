import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import '../Files.css'

function SortButtons({sortList}) {

  return (
        <div className="flex">
          <div className="dropdown inline-block relative ">
            <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
              <span className="mr-1">Sort</span>
              <FontAwesomeIcon  icon={faAngleDown} />
            </button>
            <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
              <li className="" onClick={() => sortList("name")}>
                <button 
                  className="rounded-t bg-gray-200 w-full text-left hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                >
                 Name 
                </button>
              </li>
              <li className="" onClick={() => sortList("date")}>
              <button 
                  className="rounded-t bg-gray-200 w-full text-left hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                >
                  Date
                </button>
              </li>
              <li onClick={() => sortList("type")}>
              <button 
                  className="rounded-t bg-gray-200 w-full text-left hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                >
                  Type
                </button>
              </li>
            </ul>
          </div>
        </div>

 
  );
}

export default SortButtons;