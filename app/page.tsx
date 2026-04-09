import UploadForm from "@/components/UploadForm";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10">
      <div className="grid w-full gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-black/20 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Audio transcription</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tight">Turn MP3s into sheet music.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Backend runs on Hugging Face Spaces with FastAPI and Basic Pitch. Frontend runs on Vercel with Next.js App Router and Tailwind.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Upload an MP3</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Select piano, guitar, violin, alto saxophone, flute, trumpet, or cello</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Download MusicXML and preview the score inline</div>
          </div>
        </section>

        <section className="self-center">
          <UploadForm />
        </section>
      </div>
    </main>
  );
}
