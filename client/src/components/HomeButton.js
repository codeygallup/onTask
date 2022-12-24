import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function HomeButton() {
  return (
    <button className="btn btn-primary return">
      <FontAwesomeIcon icon={faHouse} />
    </button>
  );
}
