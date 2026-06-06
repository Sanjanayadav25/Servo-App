import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProviders();
  }, [page]);

  const fetchProviders = async () => {
    try {
      const res = await API.get(
        `/providers?profession=${profession}&location=${location}&sort=${sort}&page=${page}&limit=6`
      );

      setProviders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProviders();
  };

  return (
    <div className="bg-slate-950 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Service Providers
      </h1>

      {/* Filter Section */}
      <div className="bg-slate-800 p-5 rounded-xl mb-8 flex flex-wrap gap-4 shadow-lg">

        <input
          type="text"
          placeholder="Profession"
          value={profession}
          onChange={(e) =>
            setProfession(e.target.value)
          }
          className="p-3 rounded bg-slate-700 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="p-3 rounded bg-slate-700 text-white outline-none"
        />

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="p-3 rounded bg-slate-700 text-white"
        >
          <option value="">
            Sort By Rate
          </option>

          <option value="lowToHigh">
            Low To High
          </option>

          <option value="highToLow">
            High To Low
          </option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium"
        >
          Search
        </button>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition duration-300"
          >

            <div className="flex justify-between items-start mb-4">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {provider.user.name}
                </h2>

                <p className="text-blue-400 font-medium">
                  {provider.profession}
                </p>
              </div>

              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {provider.averageRating}
              </div>

            </div>

            <div className="space-y-2 mb-5">

              <p className="text-slate-300">
                📍 {provider.location}
              </p>

              <p className="text-green-400 font-semibold">
                ₹{provider.hourlyRate}/hr
              </p>

              <p className="text-slate-400">
                {provider.experience} Years Experience
              </p>

              <p className="text-slate-400">
                {provider.totalReviews} Reviews
              </p>

            </div>

            <Link
              to={`/providers/${provider._id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg block text-center font-medium transition"
            >
              View Details
            </Link>

          </div>
        ))}

      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12 pb-6">

        <button
          onClick={() =>
            setPage((prev) =>
              prev > 1 ? prev - 1 : 1
            )
          }
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
        >
          Previous
        </button>

        <span className="text-white font-medium">
          Page {page}
        </span>

        <button
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default ProvidersPage;