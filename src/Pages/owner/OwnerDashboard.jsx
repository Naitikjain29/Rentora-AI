
import { Link } from "react-router-dom";
import {
  FiHome,
  FiCheckCircle,
  FiKey,
  FiInbox,
  FiPlus,
  FiGrid,
  FiUser,
  FiArrowRight,
  FiMapPin,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "../../Components/Navbar";

const statusStyles = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  rejected: "border-red-500/20 bg-red-500/10 text-red-400",
};

const OwnerDashboard = () => {
  const [name, setName] = useState("");
  const [properties, setProperties] = useState([]);
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
          api.get("/properties/my-properties"),
          api.get("/rental-requests/property-requests"),
        ]);

      if (profileRes.status === "fulfilled") {
        setName(profileRes.value.data.user?.fullName || "");
      }

      if (propertiesRes.status === "fulfilled") {
        setProperties(propertiesRes.value.data.properties || []);
      }

      if (requestsRes.status === "fulfilled") {
        setRequests(
          requestsRes.value.data.rentalRequests || []
        );
      }
    } catch (error) {
      console.error("Owner dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  const stats = [
    {
      label: "My Properties",
      value: properties.length,
      Icon: FiHome,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Available",
      value: properties.filter(
        (property) => property.status === "available"
      ).length,
      Icon: FiCheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Rented",
      value: properties.filter(
        (property) => property.status === "rented"
      ).length,
      Icon: FiKey,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Requests",
      value: pendingRequests.length,
      Icon: FiInbox,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Owner Panel */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              OWNER PANEL
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Here's how your properties are doing.
            </p>
          </div>

          <Link
            to="/owner/properties/add"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 sm:self-auto"
          >
            <FiPlus size={17} />
            Add Property
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
                to="/owner/properties/add"
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FiPlus size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Add a New Property
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      List a property for rent
                    </p>
                  </div>
                </div>

                <FiArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-400" />
              </Link>

              <Link
                to="/owner/properties"
                className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <FiGrid size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Manage My Properties
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Edit and manage your listings
                    </p>
                  </div>
                </div>

                <FiArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-400" />
              </Link>
            </section>

            {/* Properties and Requests */}
            <section className="mt-10 grid gap-8 lg:grid-cols-3">

              {/* My Properties */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      My Properties
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Overview of your rental listings
                    </p>
                  </div>

                  <Link
                    to="/owner/properties"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    View all
                  </Link>
                </div>

                {properties.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                    <FiHome
                      size={28}
                      className="mx-auto text-slate-600"
                    />

                    <p className="mt-3 text-sm text-slate-400">
                      You haven't listed any properties yet.
                    </p>

                    <Link
                      to="/owner/properties/add"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Add your first property
                      <FiArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {properties.slice(0, 4).map((property) => (
                      <div
                        key={property._id}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/40 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0">
                          <h3 className="font-semibold">
                            {property.title}
                          </h3>

                          <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <FiMapPin size={14} />
                            {property.location}
                          </p>

                          <span
                            className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${
                              property.status === "available"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : property.status === "rented"
                                  ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                  : "border-slate-700 bg-slate-800 text-slate-400"
                            }`}
                          >
                            {property.status}
                          </span>
                        </div>

                        <p className="shrink-0 text-lg font-bold">
                          ₹{Number(property.price).toLocaleString("en-IN")}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / month
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Requests */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold">
                    Pending Requests
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Rental applications awaiting your review
                  </p>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                    <FiInbox
                      size={28}
                      className="mx-auto text-slate-600"
                    />

                    <p className="mt-3 text-sm text-slate-400">
                      No pending requests right now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.slice(0, 3).map((request) => (
                      <div
                        key={request._id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                      >
                        <h3 className="text-sm font-semibold">
                          {request.propertyId?.title || "Rental Property"}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <FiUser size={13} />
                          {request.userId?.fullName || "User"}
                        </p>

                        <span
                          className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                            statusStyles[request.status] ||
                            "border-slate-700 bg-slate-800 text-slate-300"
                          }`}
                        >
                          {request.status}
                        </span>

                        <Link
                          to="/owner/requests"
                          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold transition hover:bg-indigo-500"
                        >
                          Review Request
                          <FiArrowRight size={14} />
                        </Link>
                      </div>
                    ))}

                    <Link
                      to="/owner/requests"
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

export default OwnerDashboard;
