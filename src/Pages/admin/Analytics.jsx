
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiHome,
  FiFileText,
  FiTrendingUp,
  FiActivity,
  FiArrowUpRight,
  FiRefreshCw,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { useState, useEffect } from "react";
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

const tabs = ["all", "pending", "approved", "rejected"];

const SummaryCard = ({ title, value, Icon, color, bg, description }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight">
          {Number(value || 0).toLocaleString("en-IN")}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        <Icon size={21} />
      </div>
    </div>

    <p className="mt-3 text-xs text-slate-500">{description}</p>
  </div>
);

const ProgressBar = ({ label, value, total, color }) => {
  const percentage =
    total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-semibold text-white">
          {value}
          <span className="ml-1 text-xs font-normal text-slate-500">
            ({percentage.toFixed(0)}%)
          </span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get("/admin/dashboard-stats");
      setStats(res.data.stats);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to load analytics"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const params = {};
      if (activeTab !== "all") {
        params.status = activeTab;
      }

      const res = await api.get("/admin/all-rental-requests", {
        params,
      });

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

  const properties = stats?.properties || {};
  const rentalStats = stats?.rentalRequests || {};

  const requestTotal = rentalStats.totalRentalRequests || 0;
  const propertyTotal = properties.totalProperties || 0;

  const requestSummary = [
    {
      label: "Pending",
      value: rentalStats.pendingRequests || 0,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      Icon: FiClock,
    },
    {
      label: "Approved",
      value: rentalStats.approvedRequests || 0,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      Icon: FiCheckCircle,
    },
    {
      label: "Rejected",
      value: rentalStats.rejectedRequests || 0,
      color: "text-red-400",
      bg: "bg-red-500/10",
      Icon: FiXCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wider text-indigo-400">
              ADMIN PANEL
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Platform Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Monitor properties, rental activity, and platform performance.
            </p>
          </div>

          <button
            onClick={() => {
              fetchStats();
              fetchRequests();
            }}
            disabled={loading || statsLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-indigo-500/40 hover:bg-slate-800 disabled:opacity-50 sm:self-auto"
          >
            <FiRefreshCw
              className={loading || statsLoading ? "animate-spin" : ""}
              size={16}
            />
            Refresh Analytics
          </button>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Properties"
            value={propertyTotal}
            Icon={FiHome}
            color="text-indigo-400"
            bg="bg-indigo-500/10"
            description="All listed properties"
          />

          <SummaryCard
            title="Available Properties"
            value={properties.availableProperties || 0}
            Icon={FiCheckCircle}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
            description="Currently available to rent"
          />

          <SummaryCard
            title="Total Requests"
            value={requestTotal}
            Icon={FiFileText}
            color="text-blue-400"
            bg="bg-blue-500/10"
            description="All rental applications"
          />

          <SummaryCard
            title="Pending Requests"
            value={rentalStats.pendingRequests || 0}
            Icon={FiClock}
            color="text-amber-400"
            bg="bg-amber-500/10"
            description="Awaiting a decision"
          />
        </section>

        {/* Analytics charts */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* Property status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Property Overview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Breakdown by listing status
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FiHome size={19} />
              </div>
            </div>

            {statsLoading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading property statistics...
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold">
                    {propertyTotal}
                  </span>
                  <span className="mb-1 text-sm text-slate-500">
                    total properties
                  </span>
                </div>

                <ProgressBar
                  label="Available"
                  value={properties.availableProperties || 0}
                  total={propertyTotal}
                  color="bg-emerald-500"
                />

                <ProgressBar
                  label="Rented"
                  value={properties.rentedProperties || 0}
                  total={propertyTotal}
                  color="bg-amber-500"
                />

                <ProgressBar
                  label="Inactive"
                  value={properties.inactiveProperties || 0}
                  total={propertyTotal}
                  color="bg-slate-500"
                />
              </div>
            )}
          </div>

          {/* Request status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Rental Request Overview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Application status distribution
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FiActivity size={19} />
              </div>
            </div>

            {statsLoading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading request statistics...
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold">
                    {requestTotal}
                  </span>
                  <span className="mb-1 text-sm text-slate-500">
                    total requests
                  </span>
                </div>

                <ProgressBar
                  label="Pending"
                  value={rentalStats.pendingRequests || 0}
                  total={requestTotal}
                  color="bg-amber-500"
                />

                <ProgressBar
                  label="Approved"
                  value={rentalStats.approvedRequests || 0}
                  total={requestTotal}
                  color="bg-emerald-500"
                />

                <ProgressBar
                  label="Rejected"
                  value={rentalStats.rejectedRequests || 0}
                  total={requestTotal}
                  color="bg-red-500"
                />
              </div>
            )}
          </div>
        </section>

        {/* Request summary */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Request Status Summary</h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick look at the current rental application outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {requestSummary.map(({ label, value, color, bg, Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                  </div>
                </div>

                <FiArrowUpRight className="text-slate-600" size={20} />
              </div>
            ))}
          </div>
        </section>

        {/* All rental requests */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">All Rental Requests</h2>
              <p className="mt-1 text-sm text-slate-400">
                Review rental activity across the platform.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
              {requests.length} {requests.length === 1 ? "request" : "requests"}
            </span>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const selected = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium capitalize transition ${
                    selected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                      : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Requests list */}
          <div className="mt-4">
            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-14 text-center">
                <FiRefreshCw
                  className="mx-auto animate-spin text-indigo-400"
                  size={22}
                />
                <p className="mt-3 text-sm text-slate-400">
                  Loading rental requests...
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                  <FiFileText size={22} />
                </div>

                <h3 className="mt-4 font-semibold">No requests found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  There are no {activeTab === "all" ? "" : `${activeTab} `}
                  rental requests to display.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => {
                  const style =
                    statusStyles[req.status] || statusStyles.pending;
                  const StatusIcon = style.Icon;

                  return (
                    <article
                      key={req._id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold">
                              {req.propertyId?.title || "Property unavailable"}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${style.bg} ${style.text} ${style.border}`}
                            >
                              <StatusIcon size={13} />
                              {req.status || "unknown"}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:gap-4">
                            <span className="flex items-center gap-1.5">
                              <FiUser size={13} />
                              Renter: {req.userId?.fullName || "Unknown"}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <FiHome size={13} />
                              Owner: {req.ownerId?.fullName || "Unknown"}
                            </span>

                            {req.propertyId?.location && (
                              <span className="flex items-center gap-1.5">
                                <FiMapPin size={13} />
                                {req.propertyId.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400 md:self-center">
                          <FiFileText size={14} />
                          Rental application
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          Rentora AI · Platform Analytics
        </footer>
      </main>
    </div>
  );
};

export default Analytics;
