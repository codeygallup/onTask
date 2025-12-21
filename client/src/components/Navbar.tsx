import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const Navbar = () => {
  return (
    <nav className="flex h-20 w-full items-center justify-between border-b-2 border-slate-300 bg-slate-200 p-2 md:p-4">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/clipboard-icon.png"
          alt="OnTask"
          className="h-12 w-12 md:h-14 md:w-14"
        />
        <h2 className="text-xl font-semibold md:text-2xl">OnTask</h2>
      </Link>

      <div className="flex items-center gap-4">
        {Auth.loggedIn() && (
          <>
            <p className="text-sm text-slate-600 md:text-base">
              {Auth.getProfile()?.data?.username}
            </p>
            <button
              onClick={Auth.logout}
              className="rounded-lg border-2 border-slate-500 bg-slate-100 px-3 py-2 text-sm transition-colors hover:bg-slate-300 md:px-4 md:text-base"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
