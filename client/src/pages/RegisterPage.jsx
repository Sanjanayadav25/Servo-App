import { useState }  from "react";
import API from "../services/api";

function RegisterPage() {
  const [formData, setFormData] = useState({name: "", email: "",  password: "", role: "customer"  });

  const handleChange = (e) => {setFormData({  ...formData, [e.target.name]: e.target.value  }) };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", formData);

      console.log(res.data);

      alert("Registration successful");
    } catch (error) {
      console.log(error);

      alert("Registration failed");
    }
  };

     return (
  <div className="bg-black min-h-screen flex justify-center items-center">

    <div className="bg-cyan-600 p-6 text-center rounded-lg">

      <h1 className="text-3xl text-amber-300 font-bold mb-3">  Register </h1>

      <form onSubmit={handleSubmit}>

        <input
          className="border-gray-700 border-2 w-65 p-2 outline-none text-black"
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br /><br />

        <input
          className="border-gray-700 border-2 w-65 p-2 outline-none text-black"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          className="border-gray-700 border-2 w-65 p-2 outline-none text-black"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <select
          className="w-65 border-gray-700 border-2 p-2 outline-none text-black"
          name="role"
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
        </select>

        <br /><br />

        <button
          className="w-65 font-medium border-gray-700 border-2 bg-red-400 p-2"
          type="submit"
        >
          Register
        </button>

      </form>

    </div>

  </div>
);

       

}
export default RegisterPage;