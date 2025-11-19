import { useEffect } from "react";

function App() {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@google/generative-ai/embed/iframe.js";
    script.onload = () => {
      const assistant = (window as any).ai.iframe.create({
        element: document.getElementById("assistant"),
        assistantId: "315550636662",
        apiKey: "AIzaSyCENKrIphUGX_bA7XgcqqInVc_ZhkA3TY"
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>مساعد أكاديمية نور للجمباز</h1>
      <div id="assistant" style={{ width: "100%", height: "600px" }}></div>
    </div>
  );
}

export default App;
