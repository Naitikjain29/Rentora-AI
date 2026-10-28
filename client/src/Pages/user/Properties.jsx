
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
  FiArrowUpRight,
  FiSliders,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../Services/api";
import Navbar from "../../Components/Navbar";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [requirement, setRequirement] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Carousel state
  const [activeSlides, setActiveSlides] = useState({});
  const carouselInterval = useRef(null);
  const hoveredProperty = useRef(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/all-categories");
        const data = res.data;

        let list = Array.isArray(data)
          ? data
          : Array.isArray(data.category)
          ? data.category
          : Array.isArray(data.categories)
          ? data.categories
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.allCategories)
          ? data.allCategories
          : [];

        list = list.filter(
          (cat) => !cat.status || cat.status === "active"
        );

        setCategories(list.slice(0, 4));
      } catch (error) {
        console.error(
          "Category fetch error:",
          error.response?.data || error.message
        );
      }
    };

    fetchCategories();
  }, []);

  // Fetch Properties
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProperties();
    }, 400);

    return () => clearTimeout(delay);
  }, [filters, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = { page, limit: 6 };

      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await api.get("/properties/all-properties", {
        params,
      });

      setProperties(
        Array.isArray(res.data.properties)
          ? res.data.properties
          : []
      );

      setTotalPages(Math.max(1, res.data.totalPages || 1));
    } catch (error) {
      if (error.response?.status === 404) {
        setProperties([]);
        setTotalPages(1);
      } else {
        toast.error(
          error.response?.data?.msg || "Failed to load properties"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Start carousel on hover
  const startCarousel = (property) => {
    const images = property.images || [];

    if (images.length <= 1) return;

    clearInterval(carouselInterval.current);
    hoveredProperty.current = property._id;

    carouselInterval.current = setInterval(() => {
      setActiveSlides((prev) => {
        const currentIndex = prev[property._id] || 0;

        return {
          ...prev,
          [property._id]: (currentIndex + 1) % images.length,
        };
      });
    }, 1800);
  };

  // Stop carousel when mouse leaves
  const stopCarousel = (propertyId) => {
    if (hoveredProperty.current !== propertyId) return;

    clearInterval(carouselInterval.current);
    carouselInterval.current = null;
    hoveredProperty.current = null;
  };

  // Clean up carousel timer
  useEffect(() => {
    return () => {
      clearInterval(carouselInterval.current);
    };
  }, []);

  // AI Search
  const analyzeWithAI = async () => {
    if (!requirement.trim()) {
      toast.error("Please describe what you are looking for");
      return;
    }

    try {
      setAnalyzing(true);

      const res = await api.post("/ai/analyse-requirement", {
        requirement,
      });

      const ai = res.data.filters || {};

      const matched = categories.find(
        (cat) =>
          ai.categoryHint &&
          cat.categoryName
            .toLowerCase()
            .includes(ai.categoryHint.toLowerCase())
      );

      setFilters({
        search: ai.location || "",
        categoryId: matched ? matched._id : "",
        minPrice: ai.minPrice ?? "",
        maxPrice: ai.maxPrice ?? "",
      });

      setPage(1);
      toast.success("Filters applied");
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "AI could not analyze your request"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Update filters
  const changeFilter = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  // Reset all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
    });

    setRequirement("");
    setPage(1);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#070816] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-950 via-[#11112b] to-slate-950 px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-200">
              <FiHome />
              Your next chapter starts here
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find a place
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                you'll love to call home.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Discover properties that fit your lifestyle and budget.
              Explore listings and find your next home with Rentora-AI.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#property-listings"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                Explore Properties
                <FiArrowRight />
              </a>

              <a
                href="#ai-search"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <FiZap className="text-violet-300" />
                Try AI Search
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-300 sm:text-sm">
              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400" />
                Easy property discovery
              </span>

              <span className="flex items-center gap-2">
                <FiShield className="text-indigo-300" />
                Convenient online browsing
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[35%] items-end justify-center lg:flex">
            <div className="mb-10 mr-10 flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border border-indigo-300/20 bg-gradient-to-br from-indigo-500/30 to-violet-500/10 shadow-2xl shadow-indigo-500/10">
                <FiHome size={66} className="text-indigo-200" />
              </div>
            </div>
          </div>
        </section>

        {/* AI Search */}
        <section
          id="ai-search"
          className="mt-8 rounded-3xl border border-violet-400/20 bg-gradient-to-r from-violet-500/[0.09] to-indigo-500/[0.05] p-5 sm:p-7"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
                  <FiZap size={18} />
                </span>
                RENTORA AI ASSISTANT
              </div>

              <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                Tell us what you're looking for
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Describe your ideal home and let AI apply matching filters.
              </p>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-500/10 sm:flex">
              <FiZap size={36} className="text-violet-300" />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="e.g. 2BHK near Andheri under 20000"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !analyzing) {
                  analyzeWithAI();
                }
              }}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090a1a] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
            />

            <button
              onClick={analyzeWithAI}
              disabled={analyzing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiZap />
              {analyzing ? "Analyzing..." : "Find with AI"}
            </button>
          </div>
        </section>

        {/* Property Listings */}
        <section id="property-listings" className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Explore your options
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Find your next home
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Browse rentals that match your needs.
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:border-indigo-400/40 hover:bg-white/5"
            >
              <FiSliders />
              Reset filters
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                name="search"
                placeholder="Search title or location..."
                value={filters.search}
                onChange={changeFilter}
                className="w-full rounded-xl border border-white/10 bg-[#090a1a] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60"
              />
            </div>

            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={changeFilter}
              className="min-w-0 rounded-xl border border-white/10 bg-[#090a1a] px-3 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/60"
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="minPrice"
              min="0"
              placeholder="Min Price (₹)"
              value={filters.minPrice}
              onChange={changeFilter}
              className="min-w-0 rounded-xl border border-white/10 bg-[#090a1a] px-3 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400/60"
            />

            <input
              type="number"
              name="maxPrice"
              min="0"
              placeholder="Max Price (₹)"
              value={filters.maxPrice}
              onChange={changeFilter}
              className="min-w-0 rounded-xl border border-white/10 bg-[#090a1a] px-3 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400/60"
            />
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
                >
                  <div className="h-52 bg-white/[0.06]" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 rounded bg-white/10" />
                    <div className="h-5 w-3/4 rounded bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-white/10" />
                    <div className="h-8 rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                <FiHome size={30} className="text-indigo-300" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No properties found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Try another location, adjust your budget, or reset the filters
                to explore more properties.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-500"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 mt-7 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Properties matching your search
                </p>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
                  Page {page} of {totalPages}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => {
                  const images = property.images || [];
                  const currentSlide = activeSlides[property._id] || 0;

                  return (
                    <Link
                      to={`/user/properties/${property._id}`}
                      key={property._id}
                      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0e20] transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-950/30"
                    >
                      {/* Hover Carousel */}
                      <div
                        className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-indigo-950/40"
                        onMouseEnter={() => startCarousel(property)}
                        onMouseLeave={() => stopCarousel(property._id)}
                      >
                        {images.length > 0 ? (
                          images.map((image, index) => (
                            <img
                              key={`${property._id}-${image}-${index}`}
                              src={imageUrl(image)}
                              alt={`${property.title} - image ${index + 1}`}
                              loading="lazy"
                              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
                                currentSlide === index
                                  ? "scale-105 opacity-100"
                                  : "scale-100 opacity-0"
                              }`}
                            />
                          ))
                        ) : (
                          <FiHome
                            size={44}
                            className="text-slate-600"
                          />
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                          {property.categoryId?.categoryName || "Property"}
                        </span>

                        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-semibold capitalize text-emerald-300 backdrop-blur-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {property.status || "Available"}
                        </span>

                        {images.length > 1 && (
                          <>
                            <span className="absolute bottom-14 right-4 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                              {currentSlide + 1} / {images.length}
                            </span>

                            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                              {images.map((_, index) => (
                                <span
                                  key={index}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    currentSlide === index
                                      ? "w-5 bg-white"
                                      : "w-1.5 bg-white/50"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}

                        <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                          <p className="text-xs text-white/90">
                            <FiMapPin className="mr-1 inline" />
                            {property.location}
                          </p>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-5">
                        <h3 className="line-clamp-1 text-lg font-semibold transition group-hover:text-indigo-300">
                          {property.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
                          {property.description ||
                            "Explore this rental property and discover your next home."}
                        </p>

                        <div className="mt-5 flex items-center gap-4 border-b border-white/[0.08] pb-4 text-xs text-slate-400">
                          <span>
                            <strong className="text-slate-200">
                              {property.bedRooms ?? "—"}
                            </strong>{" "}
                            Beds
                          </span>

                          <span className="h-4 w-px bg-white/10" />

                          <span>
                            <strong className="text-slate-200">
                              {property.bathRooms ?? "—"}
                            </strong>{" "}
                            Baths
                          </span>

                          {property.area != null && (
                            <>
                              <span className="h-4 w-px bg-white/10" />
                              <span>
                                <strong className="text-slate-200">
                                  {property.area}
                                </strong>{" "}
                                sq. ft.
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-4">
                          <div>
                            <p className="text-[11px] text-slate-500">
                              Monthly rent
                            </p>

                            <p className="mt-1 text-xl font-bold text-white">
                              ₹
                              {Number(property.price || 0).toLocaleString(
                                "en-IN"
                              )}
                              <span className="text-xs font-normal text-slate-500">
                                {" "}/mo
                              </span>
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition group-hover:text-violet-300">
                            View Details
                            <FiArrowUpRight />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && properties.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FiChevronLeft size={19} />
              </button>

              <span className="text-sm text-slate-400">
                Page <strong className="text-white">{page}</strong> of{" "}
                <strong className="text-white">{totalPages}</strong>
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FiChevronRight size={19} />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090a18]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p>
            © {new Date().getFullYear()} Rentora-AI. Find your next home, smarter.
          </p>

          <p className="flex items-center justify-center gap-1.5">
            Made for better home discovery
            <FiHome className="text-indigo-400" />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Properties;
