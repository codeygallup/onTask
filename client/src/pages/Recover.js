import { Link } from "react-router-dom";

const Recover = () => {
  return (
    <>
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div
        className="container card shadow p-4"
        style={{ maxWidth: "550px" }}
      >
        <form className="mx-5">
          <h3 className="text-center mb-3">Password Recovery</h3>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              className='form-control'
              required
            />
            <label
              htmlFor="email"
            >
              Email
            </label>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary text-center"
            >
              Reset Password
            </button>
          </div>
        </form>
        <div className="mt-2">
            <p className="text-center">
              Return to <Link to="/login">login here</Link>
            </p>
         
        </div>
      </div>
    </div>
  </>
  );
};

export default Recover;