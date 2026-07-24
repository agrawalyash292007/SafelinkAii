export default function Background() {
  return (
    <>
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-50 bg-[#030712]" />

      {/* Blue Glow */}
      <div className="fixed left-1/2 top-0 -z-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[180px]" />

      {/* Purple Glow */}
      <div className="fixed bottom-0 right-0 -z-40 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[160px]" />

      {/* Grid */}
      <div
        className="fixed inset-0 -z-30 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </>
  );
}