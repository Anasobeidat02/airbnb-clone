import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { Usercontext } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(Usercontext);
  async function handelLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        { email, password },
        { withCredentials: true } // إرسال الكوكيز مع الطلب
      );
      setUser(data); // تحديث الحالة العالمية
      alert("User logged in successfully !");
      setRedirect(true);  // تحويل المستخدم إلى الصفحة الرئيسية

    } catch (error) {
      // عرض تفاصيل الخطأ
      if (error.response) {
        // إذا كان هناك استجابة من السيرفر مع رسالة خطأ
        alert(`Error: ${error.response.data.message || "Login failed"}`);
      } else if (error.request) {
        // إذا لم يكن هناك استجابة من السيرفر
        alert("No response from server. Please try again later.");
      } else {
        // أي خطأ آخر (خطأ في الكود مثلاً)
        alert(`Request error: ${error.message}`);
      }
      console.error("Login error:", error);
    }
  }
  if (redirect) {
    return <Navigate to="/" />;
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
