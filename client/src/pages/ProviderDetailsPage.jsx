import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function ProviderDetailsPage() {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);

  const [bookingData, setBookingData] = useState({
    serviceDate: "",
    address: "",
    problemDescription: "",
  });

  const [reviews, setReviews] = useState([]);

  const [reviewData, setReviewData] = useState({
    rating: "",
    comment: "",
  });

  useEffect(() => {
    fetchProvider();
    fetchReviews();
  }, []);

  const fetchProvider = async () => {
    try {
      const res = await API.get(`/providers/${id}`);

      setProvider(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);

      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const bookService = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.post(
        "/bookings",
        {
          providerId: provider._id,
          serviceDate: bookingData.serviceDate,
          address: bookingData.address,
          problemDescription: bookingData.problemDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Booking created successfully");

      setBookingData({
        serviceDate: "",
        address: "",
        problemDescription: "",
      });
    } catch (error) {
      console.log(error);

      alert("Booking failed");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.post(
        "/reviews",
        {
          providerId: provider._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Review added successfully");

      setReviewData({
        rating: "",
        comment: "",
      });

      fetchReviews();
      fetchProvider();
    } catch (error) {
      console.log(error);

      alert("Review failed");
    }
  };

  if (!provider) {
    return (
      <div className="bg-slate-950 min-h-screen flex justify-center items-center">
        <h2 className="text-white text-2xl">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen flex justify-center p-8">
      <div className="bg-slate-800 rounded-xl shadow-xl p-8 w-full max-w-3xl">
        <div className="bg-slate-700 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {provider.user.name}
              </h1>

              <p className="text-xl text-blue-400 mt-1">
                {provider.profession}
              </p>
            </div>

            <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
              ⭐ {provider.averageRating}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400">Location</p>
              <p className="text-white">📍 {provider.location}</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400">Experience</p>
              <p className="text-white">🛠 {provider.experience} Years</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400">Hourly Rate</p>
              <p className="text-green-400 font-semibold">
                ₹{provider.hourlyRate}/hr
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400">Reviews</p>
              <p className="text-white">{provider.totalReviews} Reviews</p>
            </div>
          </div>

          {provider.skills?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Skills</h3>

              <div className="flex flex-wrap gap-2">
                {provider.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 px-3 py-1 rounded-full text-white text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {provider.bio && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">About</h3>

              <p className="text-slate-300">{provider.bio}</p>
            </div>
          )}
        </div>

        <hr className="border-slate-600 mb-6" />

        <h2 className="text-2xl font-semibold text-white mb-4">Book Service</h2>

        <form onSubmit={bookService} className="space-y-4">
          <input
            type="date"
            name="serviceDate"
            value={bookingData.serviceDate}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 text-white"
          />

          <input
            type="text"
            name="address"
            value={bookingData.address}
            placeholder="Enter address"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 text-white"
          />

          <textarea
            name="problemDescription"
            value={bookingData.problemDescription}
            placeholder="Describe problem"
            rows="4"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Book Service
          </button>
        </form>

        <hr className="border-slate-600 my-8" />

        <h2 className="text-2xl font-semibold text-white mb-4">Reviews</h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-slate-700 p-4 rounded-lg">
              <p className="text-yellow-400 font-semibold">
                ⭐ {review.rating}
              </p>

              <p className="text-white mt-2">{review.comment}</p>

              <p className="text-slate-400 text-sm mt-2">
                By: {review.customer?.name}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Write Review
        </h2>

        <form onSubmit={submitReview} className="space-y-4">
          <input
            type="number"
            min="1"
            max="5"
            name="rating"
            value={reviewData.rating}
            onChange={handleReviewChange}
            placeholder="Rating (1-5)"
            className="w-full p-3 rounded-lg bg-slate-700 text-white"
          />

          <textarea
            name="comment"
            value={reviewData.comment}
            onChange={handleReviewChange}
            placeholder="Write your review"
            rows="4"
            className="w-full p-3 rounded-lg bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProviderDetailsPage;
