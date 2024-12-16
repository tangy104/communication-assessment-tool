import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import { saveAs } from "file-saver";
import Report from "../report/Report";
// import Confetti from "react-confetti";
import styles from "./Assess.module.css";

const Assess = () => {
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

  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [plotImage, setPlotImage] = useState(null);

  const [reportData, setReportData] = useState(null);
  // const [showConfetti, setShowConfetti] = useState(false);
  const [showReport, setShowReport] = useState(false);
  // const [showReport, setShowReport] = useState(true);

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

    const response = await fetch(mediaBlobUrl);
    console.log("Response:", response); // Debug: Ensure response is received

    const blob = await response.blob();
    console.log("Blob:", blob); // Debug: Ensure blob is created properly

    // Create a File object from the Blob
    const file = new File([blob], "recorded-video.mp4", {
      type: "video/mp4",
    });
    console.log("Video file:", file); // Debug: Ensure file is created properly
    console.log("Video file name:", file.name); // Debug: Ensure file is created properly

    const formData = new FormData();
    formData.append("video", file, file.name);

    // Debugging: Check FormData contents
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // Ensure 'video' key and File object are present
    }
    console.log("Form data hehe:", formData);

    try {
      // const airesponse = await axios.post("/api/analyze", formData, {
      const airesponse = await axios.post(
        "http://13.233.194.6:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      console.log("Response:", airesponse.data); // Debug: Ensure response is received

      // setReport(responseData.data);
      setReportData(airesponse.data);
      // // setPlotImage(`data:image/png;base64,${serverResponse.data.plot}`);
      setIsSubmitted(true);
      // setShowConfetti(true);
      // setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setReportDataFunc = () => {
    setReportData(null);
  };
  const setUploadingFunc = () => {
    setUploading(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      setUploadStatus("Please select a video file to upload.");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("video", videoFile, videoFile.name);
    console.log("Video file:", videoFile);
    console.log("Video file name:", videoFile.name);
    console.log("Form data:", formData);

    try {
      const response = await axios.post(
        // "http://localhost:8000/analyze",
        // "/api/analyze",
        "http://13.233.194.6:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      console.log("Upload response:", response.data);

      setReportData(response.data);
      setUploadStatus(
        `Upload successful: ${response.data || "Video analyzed successfully!"}`
      );
      setUploading(false);
      setIsUploaded(true);
      // setShowReport(true);
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus(
        `Upload failed: ${error.response?.data || error.message}`
      );
    }
  };

  const handleDownload = (data, fileName, fileType) => {
    const blob = new Blob([data], { type: fileType });
    saveAs(blob, fileName);
  };

  return (
    <div className={styles.container}>
      <section className={styles.questionSection}>
        <div className={styles.questionCard}>
          <h1>Question</h1>
          {question}
        </div>
      </section>

      <section className={styles.recorderSection}>
        {/* <h2>Record Your Answer</h2> */}
        <div className={styles.recorderContainer}>
          {previewStream && !mediaBlobUrl && (
            <video
              className={styles.previewVideo}
              ref={(ref) => ref && (ref.srcObject = previewStream)}
              autoPlay
              muted
              playsInline
            />
          )}
          {mediaBlobUrl && (
            <video
              className={styles.recordedVideo}
              src={mediaBlobUrl}
              controls
            />
          )}

          <div className={styles.buttonGroup}>
            {mediaBlobUrl ? (
              <button
                onClick={() => {
                  stopRecording();
                  clearBlobUrl();
                  startRecording();
                }}
                className={styles.secondaryButton}
              >
                Re-record
              </button>
            ) : (
              <button
                onClick={
                  status === "recording" ? stopRecording : startRecording
                }
                className={
                  status === "recording"
                    ? styles.secondaryButton
                    : styles.primaryButton
                }
              >
                {status === "recording" ? "Stop Recording" : "Start Recording"}
              </button>
            )}
          </div>
          <div
            style={{
              backgroundColor: "#252627",
              margin: "5px",
              padding: "6px",
              borderRadius: "22px",
            }}
          >
            <form onSubmit={handleUpload}>
              <label styles={{ backgroundColor: "red" }}>
                Select Recorded Video:
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileChange}
                />
              </label>
              {isUploaded && reportData ? (
                <button
                  onClick={() => setShowReport(true)}
                  className={styles.secondaryButton}
                >
                  Show Report
                </button>
              ) : (
                <button
                  className={`${styles.primaryButton} ${
                    uploading ? styles.loading : ""
                  }`}
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    "Upload For Analysis"
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {mediaBlobUrl && (
        <section className={styles.submitSection}>
          {isSubmitted && reportData ? (
            <button
              onClick={() => setShowReport(true)}
              className={styles.secondaryButton}
            >
              Show Report
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(mediaBlobUrl)}
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit for Analysis"}
            </button>
          )}
          <a
            href={mediaBlobUrl}
            download="recording.mp4"
            className={styles.downloadLink}
          >
            Download Recording
          </a>
        </section>
      )}

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
      <div>
        {showReport ? (
          <Report
            show={showReport}
            data={reportData}
            onClose={() => setShowReport(false)}
            clearBlobUrl={clearBlobUrl}
            setReportDataFunc={setReportDataFunc}
            setUploadingFunc={setUploadingFunc}
          />
        ) : null}
      </div>

      {/* {showConfetti && <Confetti />} */}
    </div>
  );
};

export default Assess;

// import React, { useState } from "react";
// import axios from "axios";

// const VideoUpload = () => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");

//   const handleFileChange = (event) => {
//     setVideoFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!videoFile) {
//       setUploadStatus("Please select a video file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("video", videoFile, videoFile.name);
//     console.log("Video file:", videoFile);
//     console.log("Video file name:", videoFile.name);
//     console.log("Form data:", formData);

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/analyze",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Accept: "application/json",
//           },
//         }
//       );
//       console.log("Upload response:", response.data);

//       setUploadStatus(
//         `Upload successful: ${response.data || "Video analyzed successfully!"}`
//       );
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       setUploadStatus(
//         `Upload failed: ${error.response?.data || error.message}`
//       );
//     }
//   };

//   return (
//     <div>
//       <h1>Upload Video</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Select MP4 Video:
//           <input type="file" accept="video/mp4" onChange={handleFileChange} />
//         </label>
//         <button type="submit">Upload</button>
//       </form>
//       {uploadStatus && <p>{uploadStatus}</p>}
//     </div>
//   );
// };

// export default VideoUpload;
