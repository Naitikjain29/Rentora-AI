
import {
  FiMapPin,
  FiHome,
  FiUser,
  FiPhone,
  FiMail,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
} from "react-icons/fi";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api, { imageUrl } from "../../Services/api";
import Navbar from "../../Components/Navbar";

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  // Slider state
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/properties/get-property/${id}`);
      setProperty(res.data.property);
      setActiveImage(0);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const images = property?.images || [];
  const totalImages = images.length;

  // Automatically change image every 2 seconds
  useEffect(() => {
    if (totalImages <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % totalImages);
    }, 2000);

    return () => clearInterval(interval);
  }, [totalImages, id]);

  const nextImage = () => {
    if (totalImages > 1) {
      setActiveImage((prev) => (prev + 1) % totalImages);
    }
  };

  const previousImage = () => {
    if (totalImages > 1) {
      setActiveImage((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const generateSummary = async () => {
    try {
      setSummarizing(true);

      const res = await api.get(`/ai/summary/${id}`);
      setSummary(res.data.summary || "");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to generate summary");
    } finally {
      setSummarizing(false);
    }
  };

  const sendRequest = async () => {
    try {
      setSending(true);

      const requestData = {
        propertyId: id,
      };

      if (message.trim()) {
        requestData.message = message.trim();
      }

      const res = await api.post(
        "/rental-requests/send-request",
        requestData
      );

      toast.success(res.data.msg || "Rental Request Sent Successfully");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm text-slate-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
        {/* Property Image Slider */}
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-2 sm:p-3">
          <div className="group relative h-64 overflow-hidden rounded-2xl bg-slate-800 sm:h-[400px] lg:h-[470px]">
            {totalImages > 0 ? (
              <img
                key={images[activeImage]}
                src={imageUrl(images[activeImage])}
                alt={`${property.title} - Image ${activeImage + 1}`}
                className="h-full w-full object-cover transition-opacity duration-700 ease-in-out"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                <FiHome size={54} />
                <p className="text-sm">No property images available</p>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Category badge */}
            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-indigo-300 backdrop-blur-md sm:left-6 sm:top-6">
              {property.categoryId?.categoryName || "Property"}
            </div>

            {/* Image counter */}
            {totalImages > 0 && (
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-3 py-2 text-xs font-medium backdrop-blur-md sm:right-6 sm:top-6">
                <FiImage />
                {activeImage + 1} / {totalImages}
              </div>
            )}

            {/* Navigation arrows */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-indigo-600 sm:left-5 sm:h-12 sm:w-12"
                >
                  <FiChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-indigo-600 sm:right-5 sm:h-12 sm:w-12"
                >
                  <FiChevronRight size={24} />
                </button>
              </>
            )}

            {/* Property title */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
              <p className="flex items-center gap-2 text-sm text-slate-200">
                <FiMapPin className="shrink-0 text-indigo-400" />
                {property.location}
              </p>

              <h1 className="mt-2 text-xl font-bold drop-shadow-lg sm:text-3xl">
                {property.title}
              </h1>
            </div>
          </div>

          {/* Clickable thumbnails */}
          {totalImages > 1 && (
            <div className="flex gap-3 overflow-x-auto px-1 py-3 sm:py-4">
              {images.map((img, index) => (
                <button
                  type="button"
                  key={`${img}-${index}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-32 ${
                    activeImage === index
                      ? "border-indigo-500 ring-2 ring-indigo-500/20"
                      : "border-slate-700 opacity-60 hover:border-slate-500 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imageUrl(img)}
                    alt={`Property thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Details and owner section */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: Property details */}
          <div className="min-w-0 lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold text-indigo-400">
                    {property.categoryId?.categoryName || "Property"}
                  </span>

                  <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                    Property Overview
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <FiMapPin className="shrink-0 text-indigo-400" />
                    {property.location}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                    property.status === "available"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {property.status}
                </span>
              </div>

              {/* Property stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-center sm:p-5">
                  <FiHome className="mx-auto mb-2 text-indigo-400" size={19} />
                  <p className="text-xl font-bold">{property.bedRooms}</p>
                  <p className="mt-1 text-xs text-slate-500">Bedrooms</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-center sm:p-5">
                  <FiZap className="mx-auto mb-2 text-indigo-400" size={19} />
                  <p className="text-xl font-bold">{property.bathRooms}</p>
                  <p className="mt-1 text-xs text-slate-500">Bathrooms</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-center sm:p-5">
                  <FiHome className="mx-auto mb-2 text-indigo-400" size={19} />
                  <p className="text-xl font-bold">{property.area}</p>
                  <p className="mt-1 text-xs text-slate-500">Sq.ft</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-7 border-t border-slate-800 pt-6">
                <h3 className="text-base font-semibold">About this property</h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-400">
                  {property.description}
                </p>
              </div>
            </div>

            {/* AI Summary */}
            <section className="mt-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.09] to-violet-500/[0.03] p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    <FiZap size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold">AI Property Summary</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Get a quick overview of this listing.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={summarizing}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {summarizing ? "Generating..." : "Generate Summary"}
                </button>
              </div>

              {summary && (
                <p className="mt-5 rounded-xl border border-indigo-500/10 bg-slate-950/50 p-4 text-sm leading-7 text-slate-300">
                  {summary}
                </p>
              )}
            </section>
          </div>

          {/* Right: Owner and rental request */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/10">
              {/* Price */}
              <div className="border-b border-slate-800 bg-gradient-to-br from-indigo-500/10 to-transparent p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Monthly rent
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-slate-500">
                    {" "}/ month
                  </span>
                </p>
              </div>

              {/* Owner details */}
              <div className="p-5 sm:p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Property owner
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <FiUser size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">
                      {property.ownerId?.fullName || "Property Owner"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Property Owner
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {property.ownerId?.email && (
                    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <FiMail className="mt-0.5 shrink-0 text-indigo-400" />
                      <span className="break-all text-xs leading-5 text-slate-400">
                        {property.ownerId.email}
                      </span>
                    </div>
                  )}

                  {property.ownerId?.phone && (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <FiPhone className="shrink-0 text-indigo-400" />
                      <span className="text-xs text-slate-400">
                        {property.ownerId.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rental request */}
                {property.status === "available" ? (
                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <h3 className="font-semibold">
                      Interested in this home?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Send a request to the owner to get started.
                    </p>

                    <textarea
                      rows={4}
                      placeholder="Write a message for the owner (optional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-4 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={sendRequest}
                      disabled={sending}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-950/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? "Sending Request..." : "Send Rental Request"}
                      {!sending && <FiChevronRight />}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">
                      No payment is required to send a request.
                    </p>
                  </div>
                ) : (
                  <p className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center text-sm capitalize text-slate-400">
                    This property is currently {property.status}.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
