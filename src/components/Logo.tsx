/* Renders public/logo.svg — drop the real logo file in to replace it. */
export default function Logo({ className = "h-12" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="Grace's Stitchery — Custom Embroidery" className={className} />;
}
