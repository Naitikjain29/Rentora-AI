
import {
  FiUsers,
  FiHome,
  FiGrid,
  FiFileText,
  FiArrowRight,
  FiActivity,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../Services/api";
import Navbar from "../../Components/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/dashboard-stats");
      setStats(res.data.stats);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to load dashboard stats"
      );
    } finally {
      setLoading(false);
    }
  };

  const groups = stats
    ? [
        {
          title: "Users",
          description: "Manage users and property owners",
          Icon: FiUsers,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
          items: [
            {
              label: "Total Users",
              value: stats.users?.totalUsers || 0,
            },
            {
              label: "Total Owners",
              value: stats.users?.totalOwners || 0,
            },
          ],
        },
        {
          title: "Categories",
          description: "Organize property categories",
          Icon: FiGrid,
          color: "text-violet-400",
          bg: "bg-violet-500/10",
          items: [
            {
              label: "Total Categories",
              value: stats.categories?.totalCategories || 0,
            },
          ],
        },
        {
          title: "Properties",
          description: "Monitor all property listings",
          Icon: FiHome,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          items: [
            {
              label: "Total Properties",
              value: stats.properties?.totalProperties || 0,
            },
            {
              label: "Available",
              value: stats.properties?.availableProperties || 0,
            },
            {
              label: "Rented",
              value: stats.properties?.rentedProperties || 0,
            },
            {
              label: "Inactive",
              value: stats.properties?.inactiveProperties || 0,
            },
          ],
        },
        {
          title: "Rental Requests",
          description: "Track rental application statuses",
          Icon: FiFileText,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          items: [
            {
              label: "Total Requests",
              value: stats.rentalRequests?.totalRentalRequests || 0,
            },
            {
              label: "Pending",
              value: stats.rentalRequests?.pendingRequests || 0,
            },
            {
              label: "Approved",
              value: stats.rentalRequests?.approvedRequests || 0,
            },
            {
              label: "Rejected",
              value: stats.rentalRequests?.rejectedRequests || 0,
            },
          ],
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-400">
              ADMIN PANEL
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Here's an overview of everything happening on Rentora AI.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium transition hover:border-indigo-500/50 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <FiActivity size={16} />
            {loading ? "Refreshing..." : "Refresh Stats"}
          </button>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
            <p className="mt-4 text-sm text-slate-400">
              Loading dashboard statistics...
            </p>
          </div>
        ) : stats ? (
          <>
            {/* Summary Cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {groups.map(({ title, Icon, color, bg, items }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold">{title}</h2>
                      <p className="text-xs text-slate-500">
                        {items.length}{" "}
                        {items.length === 1 ? "metric" : "metrics"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-sm text-slate-400">
                          {item.label}
                        </span>

                        <span className="text-lg font-bold tabular-nums">
                          {Number(item.value).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Quick Navigation */}
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-bold">Quick Navigation</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Manage Users",
                    description: "View and manage platform accounts",
                    path: "/admin/users",
                    Icon: FiUsers,
                  },
                  {
                    title: "Manage Categories",
                    description: "Organize property categories",
                    path: "/admin/categories",
                    Icon: FiGrid,
                  },
                  {
                    title: "Manage Properties",
                    description: "Review all property listings",
                    path: "/admin/properties",
                    Icon: FiHome,
                  },
                ].map(({ title, description, path, Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Icon size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>

                    <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-400" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Rental Request Summary */}
            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <FiFileText size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">Rental Requests Overview</h2>
                  <p className="text-xs text-slate-500">
                    Current status of rental applications
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Pending",
                    value: stats.rentalRequests?.pendingRequests || 0,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10",
                  },
                  {
                    label: "Approved",
                    value: stats.rentalRequests?.approvedRequests || 0,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    label: "Rejected",
                    value: stats.rentalRequests?.rejectedRequests || 0,
                    color: "text-red-400",
                    bg: "bg-red-500/10",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <p className="font-medium">Unable to load dashboard statistics.</p>
            <p className="mt-2 text-sm text-slate-400">
              Check your connection and try again.
            </p>
            <button
              onClick={fetchStats}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-500"
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;