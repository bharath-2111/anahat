import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";

const praiseQuotes = [
  "This cybersecurity UI is so clean! Powerful build. 🛡️",
  "I love the dark technical design here. Precise and minimal! ⚡",
  "The acoustic spectrum layout is pristine. Outstanding work! 👏",
  "FastAPI telemetry feels so smooth and modern. 🧈",
  "Operating inside a high-security defense terminal! 🔒",
  "AURA Voice Guard v2.4 initialized and operational. 🤖"
];

const idleThoughts = [
  "Standing by to analyze audio payload... 🎧",
  "Do you think neural classifiers dream of electric sheep? 🐑",
  "Ready to scan for voice spoofing when you are, Captain! 🫡",
  " *digital acoustic pulse scanning* 🎵",
  "Don't worry, keeping an eye on synthetic audio vectors. 👀"
];

export default function AIAssistant({
  stage: propStage,
  translate = false,
  notify = false,
  isSpeaking = false,
  isSelectingFile = false,
}) {
  const context = useAnalysis();
  
  // Map context status to assistant stage
  const stage = propStage || (
    context.analysisStatus === 'processing'
      ? 'processing'
      : context.analysisStatus === 'success'
      ? 'results'
      : context.analysisStatus === 'file-selected'
      ? 'file-selected'
      : 'idle'
  );

  const fileName = context.fileMetadata?.name || context.selectedFile?.name || null;
  const actionCount = context.analysisResult ? 1 : 0;

  const [thought, setThought] = useState("Initializing AURA Guard..."); 
  const [expression, setExpression] = useState("happy");
  const [isStationary, setIsStationary] = useState(false);
  
  const isMounted = useRef(false);

  // ----------------------------------------------------
  // 1. INITIAL PRAISE ON LOAD
  // ----------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setExpression("love");
      setThought("AURA Defense online 🛡️ This cybersecurity UI looks exceptionally clean.");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------------------
  // 2. PERIODIC RANDOM PRAISE / SECURITY THOUGHTS (Every 15s)
  // ----------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (stage === 'idle' && !isStationary && !isSpeaking && !isSelectingFile) {
        if (Math.random() > 0.4) {
          const randomPraise = praiseQuotes[Math.floor(Math.random() * praiseQuotes.length)];
          setExpression("happy");
          setThought(randomPraise);
        } else {
          const randomIdle = idleThoughts[Math.floor(Math.random() * idleThoughts.length)];
          setExpression("curious");
          setThought(randomIdle);
        }
      }
    }, 15000); 

    return () => clearInterval(interval);
  }, [stage, isStationary, isSpeaking, isSelectingFile]);

  // ----------------------------------------------------
  // 3. FILE SELECTION REACTION
  // ----------------------------------------------------
  useEffect(() => {
    if (isSelectingFile || stage === 'file-selected') {
      setExpression("excited");
      setThought("Audio payload received! Prepared to dispatch to FastAPI classifier. 🧐");
    }
  }, [isSelectingFile, stage]);

  // ----------------------------------------------------
  // 4. GLOBAL CLICK LISTENER (Empty Space Detection)
  // ----------------------------------------------------
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('.nano-bot-wrapper')) return; 

      const isInteractive = e.target.closest('button, input, a, .toggle-switch, .upload-main-card, select, textarea');

      if (!isInteractive) {
        setExpression("curious");
        setThought("Clicking on empty space? Calibrating pixel response... 🤭");
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [stage]);

  // ----------------------------------------------------
  // 5. TOGGLE & VOICE REACTIONS
  // ----------------------------------------------------
  useEffect(() => {
    if (isSpeaking) {
      setIsStationary(true);
      setExpression("excited");
      setThought("Whoa! Audio playback detected! Inspecting vocal harmonics 😲🔊");
    } else if (!isSpeaking && stage === 'results' && isMounted.current) {
      setExpression("happy");
      setThought("Playback finished. Reviewing detailed security report. 😅");
    }
  }, [isSpeaking, stage]);

  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (translate) {
      setExpression("excited");
      setThought("Multi-language security protocol activated! 🌍✨");
    } else {
      setExpression("happy");
      setThought("Standard security protocol restored. 🎩");
    }
  }, [translate]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (notify) {
      setExpression("love");
      setThought("Alert notifications armed! I'll dispatch reports instantly. 📨💨");
    } else {
      setExpression("sleep");
      setThought("Silent monitoring active. Keeping audit logs private. 🤫");
    }
  }, [notify]);

  // ----------------------------------------------------
  // 6. STAGE REACTIONS & FILE
  // ----------------------------------------------------
  useEffect(() => {
    if (stage === "processing") {
      setIsStationary(false);
      setExpression("dizzy");
      setThought(fileName ? `Analyzing acoustic features in ${fileName}... 🏎️` : "Processing voice features through neural classifier...");
    } else if (stage === "results") {
      setIsStationary(true);
      setExpression(actionCount > 0 ? "love" : "happy");
      setThought("Acoustic signal analysis complete! Review risk evaluation findings. 📊");
    } else if (stage === "error") {
      setIsStationary(true);
      setExpression("dizzy");
      setThought("Backend analysis connection failed. Check API endpoint and try again.");
    }
  }, [stage, actionCount, fileName]);

  // ----------------------------------------------------
  // 7. CLICK HANDLER (Apology / Interactive response)
  // ----------------------------------------------------
  const handleBotClick = () => {
    if (stage === "processing" && !isStationary) {
      setIsStationary(true);
      setExpression("sleep");
      setThought("Standing quiet so you can monitor the FastAPI processing stream. 🙈");
    } else {
      setExpression("love");
      setThought("Ticklish sensor! AURA Companion fully operational 😄");
    }
  };

  // ----------------------------------------------------
  // 8. ANIMATION VARIANTS (Framer Motion)
  // ----------------------------------------------------
  const roamVariants = {
    idle: { 
      y: [0, -10, 0], 
      x: 0,
      rotate: [0, 3, -3, 0],
      transition: { 
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 0.5 } 
      }
    },
    processing: {
      x: [0, -20, 20, -10, 0],
      y: [0, -15, -5, -20, 0], 
      rotate: [0, 15, -15, 0],
      scale: [1, 1.05, 0.95, 1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    stationary: {
      x: 0,
      rotate: 0,
      y: [0, -4, 0], 
      transition: {
        x: { type: "spring", stiffness: 60, damping: 20 },
        rotate: { duration: 0.5 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
      }
    }
  };

  const currentVariant = isStationary ? "stationary" : (stage === "processing" ? "processing" : "idle");

  return (
    <motion.div 
      className="nano-bot-wrapper"
      variants={roamVariants}
      animate={currentVariant}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={thought}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="cute-bubble"
        >
          {thought}
        </motion.div>
      </AnimatePresence>

      <div className="nano-body" onClick={handleBotClick}>
        <motion.div className="nub-hand left" animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} />
        <motion.div className="nub-hand right" animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2 }} />

        <div className="nano-head">
          <div className="face-screen">
            <div className="eyes-row">
              <div className={`nano-eye left ${expression}`} />
              <div className={`nano-eye right ${expression}`} />
            </div>
            <div className="cheeks">
              <div className="blush" />
              <div className="blush" />
            </div>
          </div>
          
          {/* Static Emerald Green Accent Antenna Pulse */}
          <motion.div 
            className="antenna-bulb" 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="gravity-ripple" />
      </div>
    </motion.div>
  );
}
