import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handelLoginSubmit(ev) {
    ev.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/login",
        { email, password },
        { withCredentials: true }
      );
      alert("User logged in successfully !");

      // await axios.post("/login", {
      //   email,
      //   password,
      // });
    } catch {
      alert("Error logging in, please try again");
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="-mt-64 ">
        <h1 className="text-4xl text-center mb-4">Login Page</h1>
        <form className="max-w-md mx-auto " onSubmit={handelLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button type="submit" className="primary">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?
            <Link className="underline text-black" to="/register">
              {" "}
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
