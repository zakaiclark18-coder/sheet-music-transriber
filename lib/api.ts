export type TranscriptionResponse = {
  job_id: string;
  instrument: string;
  original_filename: string;
  note_count: number;
  duration_seconds: number;
  transpose_semitones: number;
  preview_musicxml_url: string;
  download_musicxml_url: string;
  download_midi_url: string;
};

export const INSTRUMENTS = [
  "Piano",
  "Guitar",
  "Violin",
  "Alto Saxophone",
  "Flute",
  "Trumpet",
  "Cello",
] as const;

export type Instrument = (typeof INSTRUMENTS)[number];

export function backendUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }
  return url.replace(/\/$/, "");
}

export async function transcribeAudio(file: File, instrument: Instrument): Promise<TranscriptionResponse> {
  const formData = new FormData();
  formData.append("audio", file);
  formData.append("instrument", instrument);

  const res = await fetch(`${backendUrl()}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Transcription failed");
  }

  return (await res.json()) as TranscriptionResponse;
}

export function absoluteBackendUrl(path: string) {
  return `${backendUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
