import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { libraryService } from "@/lib/library-integration";

export default function ARScanner() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookMatch, setBookMatch] = useState<any>(null);

  const capture = async () => {
    if (webcamRef.current) {
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setLoading(true);
      setError(null);
      setResult(null);
      setBookMatch(null); // Clear previous match
      try {
        const res = await fetch("/api/recognize-book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageSrc }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult(data.webDetection);
          // Try to extract a title/author guess
          const guess = data.webDetection?.bestGuessLabels?.[0]?.label || "";
          if (guess) {
            const matches = await libraryService.searchBooks(guess);
            if (matches.length > 0) {
              setBookMatch(matches[0]);
            } else {
              setBookMatch(null);
            }
          } else {
            setBookMatch(null);
          }
        } else {
          setError(data.error || "Recognition failed");
        }
      } catch (err: any) {
        setError(err.message || "Recognition failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: "100vw", height: "60vh" }}
      />
      <button onClick={capture} style={{ margin: "1rem" }} disabled={loading}>
        {loading ? "Scanning..." : "Scan Book Cover"}
      </button>
      {image && <img src={image} alt="Captured" style={{ width: 200, marginTop: 16 }} />}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div className="ar-overlay" style={{ background: "rgba(0,0,0,0.7)", color: "#fff", padding: 16, borderRadius: 8, marginTop: 16 }}>
          <h3>Recognition Result</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {bookMatch && (
        <div className="ar-overlay" style={{ background: "rgba(0,0,0,0.7)", color: "#fff", padding: 16, borderRadius: 8, marginTop: 16 }}>
          <img src={bookMatch.book.coverUrl} alt={bookMatch.book.title} style={{ width: 100, borderRadius: 8 }} />
          <h2>{bookMatch.book.title}</h2>
          <p>{bookMatch.book.author}</p>
          <p>Match: {Math.round(bookMatch.matchScore * 100)}%</p>
        </div>
      )}
    </div>
  );
} 