// import React, { useRef, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Confetti from "react-confetti";
// import { useWindowSize } from "react-use";
// import styles from "./Report.module.css";

// export const Report = ({ show, data, onClose }) => {
//   const reportRef = useRef(null);
//   const { width, height } = useWindowSize();
//   const [isExporting, setIsExporting] = useState(false);

//   const handleDownloadPDF = async () => {
//     setIsExporting(true); // Hide buttons while exporting
//     setTimeout(async () => {
//       if (reportRef.current) {
//         const canvas = await html2canvas(reportRef.current, { scale: 2 });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");

//         // Calculate the dimensions for the PDF
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save("report.pdf");
//       }
//       setIsExporting(false); // Restore buttons after export
//     }, 500);
//   };

//   if (!show) return null;

//   const { level, metrics, pros, cons, feedback } = data;

//   return (
//     <div className={styles.modal}>
//       <Confetti numberOfPieces={200} recycle={false} />
//       <div className={`${styles.report} ${styles.popIn}`} ref={reportRef}>
//         {!isExporting && (
//           <button className={styles.closeButton} onClick={onClose}>
//             &times;
//           </button>
//         )}
//         <h2>Performance Report</h2>
//         <div
//           className={styles.gradientBar}
//           style={{
//             "--level":
//               level === "Beginner" ? 25 : level === "Intermediate" ? 50 : 75,
//           }}
//         >
//           <div className={styles.levelMarker}>
//             <div className={styles.arrow}></div>
//           </div>
//           <div className={styles.level}>Level: {level}</div>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.metrics}>
//             <h3>Metrics</h3>
//             <ul>
//               {Object.entries(metrics).map(([key, value]) => (
//                 <li key={key}>
//                   <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
//                   {value}%
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className={styles.prosCons}>
//             <h3>Pros</h3>
//             <ul>
//               {pros.map((pro, index) => (
//                 <li key={index}>{pro}</li>
//               ))}
//             </ul>
//             <h3>Cons</h3>
//             <ul>
//               {cons.map((con, index) => (
//                 <li key={index}>{con}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         <div className={styles.feedback}>
//           <h3>Feedback</h3>
//           <p>{feedback}</p>
//         </div>
//         {!isExporting && ( // Conditionally render buttons
//           <div className={styles.actions}>
//             <button
//               className={styles.downloadButton}
//               onClick={handleDownloadPDF}
//             >
//               Download Report
//             </button>
//             <button className={styles.improveButton}>
//               Create Improvement Plan
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Report;

import React, { useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import styles from "./Report.module.css";

export const Report = ({ show, data, onClose, clearBlobUrl }) => {

  const navigate = useNavigate();
  const reportRef = useRef(null);
  const { width, height } = useWindowSize();
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      if (reportRef.current) {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
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

  const { level, metrics, pros, cons, feedback } = data;

  return (
    <div className={styles.modal}>
      <Confetti numberOfPieces={200} recycle={false} />
      <div className={`${styles.report} ${styles.popIn}`} ref={reportRef}>
        {!isExporting && (
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        )}
        <h2>Performance Report</h2>
        <div
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
        </div>
        <div className={styles.content}>
          <div className={styles.metrics}>
            <h3>Metrics</h3>
            <ul>
              {Object.entries(metrics).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {value}%
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.prosCons}>
            <h3>Pros</h3>
            <ul>
              {pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
            <h3>Cons</h3>
            <ul>
              {cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.feedback}>
          <h3>Feedback</h3>
          <p>{feedback}</p>
        </div>
        {!isExporting && (
          <div className={styles.actions}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadPDF}
            >
              Download Report
            </button>
            <button className={styles.improveButton}>
              Create Improvement Plan
            </button>
            <button className={styles.improveButton} onClick={()=>{navigate("/assess", { replace: true }); onClose(); clearBlobUrl();}}>
              Continue Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;

