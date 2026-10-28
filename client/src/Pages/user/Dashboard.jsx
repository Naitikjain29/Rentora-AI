
import { Link } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiSearch,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../Services/api";
import Navbar from "../../Components/Navbar";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Dashboard = () => {
  const [name, setName] = useState("");
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [latestProperties, setLatestProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [profileRes, propertiesRes, requestsRes] =
        await Promise.allSettled([
          api.get("/users/my-profile"),
          api.get("/properties/all-properties", {
            params: { limit: 3, status: "available" },
          }),
          api.get("/rental-requests/my-requests"),
        ]);

      if (profileRes.status === "fulfilled") {
        setName(profileRes.value.data.user?.fullName || "");
      }

      if (propertiesRes.status === "fulfilled") {
        setLatestProperties(
          propertiesRes.value.data.properties || []
        );
        setTotalAvailable(
          propertiesRes.value.data.totalProperties || 0
        );
      }

      if (requestsRes.status === "fulfilled") {
        setRequests(
          requestsRes.value.data.rentalRequests || []
        );
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const countBy = (status) =>
    requests.filter((request) => request.status === status).length;

  const stats = [
    {
      label: "Available Properties",
      value: totalAvailable,
      Icon: FiHome,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "My Requests",
      value: requests.length,
      Icon: FiFileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending",
      value: countBy("pending"),
      Icon: FiClock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Approved",
      value: countBy("approved"),
      Icon: FiCheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* User Panel - Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              USER PANEL
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Here's a quick look at your rental activity.
            </p>
          </div>

          <Link
            to="/user/properties"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 sm:self-auto"
          >
            <FiSearch size={16} />
            Find a Property
          </Link>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-center">
            <p className="text-sm text-slate-400">
              Loading your dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, Icon, color, bg }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <p className="mt-4 text-3xl font-bold">
                    {value}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </section>

            {/* Quick Actions */}
            <section className="mt-6 grid gap-4 md:grid-cols-2">
              <Link
                to="/user/properties"
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FiSearch size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Browse Properties
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Explore homes available for rent
                    </p>
                  </div>
                </div>

                <FiArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-400" />
              </Link>

              <Link
                to="/user/recommended"
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <FiZap size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      AI Recommendations
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Discover properties that suit you
                    </p>
                  </div>
                </div>

                <FiArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-400" />
              </Link>
            </section>

            {/* Latest Properties and Recent Requests */}
            <section className="mt-10 grid gap-8 lg:grid-cols-3">

              {/* Latest Properties */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      Latest Properties
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Recently added rental properties
                    </p>
                  </div>

                  <Link
                    to="/user/properties"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    View all
                  </Link>
                </div>

                {latestProperties.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                    <FiHome
                      size={28}
                      className="mx-auto text-slate-600"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      No properties available yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {latestProperties.map((property) => (
                      <Link
                        key={property._id}
                        to={`/user/properties/${property._id}`}
                        className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/40 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0">
                          <h3 className="font-semibold">
                            {property.title}
                          </h3>

                          <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <FiMapPin size={14} />
                            {property.location}
                          </p>

                          {property.categoryId?.categoryName && (
                            <span className="mt-3 inline-block rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                              {property.categoryId.categoryName}
                            </span>
                          )}
                        </div>

                        <p className="shrink-0 text-lg font-bold text-white">
                          ₹{Number(property.price).toLocaleString("en-IN")}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / month
                          </span>
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Requests */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold">
                    Recent Requests
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Track your rental applications
                  </p>
                </div>

                {requests.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                    <FiFileText
                      size={28}
                      className="mx-auto text-slate-600"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      You haven't sent any requests yet.
                    </p>

                    <Link
                      to="/user/properties"
                      className="mt-4 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Browse properties
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.slice(0, 3).map((request) => (
                      <div
                        key={request._id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                      >
                        <h3 className="text-sm font-semibold">
                          {request.propertyId?.title || "Rental Property"}
                        </h3>

                        <span
                          className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                            statusStyles[request.status] ||
                            "border-slate-700 bg-slate-800 text-slate-300"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                    ))}

                    <Link
                      to="/user/requests"
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 py-3 text-sm font-medium text-indigo-400 transition hover:bg-slate-900"
                    >
                      View all requests
                      <FiArrowRight size={15} />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
