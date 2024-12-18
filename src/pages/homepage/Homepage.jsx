import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveAs } from "file-saver";
import Report from "../report/Report";
// import Confetti from "react-confetti";
import styles from "./Homepage.module.css";
import backgroundImage from "../../assets/background.jpg"; 

const Homepage = () => {
  const questions = [
    "Tell us about yourself?",
    "What is your view on remote work culture?",
    "How do you stay updated with the industry trends?",
    "What inspired you to choose your career path?",
  ];
  const dummyData = {
    level: "Intermediate",
    metrics: {
      fluency: 75,
      clarity: 65,
      engagement: 80,
    },
    pros: ["Clear pronunciation", "Good vocabulary"],
    cons: ["Inconsistent pace", "Needs more confidence"],
    feedback:
      "Overall good communication. Focus on maintaining a steady pace and improving confidence.",
  };

  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [plotImage, setPlotImage] = useState(null);

  const [reportData, setReportData] = useState(null);
  // const [showConfetti, setShowConfetti] = useState(false);
  const [showReport, setShowReport] = useState(false);

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
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex]);
  }, []);

  const handleSubmit = async (mediaBlobUrl) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("video", blob, "recorded-video.mp4");

      const serverResponse = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReport(serverResponse.data.report);
      setReportData(serverResponse.data.report);
      setPlotImage(`data:image/png;base64,${serverResponse.data.plot}`);
      setIsSubmitted(true);
      // setShowConfetti(true);
      // setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (data, fileName, fileType) => {
    const blob = new Blob([data], { type: fileType });
    saveAs(blob, fileName);
  };

  return (
    <div className={styles.container}
    >
      <header className={styles.header}>
        <h1>Communication Assessment Tool</h1>
        <p>Enhance your communication skills through AI-driven feedback.</p>
      </header>
      <div className={styles.proceedButton} onClick={()=>navigate("/assess")}>Dive Into Assessment</div>
     

      {/* {isSubmitted && report && (
        <section className={styles.resultSection}>
          <h2>Analysis Report</h2>
          <p>
            <strong>Summary:</strong>{" "}
            {report.summary || "Generated successfully."}
          </p>
          <p>
            <strong>Confidence:</strong> {report.confidence}
          </p>
          <p>
            <strong>Duration:</strong> {report.duration}
          </p>

          {plotImage && (
            <img
              src={plotImage}
              alt="Analysis Plot"
              className={styles.plotImage}
            />
          )}

          <div className={styles.resultButtons}>
            <button
              onClick={() =>
                handleDownload(
                  JSON.stringify(report, null, 2),
                  "report.json",
                  "application/json"
                )
              }
              className={styles.secondaryButton}
            >
              Download Report
            </button>
            {plotImage && (
              <button
                onClick={() =>
                  handleDownload(plotImage, "plot.png", "image/png")
                }
                className={styles.secondaryButton}
              >
                Download Plot
              </button>
            )}
          </div>
        </section>
      )} */}
      {/* {isSubmitted && reportData && <Report data={reportData} />} */}
      
      {/* {showConfetti && <Confetti />} */}
    </div>
  );
};

export default Homepage;
