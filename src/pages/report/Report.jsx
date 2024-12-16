import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
// import { useWindowSize } from "react-use";
import styles from "./Report.module.css";

import dummyData from "./dummyData";

export const Report = ({
  show = false,
  data = dummyData,
  onClose,
  clearBlobUrl,
  setReportDataFunc,
  setUploadingFunc,
}) => {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const improvementRef = useRef(null); // Reference for scrolling
  // const { width, height } = useWindowSize();
  const [isExporting, setIsExporting] = useState(false);
  const [decodedImages, setDecodedImages] = useState({
    mfccs: null,
    zcr: null,
    error_density: null,
    wps: null,
    avg_pause: null,
    punc_acc: null,
  });

  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [improvementPlan, setImprovementPlan] = useState(null);

  console.log("Data in report", data);

  const { json_data, json_data2 } = data ? data : dummyData;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      if (reportRef.current) {
        const canvas = await html2canvas(reportRef.current, {
          scale: 2, // Higher scale for better image resolution
          width: reportRef.current.scrollWidth, // Ensure entire width is captured
          height: reportRef.current.scrollHeight, // Ensure entire height is captured
          x: 0,
          y: 0,
          useCORS: true, // Useful if there are cross-origin images
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("report.pdf");
      }
      setIsExporting(false);
    }, 500);
  };

  if (!show) return null;

  const decodeBase64Image = (base64Str) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Str}`;
    return img;
  };

  // useEffect(() => {
  //   if (!json_data) return; // Ensure json_data exists
  //   try {
  //     const decodedImgs = {
  //       mfccs: decodeBase64Image(json_data.mfccs?.[1] || ""),
  //       zcr: decodeBase64Image(json_data.zcr?.[1] || ""),
  //       error_density: decodeBase64Image(json_data.error_density?.[1] || ""),
  //       wps: decodeBase64Image(json_data.wps?.[1] || ""),
  //       avg_pause: decodeBase64Image(json_data.avg_pause?.[1] || ""),
  //       punc_acc: decodeBase64Image(json_data.punc_acc?.[0] || ""),
  //     };
  //     setDecodedImages(decodedImgs);
  //   } catch (error) {
  //     console.error("Error in decoding images:", error);
  //   }
  // }, [json_data]);

  const handleCreateImprovementPlan = () => {
    setIsLoadingPlan(true);
    setTimeout(() => {
      setIsLoadingPlan(false);
      setImprovementPlan(json_data2.improvement_plan); // Set new content
    }, 2000); // Simulate a 2-second delay
  };

  useEffect(() => {
    if (!improvementPlan || !improvementRef.current) return;
    improvementRef.current.scrollIntoView({ behavior: "smooth" });
  }, [improvementPlan, improvementRef]);

  // Always call hooks in the same order
  useEffect(() => {
    if (!json_data) {
      setDecodedImages(null);
      return;
    }

    try {
      const decodedImgs = {
        mfccs: decodeBase64Image(json_data.mfccs?.[1] || ""),
        zcr: decodeBase64Image(json_data.zcr?.[1] || ""),
        error_density: decodeBase64Image(json_data.error_density?.[1] || ""),
        wps: decodeBase64Image(json_data.wps?.[1] || ""),
        avg_pause: decodeBase64Image(json_data.avg_pause?.[1] || ""),
        punc_acc: decodeBase64Image(json_data.punc_acc?.[0] || ""),
      };
      setDecodedImages(decodedImgs);
    } catch (error) {
      console.error("Error in decoding images:", error);
    }
  }, [json_data]);

  // const { level, metrics, pros, cons, feedback } = dummyData;

  return (
    <div className={styles.modal} ref={reportRef}>
      <Confetti numberOfPieces={200} recycle={false} />
      <div className={`${styles.report} ${styles.popIn}`}>
        {!isExporting && (
          <button
            className={styles.closeButton}
            onClick={() => {
              onClose();
              clearBlobUrl();
              setReportDataFunc();
              setUploadingFunc();
            }}
          >
            &times;
          </button>
        )}
        <h2>Performance Report</h2>
        {/* <div
          className={styles.gradientBar}
          style={{
            "--level":
              level === "Beginner" ? 25 : level === "Intermediate" ? 50 : 75,
          }}
        >
          <div className={styles.levelMarker}>
            <div className={styles.arrow}></div>
          </div>
          <div className={styles.level}>Level: {level}</div>
        </div> */}
        <div className={styles.content}>
          <div className={styles.metrics}>
            <h2>Metrics</h2>
            {/* <ul>
              {Object.entries(json_data).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {value}%
                </li>
              ))}
            </ul> */}

            {/* <h1>Video Analysis Report</h1> */}

            <div className={styles.dataContainer1}>
              <div className={styles.dataSection}>
                <h3>MFCCs (Mel Frequency Cepstral Coefficients)</h3>
                <p>{json_data.mfccs[0]}</p>
                <img
                  // style={{ height: "10px", width: "10px" }}
                  src={decodedImages.mfccs?.src}
                  alt="MFCCs Visualization"
                />
              </div>

              <div className={styles.dataSection}>
                <h3>ZCR (Zero Crossing Rate)</h3>
                <p>{json_data.zcr[0]}</p>
                <img
                  // style={{ height: "10px", width: "10px" }}
                  src={decodedImages.zcr?.src}
                  alt="ZCR Visualization"
                />
              </div>

              <div className={styles.dataSection}>
                <h3>Error Density</h3>
                <p>{json_data.error_density[0]}</p>
                <img
                  // style={{ height: "10px", width: "10px" }}
                  src={decodedImages.error_density?.src}
                  alt="Error Density Visualization"
                />
              </div>
            </div>
            <div className={styles.dataContainer1}>
              <div className={styles.dataSection}>
                <h3>WPS (Word Per Second)</h3>
                <p>{json_data.wps[0]}</p>
                <img
                  // style={{ height: "10px", width: "10px" }}
                  src={decodedImages.wps?.src}
                  alt="WPS Visualization"
                />
              </div>

              <div className={styles.dataSection}>
                <h3>Avg Pause Duration</h3>
                <p>{json_data.avg_pause[0]}</p>
                <img
                  // style={{ height: "10px", width: "10px" }}
                  src={decodedImages.avg_pause?.src}
                  alt="Avg Pause Visualization"
                />
              </div>

              <div className={styles.dataSection}>
                <h3>Punctuation Accuracy</h3>
                {/* <p>{json_data.punc_acc}</p> */}
                <img
                  // style={{ height: "10px", width: "10px" }}
                  src={decodedImages.punc_acc?.src}
                  alt="Punctuation Accuracy Visualization"
                />
              </div>
            </div>
          </div>
          <div className={styles.prosCons}>
            <h3>Pros</h3>
            {/* <ul>
              {pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul> */}
            {json_data2.pros}
            <h3>Cons</h3>
            {/* <ul>
              {cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul> */}
            {json_data2.cons}
          </div>
        </div>
        <div className={styles.feedback}>
          <h3>Feedback</h3>
          <p>{json_data2.summary}</p>
        </div>
        {improvementPlan && (
          <div ref={improvementRef} className={styles.feedback}>
            <h3>Improvement Plan</h3>
            <p>{improvementPlan}</p>
          </div>
        )}
        {!isExporting && (
          <div className={styles.actions}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadPDF}
            >
              Download Report
            </button>

            <button
              className={`${styles.improveButton} ${
                isLoadingPlan ? styles.loading : ""
              }`}
              onClick={handleCreateImprovementPlan}
              disabled={isLoadingPlan} // Disable button while loading
            >
              {isLoadingPlan ? (
                <div className={styles.spinner}></div>
              ) : (
                "Create Improvement Plan"
              )}
            </button>

            <button
              className={styles.improveButton}
              onClick={() => {
                navigate("/assess", { replace: true });
                onClose();
                clearBlobUrl();
                setReportDataFunc();
                setUploadingFunc();
              }}
            >
              Continue Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
