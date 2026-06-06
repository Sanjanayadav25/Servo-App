import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Find Trusted Service Providers Near You
        </h1>

        <p className="text-slate-400 text-xl mb-8">
          Book electricians, plumbers, carpenters and more with ease.
        </p>

        <Link
          to="/providers"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          Browse Providers
        </Link>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Electrician */}
          <div className="bg-slate-800 p-8 rounded-2xl text-center shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 transition duration-300">
            <div className="text-6xl mb-4">⚡</div>

            <h3 className="text-2xl font-bold text-white mb-3">Electrician</h3>

            <p className="text-slate-400">
              Wiring, switch repairs, fan installation, lighting solutions and
              electrical maintenance.
            </p>
          </div>

          {/* Plumber */}
          <div className="bg-slate-800 p-8 rounded-2xl text-center shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-300">
            <div className="text-6xl mb-4">🚿</div>

            <h3 className="text-2xl font-bold text-white mb-3">Plumber</h3>

            <p className="text-slate-400">
              Pipe repairs, leak fixing, bathroom fittings, water tank
              installation and maintenance.
            </p>
          </div>

          {/* Carpenter */}
          <div className="bg-slate-800 p-8 rounded-2xl text-center shadow-lg hover:shadow-amber-500/20 hover:-translate-y-2 transition duration-300">
            <div className="text-6xl mb-4">🪚</div>

            <h3 className="text-2xl font-bold text-white mb-3">Carpenter</h3>

            <p className="text-slate-400">
              Furniture repair, custom woodwork, cabinet installation and home
              improvements.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose ServiceHub?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>

            <p className="text-slate-400">
              Trusted professionals with verified profiles.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>

            <p className="text-slate-400">
              Book services in just a few clicks.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>

            <p className="text-slate-400">
              Choose providers based on real ratings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
