import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const Navbar = () => {
  return (
    <nav className="flex h-20 w-full items-center justify-between border-b-2 border-slate-300 bg-slate-200 p-4">
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
          className="rounded-lg border-2 border-slate-500 bg-slate-100 px-2.5 py-2 transition-colors hover:bg-slate-300 md:py-1"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
