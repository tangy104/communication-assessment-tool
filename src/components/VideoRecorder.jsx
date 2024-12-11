import { ReactMediaRecorder } from "react-media-recorder";

const VideoRecorder = () => (
  <ReactMediaRecorder
    video
    render={({ startRecording, stopRecording, mediaBlobUrl }) => (
      <div>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <video src={mediaBlobUrl} controls autoPlay />
      </div>
    )}
  />
);
