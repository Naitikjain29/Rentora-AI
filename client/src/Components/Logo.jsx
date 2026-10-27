const Logo = ({
  size = 48,
  showText = true,
  tagline = "",
  className = "",
  textClassName = "text-white",
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Rentora AI logo"
      >
        {/* Background */}
        <rect
          width="96"
          height="96"
          rx="24"
          fill="#4F46E5"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />

        {/* Roof */}
        <path
          d="M16 54 L48 26 L80 54"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* House body */}
        <path
          d="M26 48 V78 H70 V48"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* AI spark */}
        <path
          d="M48 52 L51.5 60.5 L60 64 L51.5 67.5 L48 76 L44.5 67.5 L36 64 L44.5 60.5 Z"
          fill="#FBBF24"
        />
      </svg>

      {showText && (
        <div className="leading-tight">
          <h2 className={`text-2xl font-bold tracking-tight ${textClassName}`}>
            Rentora <span className="text-indigo-400">AI</span>
          </h2>
          {tagline && <p className="text-xs text-white/60">{tagline}</p>}
        </div>
      )}
    </div>
  );
};

export default Logo;