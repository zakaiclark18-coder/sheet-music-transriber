"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Music3, ArrowLeft } from "lucide-react";
import ScoreViewer from "@/components/ScoreViewer";
import type { TranscriptionResponse } from "@/lib/api";

export default function ResultPage() {
  const [result, setResult] = useState<TranscriptionResponse | null>(null);
  const [xml, setXml] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const raw = sessionStorage.getItem("transcription_result");
    if (!raw) {
      setError("No transcription found. Go back and upload a file.");
      return;
    }

    const parsed = JSON.parse(raw) as TranscriptionResponse;
    setResult(parsed);

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
    if (!backend) {
      setError("NEXT_PUBLIC_BACKEND_URL is not set");
      return;
    }
    fetch(`${backend}${parsed.preview_musicxml_url}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load MusicXML preview");
        return res.text();
      })
      .then(setXml)
      .catch((err) => setError(err instanceof Error ? err.message : "Preview failed"));
  }, []);

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-red-200">{error}</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-blue-200 hover:text-blue-100">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-200">Loading...</div>
      </main>
    );
  }

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";
  const midiUrl = `${backend}${result.download_midi_url}`;
  const xmlUrl = `${backend}${result.download_musicxml_url}`;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-blue-100">
          <ArrowLeft className="h-4 w-4" />
          New transcription
        </Link>
        <div className="text-sm text-slate-300">
          {result.original_filename} · {result.instrument} · {result.note_count} notes
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-2 text-blue-200">
            <Music3 className="h-5 w-5" />
            Transcription complete
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your sheet music is ready.</h1>

          <dl className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Instrument</dt>
              <dd className="font-medium text-white">{result.instrument}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Duration</dt>
              <dd className="font-medium text-white">{result.duration_seconds.toFixed(2)} sec</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Transposition</dt>
              <dd className="font-medium text-white">{result.transpose_semitones} semitones</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Notes detected</dt>
              <dd className="font-medium text-white">{result.note_count}</dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-3">
            <a href={xmlUrl} download className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400">
              <Download className="h-4 w-4" />
              Download MusicXML
            </a>
            <a href={midiUrl} download className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              <Download className="h-4 w-4" />
              Download MIDI
            </a>
          </div>
        </section>

        <section className="space-y-4">
          {xml ? <ScoreViewer xml={xml} /> : <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">Rendering score...</div>}
        </section>
      </div>
    </main>
  );
}
