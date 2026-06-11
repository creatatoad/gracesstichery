const src = {
  color: "/logo.svg", // full-color mark — use on cream/light backgrounds
  dark: "/logo-dark.svg", // single-color ink — small sizes, print
  white: "/logo-white.svg", // for dark backgrounds
} as const;

export default function Logo({
  className = "h-12",
  variant = "color",
}: {
  className?: string;
  variant?: keyof typeof src;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src[variant]}
      alt="Grace's Stitchery, Custom Embroidery"
      className={className}
    />
  );
}
