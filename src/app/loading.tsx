export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="font-serif text-2xl md:text-3xl tracking-tight">
          rxxuzi.com
        </div>
      </div>
    </div>
  )
}
