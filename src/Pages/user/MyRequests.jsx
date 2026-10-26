
import {
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiHome,
  FiRefreshCw,
  FiArrowUpRight,
  FiInbox,
} from "react-icons/fi";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Navbar from "../../Components/Navbar";

const statusStyles = {
  pending: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    Icon: FiClock,
  },
  approved: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    Icon: FiCheckCircle,
  },
  rejected: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    Icon: FiXCircle,
  },
};

const MyRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await api.get("/rental-requests/my-requests");
      setRequests(res.data.rentalRequests || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.msg || "Failed to load requests"
        );
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = requests.filter(
    (req) => req.status === "pending"
  ).length;

  const approvedCount = requests.filter(
    (req) => req.status === "approved"
  ).length;

  const rejectedCount = requests.filter(
    (req) => req.status === "rejected"
  ).length;

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
              <FiFileText size={15} />
              Rental Activity
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Requests
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Track your rental applications and stay updated on the
              status of your requested properties.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-indigo-500/50 hover:text-white disabled:opacity-50 sm:self-auto"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              size={15}
            />
            Refresh
          </button>
        </div>

        {/* Hero summary */}
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-xl text-indigo-300">
                <FiHome />
              </div>

              <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                Your rental journey
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                Every request brings you one step closer to finding
                your next home.
              </p>
            </div>

            <div className="sm:min-w-36 sm:text-right">
              <p className="text-sm text-slate-400">Total applications</p>
              <p className="mt-1 text-5xl font-bold tracking-tight">
                {requests.length}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                All your rental requests in one place
              </p>
            </div>
          </div>
        </section>

        {/* Status cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            count={requests.length}
            Icon={FiFileText}
            color="indigo"
          />

          <StatCard
            title="Pending"
            count={pendingCount}
            Icon={FiClock}
            color="amber"
          />

          <StatCard
            title="Approved"
            count={approvedCount}
            Icon={FiCheckCircle}
            color="emerald"
          />

          <StatCard
            title="Rejected"
            count={rejectedCount}
            Icon={FiXCircle}
            color="red"
          />
        </section>

        {/* Request list heading and filters */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Application History</h2>
              <p className="mt-1 text-sm text-slate-500">
                View and track your submitted requests.
              </p>
            </div>

            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 p-1">
              {[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    filter === item.value
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
              <p className="mt-4 text-sm text-slate-400">
                Loading your applications...
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            /* Empty state */
            <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-2xl text-slate-500">
                <FiInbox />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {requests.length === 0
                  ? "No rental requests yet"
                  : `No ${filter} requests`}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {requests.length === 0
                  ? "Explore available properties and send a rental request to get started."
                  : `You don't have any ${filter} applications right now.`}
              </p>

              {requests.length === 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/user/properties")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
                >
                  Browse Properties
                  <FiArrowUpRight />
                </button>
              )}
            </div>
          ) : (
            /* Request cards */
            <div className="mt-6 space-y-4">
              {filteredRequests.map((req) => {
                const status = statusStyles[req.status] || statusStyles.pending;
                const StatusIcon = status.Icon;
                const property = req.propertyId;

                return (
                  <article
                    key={req._id}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80 sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                      {/* Property information */}
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-xl text-indigo-400 transition group-hover:border-indigo-500/30">
                          <FiHome />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-base font-semibold transition group-hover:text-indigo-300 sm:text-lg">
                              {property?.title || "Property unavailable"}
                            </h3>
                          </div>

                          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                            <FiMapPin className="shrink-0 text-indigo-400" size={14} />
                            <span className="break-words">
                              {property?.location || "Location unavailable"}
                            </span>
                          </p>

                          <p className="mt-3 text-lg font-bold">
                            ₹{formatPrice(property?.price)}
                            <span className="ml-1 text-xs font-normal text-slate-500">
                              / month
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Status and action */}
                      <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold capitalize ${status.bg} ${status.text} ${status.border}`}
                        >
                          <StatusIcon size={14} />
                          {req.status || "pending"}
                        </span>

                        {property?._id && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/user/properties/${property._id}`)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-indigo-400"
                          >
                            View Property
                            <FiArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          Rentora AI · Manage your rental journey with ease.
        </footer>
      </main>
    </div>
  );
};

const colorStyles = {
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-400",
    number: "text-indigo-300",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-400",
    number: "text-amber-300",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-400",
    number: "text-emerald-300",
  },
  red: {
    icon: "bg-red-500/10 text-red-400",
    number: "text-red-300",
  },
};

const StatCard = ({ title, count, Icon, color }) => {
  const styles = colorStyles[color];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700 hover:bg-slate-900/80">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>

        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}>
          <Icon size={19} />
        </div>
      </div>

      <p className={`mt-4 text-3xl font-bold ${styles.number}`}>
        {count}
      </p>
    </div>
  );
};

export default MyRequests;
