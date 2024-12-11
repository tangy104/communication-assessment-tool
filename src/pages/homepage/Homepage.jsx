import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import { saveAs } from "file-saver";

const Homepage = () => {
  const questions = [
    "Tell us about yourself?",
    "What is your view on remote work culture?",
    "How do you stay updated with the industry trends?",
    "What inspired you to choose your career path?",
  ];

  const [question, setQuestion] = useState("");
  //   const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [plotImage, setPlotImage] = useState(null);

  const {
    status,
    startRecording,
    stopRecording,
    clearBlobUrl,
    mediaBlobUrl,
    previewStream,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    onStop: (blobUrl) => console.log("Recording stopped", blobUrl),
  });

  useEffect(() => {
    // Select a random question on load
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex]);
  }, []);

  const handleSubmit = async (mediaBlobUrl) => {
    try {
      // Fetch the Blob from the URL
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      console.log("Blob:", blob);

      // Create FormData and append the Blob
      const formData = new FormData();
      formData.append("video", blob, "recorded-video.mp4");

      // Send FormData to the server
      const serverResponse = await axios.post(
        // "http://15.207.223.131:8000/analyze",
        "/api/analyze",

        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setReport(serverResponse.data.report); // Assuming report is a string or a PDF URL
      setPlotImage(`data:image/png;base64,${serverResponse.data.plot}`); // Decode plot image
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error analyzing video:", error);
    }
  };

  const handleDownloadReport = () => {
    if (report) {
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "report.json");
    }
  };

  const handleDownloadPlot = () => {
    if (plotImage) {
      const link = document.createElement("a");
      link.href = plotImage; // `plotImage` already contains the Base64 data URI
      link.download = "plot.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Communication Assessment</h2>
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <strong>Question:</strong> {question}
      </div>

      <>
        <div>status:{status}</div>
        {previewStream && !mediaBlobUrl && (
          <div>
            <video
              ref={(ref) => {
                if (ref) {
                  ref.srcObject = previewStream;
                }
              }}
              autoPlay
              muted
              playsInline
              width="100%"
            />
          </div>
        )}
        {mediaBlobUrl && (
          <div>
            <h5>Recorded Media</h5>
            <video src={mediaBlobUrl} controls width="100%" />
            <button
              onClick={() => handleSubmit(mediaBlobUrl)}
              style={{ margin: "5px" }}
            >
              Submit to Analyze
            </button>
            <a href={mediaBlobUrl} download="media.mp4">
              <button> Download Recording</button>
            </a>
          </div>
        )}
        <div>
          <button
            onClick={startRecording}
            disabled={status === "recording"}
            style={{ margin: "5px" }}
          >
            Start Recording
          </button>

          <>
            <button
              onClick={stopRecording}
              disabled={!status === "recording"}
              style={{ margin: "5px" }}
            >
              Stop Recording
            </button>
            {mediaBlobUrl && (
              <button
                onClick={() => {
                  stopRecording(); // Stop current recording
                  clearBlobUrl(); // Clear the recorded media
                  setTimeout(() => startRecording(), 500); // Restart after delay
                }}
                style={{ margin: "5px" }}
              >
                Re-record
              </button>
            )}
          </>
        </div>
      </>

      {isSubmitted && report && (
        <div style={{ marginTop: "20px" }}>
          <h3>Analysis Report</h3>
          <p>{report.summary || "Report generated successfully."}</p>
          {plotImage && (
            <div>
              <img src={plotImage} alt="Generated Plot" />
            </div>
          )}
          <button onClick={handleDownloadReport} style={{ margin: "5px" }}>
            Download Report
          </button>
          <button onClick={handleDownloadPlot} style={{ margin: "5px" }}>
            Download Plot
          </button>
        </div>
      )}
    </div>
  );
};

export default Homepage;
