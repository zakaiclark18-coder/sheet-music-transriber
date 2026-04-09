import "./globals.css";

export const metadata = {
  title: "Sheet Music Transcriber",
  description: "Upload an MP3 and get sheet music back as MusicXML and a rendered preview.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
