"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpFromLine, Loader2, Music2 } from "lucide-react";
import { INSTRUMENTS, type Instrument, transcribeAudio } from "@/lib/api";

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [instrument, setInstrument] = useState<Instrument>("Piano");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Choose an MP3 first.");
      return;
    }

    setLoading(true);
    try {
      const result = await transcribeAudio(file, instrument);
      sessionStorage.setItem("transcription_result", JSON.stringify(result));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-blue-200">
          <Music2 className="h-4 w-4" />
          MP3 to sheet music
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Transcribe audio into MusicXML</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Upload a song, pick an instrument, and get downloadable sheet music with an on-page preview.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Audio file</span>
        <input
          type="file"
          accept=".mp3,audio/mpeg,audio/mp3,.wav,.m4a,.ogg,.flac,.aac"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-white/20"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Instrument</span>
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value as Instrument)}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-0"
        >
          {INSTRUMENTS.map((item) => (
            <option key={item} value={item} className="bg-slate-900">
              {item}
            </option>
          ))}
        </select>
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpFromLine className="h-4 w-4" />}
        {loading ? "Transcribing..." : "Upload and transcribe"}
      </button>
    </form>
  );
}
