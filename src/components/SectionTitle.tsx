type SectionTitleProps = {
  title: string;
  subtitle: string;
  variant?: "default" | "light";
};

export default function SectionTitle({ title, subtitle, variant = "default" }: SectionTitleProps) {
  const isLight = variant === "light";

  return (
    <div className="mb-12 text-center">
      <p className={`mb-2 text-sm font-bold tracking-[0.3em] uppercase ${isLight ? "text-white/70" : "text-accent-blue"}`}>
        {subtitle}
      </p>
      <h2 className={`text-2xl font-bold sm:text-3xl md:text-4xl ${isLight ? "text-white" : "text-pop-text"}`}>{title}</h2>
      <div className={`mx-auto mt-4 h-1 w-20 rounded-full ${isLight ? "bg-white/40" : "bg-main-gradient"}`} />
    </div>
  );
}
