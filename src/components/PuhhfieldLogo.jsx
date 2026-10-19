import React from 'react';

/**
 * PuhhfieldAi Official Logo Component
 * Vectorized from public/favicon.jpg → /logo-icon.svg (lime squircle) and /logo.svg (mark only)
 */
export function PuhhfieldLogo({
  className = "w-7 h-7",
  variant = "icon", // 'icon' (lime squircle) | 'mark' (mark only, inherits text color) | 'full' (icon + wordmark)
  textClassName = "text-base font-bold font-display"
}) {
  if (variant === 'full') {
    return (
      <div className="flex items-center gap-2.5 select-none">
        <img src={`${import.meta.env.BASE_URL}logo-icon.svg`} alt="PuhhfieldAi Logo" className={className} />
        <span className={`${textClassName} tracking-tight text-hf-text`}>
          Puhhfield<span className="text-hf-lime">Ai</span>
        </span>
      </div>
    );
  }

  if (variant === 'mark') {
    // Masked so the mark takes the current text color
    return (
      <span
        role="img"
        aria-label="PuhhfieldAi Mark"
        className={`inline-block bg-current ${className}`}
        style={{
          WebkitMask: `url(${import.meta.env.BASE_URL}logo.svg) center / contain no-repeat`,
          mask: `url(${import.meta.env.BASE_URL}logo.svg) center / contain no-repeat`
        }}
      />
    );
  }

  // Default: variant === 'icon'
  return <img src={`${import.meta.env.BASE_URL}logo-icon.svg`} alt="PuhhfieldAi Logo" className={className} />;
}

export default PuhhfieldLogo;
