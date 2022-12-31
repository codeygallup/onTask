import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function HomeButton() {
  return (
    <Link to="/">
      <button className="btn btn-primary return mb-3">
        <FontAwesomeIcon icon={faHouse} />
      </button>
    </Link>
  );
}
