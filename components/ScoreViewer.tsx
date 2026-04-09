"use client";

import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

type Props = {
  xml: string;
};

export default function ScoreViewer({ xml }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;

      try {
        containerRef.current.innerHTML = "";
        const osmd = new OpenSheetMusicDisplay(containerRef.current, {
          drawingParameters: "compact",
          autoResize: true,
        });
        osmdRef.current = osmd;
        await osmd.load(xml);
        if (!cancelled) {
          await osmd.render();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not render MusicXML");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [xml]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20">
      {error ? (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}
      <div ref={containerRef} className="overflow-x-auto rounded-2xl bg-white text-black" />
    </div>
  );
}
