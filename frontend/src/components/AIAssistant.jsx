import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";
import {
  X,
  HelpCircle,
  Upload,
  FileAudio,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  ChevronRight,
  MessageCircle,
  Info,
} from "lucide-react";

const praiseQuotes = [
  "This cybersecurity UI is so clean! Powerful build. 🛡️",
  "I love the dark technical design here. Precise and minimal! ⚡",
  "The acoustic spectrum layout is pristine. Outstanding work! 👏",
  "FastAPI telemetry feels so smooth and modern. 🧈",
  "Operating inside a high-security defense terminal! 🔒",
  "AURA Voice Guard v2.4 initialized and operational. 🤖",
];

const idleThoughts = [
  "Standing by to analyze audio payload... 🎧",
  "Ready to scan for voice spoofing when you are, Captain! 🫡",
  "*digital acoustic pulse scanning* 🎵",
  "Keeping an eye on synthetic audio vectors. 👀",
];

export default function AIAssistant({
  stage: propStage,
  translate = false,
  notify = false,
  isSpeaking = false,
  isSelectingFile = false,
}) {
  const context = useAnalysis();

  const {
    analysisStatus,
    analysisResult,
    error,
    runAnalysis,
  } = context;

  // ----------------------------------------------------
  // STAGE
  // ----------------------------------------------------

  const stage =
    propStage ||
    (analysisStatus === "processing"
      ? "processing"
      : analysisStatus === "success"
      ? "results"
      : analysisStatus === "file-selected"
      ? "file-selected"
      : analysisStatus === "error"
      ? "error"
      : "idle");

  const fileName =
    context.fileMetadata?.name ||
    context.selectedFile?.name ||
    null;

  const actionCount = analysisResult ? 1 : 0;

  // ----------------------------------------------------
  // LOCAL STATE
  // ----------------------------------------------------

  const [thought, setThought] = useState("Initializing AURA Guard...");
  const [expression, setExpression] = useState("happy");
  const [isStationary, setIsStationary] = useState(false);

  const [helpOpen, setHelpOpen] = useState(false);
  const [activeHelp, setActiveHelp] = useState(null);

  const isMounted = useRef(false);

  // ----------------------------------------------------
  // INITIAL PRAISE
  // ----------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpression("love");
      setThought(
        "AURA Defense online 🛡️ Need help? I'm here."
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------------------
  // PERIODIC THOUGHTS
  // ----------------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        stage === "idle" &&
        !isStationary &&
        !isSpeaking &&
        !isSelectingFile &&
        !helpOpen
      ) {
        if (Math.random() > 0.4) {
          const randomPraise =
            praiseQuotes[
              Math.floor(Math.random() * praiseQuotes.length)
            ];

          setExpression("happy");
          setThought(randomPraise);
        } else {
          const randomIdle =
            idleThoughts[
              Math.floor(Math.random() * idleThoughts.length)
            ];

          setExpression("curious");
          setThought(randomIdle);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [
    stage,
    isStationary,
    isSpeaking,
    isSelectingFile,
    helpOpen,
  ]);

  // ----------------------------------------------------
  // FILE SELECTION
  // ----------------------------------------------------

  useEffect(() => {
    if (isSelectingFile || stage === "file-selected") {
      setExpression("excited");
      setThought(
        "Audio received! Ready to check its authenticity. 🎧"
      );
    }
  }, [isSelectingFile, stage]);

  // ----------------------------------------------------
  // GLOBAL CLICK
  // ----------------------------------------------------

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest(".nano-bot-wrapper")) return;
      if (e.target.closest(".aura-help-panel")) return;

      const isInteractive = e.target.closest(
        "button, input, a, .toggle-switch, .upload-main-card, select, textarea"
      );

      if (!isInteractive && !helpOpen) {
        setExpression("curious");
        setThought(
          "Need something? Tap me and I'll help. 👀"
        );
      }
    };

    window.addEventListener("click", handleGlobalClick);

    return () =>
      window.removeEventListener("click", handleGlobalClick);
  }, [helpOpen]);

  // ----------------------------------------------------
  // VOICE PLAYBACK
  // ----------------------------------------------------

  useEffect(() => {
    if (isSpeaking) {
      setIsStationary(true);
      setExpression("excited");
      setThought(
        "Audio playback detected! Listening to the voice signal. 🔊"
      );
    } else if (
      !isSpeaking &&
      stage === "results" &&
      isMounted.current
    ) {
      setExpression("happy");
      setThought(
        "Playback finished. Need help understanding the result?"
      );
    }
  }, [isSpeaking, stage]);

  // ----------------------------------------------------
  // TRANSLATION
  // ----------------------------------------------------

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (translate) {
      setExpression("excited");
      setThought(
        "Multi-language security protocol activated! 🌍"
      );
    } else {
      setExpression("happy");
      setThought("Standard security protocol restored.");
    }
  }, [translate]);

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------

  useEffect(() => {
    if (!isMounted.current) return;

    if (notify) {
      setExpression("love");
      setThought(
        "Alert notifications armed! 📨"
      );
    } else {
      setExpression("sleep");
      setThought(
        "Silent monitoring active."
      );
    }
  }, [notify]);

  // ----------------------------------------------------
  // STAGE REACTIONS
  // ----------------------------------------------------

  useEffect(() => {
    if (stage === "processing") {
      setIsStationary(false);
      setExpression("dizzy");

      setThought(
        fileName
          ? `Analyzing ${fileName}...`
          : "Checking the voice signal..."
      );
    }

    if (stage === "results") {
      setIsStationary(true);
      setExpression(
        actionCount > 0 ? "love" : "happy"
      );

      setThought(
        "Analysis complete. I can help explain the result."
      );
    }

    if (stage === "error") {
      setIsStationary(true);
      setExpression("dizzy");
      setThought(
        "Something went wrong. I can help troubleshoot it."
      );
    }
  }, [stage, actionCount, fileName]);

  // ----------------------------------------------------
  // HELP CONTENT
  // ----------------------------------------------------

  const getHelpOptions = () => {
    if (stage === "processing") {
      return [
        {
          id: "processing",
          icon: Info,
          title: "What is happening?",
          answer:
            "Anahat is currently processing the recording and checking the voice signal for signs of synthetic or manipulated speech.",
        },
        {
          id: "time",
          icon: RefreshCw,
          title: "Why is it taking time?",
          answer:
            "The analysis runs through the voice detection model and evaluates multiple sections of the recording. Processing time can vary depending on the recording length and system resources.",
        },
      ];
    }

    if (stage === "error") {
      return [
        {
          id: "retry",
          icon: RefreshCw,
          title: "Retry the analysis",
          answer:
            "The previous analysis could not be completed. You can retry the same recording.",
          action: "retry",
        },
        {
          id: "connection",
          icon: AlertTriangle,
          title: "What went wrong?",
          answer:
            error ||
            "The analysis service did not return a valid result. Check that the backend is running and try again.",
        },
      ];
    }

    if (stage === "results" && analysisResult) {
      const risk =
        analysisResult.risk_level ||
        analysisResult.riskLevel ||
        "";

      const isThreat =
        String(risk).toUpperCase() === "HIGH" ||
        String(risk).toUpperCase() === "CRITICAL" ||
        String(
          analysisResult.prediction || ""
        ).toUpperCase() === "SPOOF";

      return [
        {
          id: "meaning",
          icon: isThreat ? ShieldAlert : ShieldCheck,
          title: "What does this result mean?",
          answer: isThreat
            ? "The recording contains signals that may indicate synthetic or manipulated speech. Treat the voice as untrusted until independently verified."
            : "The system did not find strong evidence of synthetic speech in this recording. This does not guarantee that the caller is genuine, so normal verification procedures should still be followed.",
        },
        {
          id: "probability",
          icon: Info,
          title: "What is spoof probability?",
          answer:
            "Spoof probability represents the model's estimated likelihood that the analyzed speech is synthetic or spoofed. It is a model confidence signal, not proof of identity.",
        },
        {
          id: "action",
          icon: PhoneCall,
          title: "What should I do next?",
          answer: isThreat
            ? "Do not rely on the detected voice alone for a sensitive action. Verify the person through an independent channel, such as a known phone number or another authentication method."
            : "If the interaction involves a sensitive request, continue using your normal verification procedures.",
        },
      ];
    }

    return [
      {
        id: "upload",
        icon: Upload,
        title: "How do I upload audio?",
        answer:
          "Use the audio upload area and select a supported recording. You can then start the authenticity analysis.",
      },
      {
        id: "formats",
        icon: FileAudio,
        title: "What audio can I analyze?",
        answer:
          "Anahat supports common audio recordings such as WAV, MP3, FLAC, OGG and M4A, depending on the system's audio decoder support.",
      },
      {
        id: "detection",
        icon: ShieldCheck,
        title: "How does detection work?",
        answer:
          "The system analyzes characteristics of the speech signal and estimates whether the recording contains signs associated with synthetic or spoofed speech.",
      },
      {
        id: "problem",
        icon: AlertTriangle,
        title: "Something isn't working",
        answer:
          "If an analysis fails, check that the backend service is running, then retry the recording. Persistent problems can be reported to support.",
      },
    ];
  };

  const helpOptions = getHelpOptions();

  // ----------------------------------------------------
  // OPEN HELP
  // ----------------------------------------------------

  const openHelp = () => {
    setHelpOpen(true);
    setActiveHelp(null);
    setIsStationary(true);
    setExpression("curious");

    if (stage === "error") {
      setThought(
        "I noticed an issue. Let's troubleshoot it. 🔧"
      );
    } else if (stage === "results") {
      setThought(
        "Need help understanding your result? 📊"
      );
    } else {
      setThought(
        "How can I help you? 👋"
      );
    }
  };

  // ----------------------------------------------------
  // CLOSE HELP
  // ----------------------------------------------------

  const closeHelp = () => {
    setHelpOpen(false);
    setActiveHelp(null);
    setExpression("happy");
    setThought("Back to monitoring. 🛡️");
  };

  // ----------------------------------------------------
  // SELECT HELP OPTION
  // ----------------------------------------------------

  const handleHelpOption = (option) => {
    if (option.action === "retry") {
      closeHelp();

      setExpression("excited");
      setThought("Retrying the analysis... 🔄");

      if (runAnalysis) {
        runAnalysis();
      }

      return;
    }

    setActiveHelp(option.id);
    setExpression("happy");
    setThought("Here's what you need to know.");
  };

  // ----------------------------------------------------
  // BOT CLICK
  // ----------------------------------------------------

  const handleBotClick = () => {
    if (helpOpen) {
      closeHelp();
      return;
    }

    openHelp();
  };

  // ----------------------------------------------------
  // ANIMATION VARIANTS
  // ----------------------------------------------------

  const roamVariants = {
    idle: {
      y: [0, -10, 0],
      x: 0,
      rotate: [0, 3, -3, 0],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        x: {
          duration: 0.5,
        },
      },
    },

    processing: {
      x: [0, -20, 20, -10, 0],
      y: [0, -15, -5, -20, 0],
      rotate: [0, 15, -15, 0],
      scale: [1, 1.05, 0.95, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },

    stationary: {
      x: 0,
      rotate: 0,
      y: [0, -4, 0],
      transition: {
        x: {
          type: "spring",
          stiffness: 60,
          damping: 20,
        },
        rotate: {
          duration: 0.5,
        },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  const currentVariant = isStationary
    ? "stationary"
    : stage === "processing"
    ? "processing"
    : "idle";

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <>
      {/* HELP PANEL */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="aura-help-panel fixed bottom-28 right-6 z-[60] w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b0e14]/95 backdrop-blur-xl shadow-2xl"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {/* PANEL HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    AURA Help
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Anahat support assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeHelp}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PANEL BODY */}
            <div className="p-4">
              {!activeHelp ? (
                <>
                  <p className="text-sm text-slate-300 mb-4">
                    {stage === "error"
                      ? "I noticed a problem. What would you like to check?"
                      : stage === "results"
                      ? "Need help understanding this analysis?"
                      : stage === "processing"
                      ? "The analysis is running. What would you like to know?"
                      : "What can I help you with?"}
                  </p>

                  <div className="space-y-2">
                    {helpOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            handleHelpOption(option)
                          }
                          className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/70 hover:border-slate-700 text-left transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30">
                            <Icon className="w-4 h-4 text-emerald-400" />
                          </div>

                          <span className="flex-1 text-xs font-medium text-slate-300 group-hover:text-white">
                            {option.title}
                          </span>

                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        </button>
                      );
                    })}
                  </div>

                  {/* SUPPORT */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveHelp("support");
                        setExpression("love");
                        setThought(
                          "I'll help you get this resolved. 🤝"
                        );
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 hover:bg-emerald-500/10 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-200">
                          Contact support
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Report a problem or request assistance
                        </p>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* ANSWER */}
                  {activeHelp === "support" ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />

                        <p className="text-sm font-semibold text-slate-200">
                          Contact support
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        If you are unable to resolve the issue,
                        contact your project administrator or
                        technical support team and provide the
                        error message shown on this page.
                      </p>

                      <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-[10px] text-slate-500">
                          Current status
                        </p>

                        <p className="text-xs text-slate-300 mt-1">
                          {analysisStatus || "Ready"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveHelp(null)}
                        className="mt-4 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        ← Back to help
                      </button>
                    </div>
                  ) : (
                    <div>
                      {helpOptions
                        .filter(
                          (option) =>
                            option.id === activeHelp
                        )
                        .map((option) => {
                          const Icon = option.icon;

                          return (
                            <React.Fragment key={option.id}>
                              <div className="flex items-center gap-2 mb-3">
                                <Icon className="w-4 h-4 text-emerald-400" />

                                <p className="text-sm font-semibold text-slate-200">
                                  {option.title}
                                </p>
                              </div>

                              <p className="text-xs text-slate-400 leading-relaxed">
                                {option.answer}
                              </p>
                            </React.Fragment>
                          );
                        })}

                      <button
                        type="button"
                        onClick={() => setActiveHelp(null)}
                        className="mt-4 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        ← Back to help
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AURA BOT */}
      <motion.div
        className="nano-bot-wrapper"
        variants={roamVariants}
        animate={currentVariant}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={thought}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 10,
            }}
            className="cute-bubble"
          >
            {thought}
          </motion.div>
        </AnimatePresence>

        <div
          className="nano-body"
          onClick={handleBotClick}
          role="button"
          tabIndex={0}
          aria-label="Open AURA help assistant"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBotClick();
            }
          }}
        >
          <motion.div
            className="nub-hand left"
            animate={{ y: [0, 3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.2,
            }}
          />

          <motion.div
            className="nub-hand right"
            animate={{ y: [0, 3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          />

          <div className="nano-head">
            <div className="face-screen">
              <div className="eyes-row">
                <div
                  className={`nano-eye left ${expression}`}
                />

                <div
                  className={`nano-eye right ${expression}`}
                />
              </div>

              <div className="cheeks">
                <div className="blush" />
                <div className="blush" />
              </div>
            </div>

            <motion.div
              className="antenna-bulb"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </div>

          <div className="gravity-ripple" />
        </div>
      </motion.div>
    </>
  );
}