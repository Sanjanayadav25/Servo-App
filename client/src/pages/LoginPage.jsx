import { useState } from "react";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...response.data.user,
          token: response.data.token,
        }),
      );

      setUser({
        ...response.data.user,
        token: response.data.token,
      });
      alert("Login successful");
    } catch (error) {
      console.log(error);

      alert("Login failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center">
      <div className="bg-cyan-600 p-6 rounded-lg text-center">
        <h1 className="text-3xl text-amber-300 font-bold mb-5">Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            className="border-gray-700 border-2 w-65 p-2 outline-none text-black"
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            className="border-gray-700 border-2 w-65 p-2 outline-none text-black"
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
          />

          <br />
          <br />

          <button
            className="w-65 font-medium border-gray-700 border-2 bg-red-400 p-2 hover:bg-red-500 duration-200"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
