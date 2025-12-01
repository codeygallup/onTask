import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const Navbar = () => {
  return (
    <nav className="bg-slate-200 p-4 h-20 w-full flex justify-between items-center border-b-2 border-slate-300">
      <div className="text-2xl">
        {Auth.loggedIn() && (
          <div>
            <p>Hello {Auth.getProfile()?.data?.username}</p>
          </div>
        )}
        <Link to="/">
          <h1>Welcome to OnTask!</h1>
        </Link>
      </div>
      {Auth.loggedIn() && (
        <button
          onClick={Auth.logout}
          className="border-2 border-slate-500 md:py-1 py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-300 transition-colors"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
