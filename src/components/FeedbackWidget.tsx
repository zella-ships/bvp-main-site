"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

interface FeedbackData {
  id: string;
  pageUrl: string;
  xPercent: number;
  yPercent: number;
  viewportWidth: number;
  viewportHeight: number;
  comment: string;
  timestamp: string;
  userAgent: string;
  screenshot?: string;
}

const STORAGE_KEY = "bvp_feedback_data";

// Wrapper component with Suspense
export default function FeedbackWidget() {
  return (
    <Suspense fallback={null}>
      <FeedbackWidgetInner />
    </Suspense>
  );
}

function FeedbackWidgetInner() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number; xPercent: number; yPercent: number } | null>(null);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState<{ id: string; comment: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const pendingClickRef = useRef<{ x: number; y: number; xPercent: number; yPercent: number } | null>(null);

  // Check URL params for incoming feedback marker
  useEffect(() => {
    const feedbackId = searchParams.get("feedback_id");
    const fx = searchParams.get("fx");
    const fy = searchParams.get("fy");

    if (feedbackId && fx && fy) {
      const xPercent = parseFloat(fx);
      const yPercent = parseFloat(fy);

      const x = (xPercent / 100) * document.documentElement.scrollWidth;
      const y = (yPercent / 100) * document.documentElement.scrollHeight;

      const stored = localStorage.getItem(STORAGE_KEY);
      let feedbackComment = "";
      if (stored) {
        const feedbackList = JSON.parse(stored) as FeedbackData[];
        const item = feedbackList.find(f => f.id === feedbackId);
        if (item) {
          feedbackComment = item.comment;
        }
      }

      setClickPosition({ x, y, xPercent, yPercent });
      setShowMarker(true);
      setViewingFeedback({ id: feedbackId, comment: feedbackComment });

      setTimeout(() => {
        window.scrollTo({
          top: y - window.innerHeight / 2,
          behavior: "smooth"
        });
      }, 100);

      const url = new URL(window.location.href);
      url.searchParams.delete("feedback_id");
      url.searchParams.delete("fx");
      url.searchParams.delete("fy");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams]);

  // Capture screenshot (called after click position is set)
  const captureScreenshot = useCallback(async (x: number, y: number) => {
    try {
      setIsCapturing(true);

      const feedbackElements = document.querySelectorAll('[data-feedback-widget]');
      feedbackElements.forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });

      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        allowTaint: true,
        scale: 1,
      });

      feedbackElements.forEach(el => {
        (el as HTMLElement).style.visibility = 'visible';
      });

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = 600;
      cropCanvas.height = 600;
      const ctx = cropCanvas.getContext('2d');

      if (!ctx) {
        setIsCapturing(false);
        return null;
      }

      const cropX = Math.max(0, Math.min(canvas.width - 600, x - 300));
      const cropY = Math.max(0, Math.min(canvas.height - 600, y - 300));

      ctx.drawImage(canvas, cropX, cropY, 600, 600, 0, 0, 600, 600);

      const markerX = x - cropX;
      const markerY = y - cropY;

      ctx.beginPath();
      ctx.arc(markerX, markerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(markerX, markerY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(markerX - 3, markerY - 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.7);
      setScreenshotData(dataUrl);
      setIsCapturing(false);
      return dataUrl;
    } catch (err) {
      console.error('Screenshot capture failed:', err);
      setIsCapturing(false);
      return null;
    }
  }, []);

  // Handle click in feedback mode - SYNCHRONOUS
  const handlePageClick = useCallback((e: MouseEvent) => {
    if (!feedbackMode) return;

    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-widget]')) return;

    e.preventDefault();
    e.stopPropagation();

    const xPercent = (e.pageX / document.documentElement.scrollWidth) * 100;
    const yPercent = (e.pageY / document.documentElement.scrollHeight) * 100;

    const pos = {
      x: e.pageX,
      y: e.pageY,
      xPercent,
      yPercent
    };

    // Store for screenshot capture
    pendingClickRef.current = pos;

    // Set state synchronously
    setClickPosition(pos);
    setShowMarker(true);
    setFeedbackMode(false);

    // Capture screenshot async after state is set
    captureScreenshot(e.pageX, e.pageY);
  }, [feedbackMode, captureScreenshot]);

  useEffect(() => {
    if (feedbackMode) {
      document.addEventListener("click", handlePageClick, true);
      document.body.style.cursor = "crosshair";
    } else {
      document.removeEventListener("click", handlePageClick, true);
      document.body.style.cursor = "";
    }

    return () => {
      document.removeEventListener("click", handlePageClick, true);
      document.body.style.cursor = "";
    };
  }, [feedbackMode, handlePageClick]);

  const saveFeedback = (data: FeedbackData) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const feedbackList: FeedbackData[] = existing ? JSON.parse(existing) : [];
      feedbackList.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList));
    } catch (err) {
      console.error('Failed to save feedback:', err);
    }
  };

  const handleSubmit = async () => {
    if (!clickPosition || !comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageUrl: window.location.href,
      xPercent: clickPosition.xPercent,
      yPercent: clickPosition.yPercent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenshot: screenshotData || undefined
    };

    saveFeedback(feedbackData);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData)
      });
    } catch (err) {
      // Silent fail - local storage is the backup
    }

    // Reset state
    setShowSuccess(true);
    setComment("");
    setClickPosition(null);
    setShowMarker(false);
    setScreenshotData(null);
    pendingClickRef.current = null;

    setTimeout(() => {
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 2000);
  };

  const cancelFeedback = () => {
    setClickPosition(null);
    setShowMarker(false);
    setComment("");
    setViewingFeedback(null);
    setScreenshotData(null);
    pendingClickRef.current = null;
  };

  const startFeedbackMode = () => {
    setFeedbackMode(true);
    setIsOpen(false);
  };

  return (
    <>
      {/* Googly Eye Marker at click position */}
      <AnimatePresence>
        {showMarker && clickPosition && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-[9998]"
            style={{
              left: clickPosition.x - 24,
              top: clickPosition.y - 24,
            }}
            data-feedback-widget
          >
            <div className="relative w-12 h-12 pointer-events-none">
              <div className="absolute inset-0 bg-white rounded-full shadow-lg border-2 border-gray-800" />
              <motion.div
                className="absolute w-6 h-6 bg-gray-900 rounded-full"
                style={{ left: 12, top: 12 }}
                animate={{ x: [0, 2, -2, 0], y: [0, -2, 2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute w-2 h-2 bg-white rounded-full top-1 left-1" />
              </motion.div>
            </div>

            {viewingFeedback && (
              <div className="absolute left-14 top-0 bg-white rounded-xl shadow-2xl p-4 w-72 pointer-events-auto">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 flex-1">{viewingFeedback.comment}</p>
                  <button onClick={cancelFeedback} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                </div>
                <a href="/feedback" className="mt-3 text-xs text-[#FDC500] hover:underline block">← Back to all feedback</a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Mode Overlay */}
      <AnimatePresence>
        {feedbackMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] pointer-events-none"
            data-feedback-widget
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-black text-white px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full shadow-xl pointer-events-auto text-sm sm:text-base">
              <span className="mr-2 sm:mr-3">👁️</span>
              <span className="hidden sm:inline">Click anywhere on the page to leave feedback</span>
              <span className="sm:hidden">Tap anywhere to leave feedback</span>
              <button onClick={() => setFeedbackMode(false)} className="ml-2 sm:ml-3 text-white/70 hover:text-white underline">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal */}
      <AnimatePresence>
        {clickPosition && !feedbackMode && !viewingFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[9999] bg-white rounded-xl shadow-2xl p-4 sm:p-5 w-[calc(100%-2rem)] sm:w-80 max-w-80 left-4 sm:left-auto bottom-4 sm:bottom-auto"
            style={{
              ...(typeof window !== 'undefined' && window.innerWidth >= 640 ? {
                left: Math.min(clickPosition.x + 30, window.innerWidth - 340),
                top: Math.min(clickPosition.y - 20, window.innerHeight - 300),
              } : {}),
            }}
            data-feedback-widget
          >
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">👁️ Leave Feedback</h3>

            {isCapturing ? (
              <div className="mb-3 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Capturing screenshot...</span>
              </div>
            ) : screenshotData ? (
              <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                <img src={screenshotData} alt="Screenshot" className="w-full h-32 object-cover" />
              </div>
            ) : null}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What's your feedback about this area?"
              className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FDC500]"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button onClick={cancelFeedback} className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
                className="flex-1 px-4 py-2 text-sm bg-[#FDC500] text-black font-medium rounded-lg hover:bg-[#e6b200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[9999] bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl"
            data-feedback-widget
          >
            ✓ Feedback saved!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button - ALWAYS VISIBLE */}
      <div className="fixed bottom-6 right-6 z-[9997]" data-feedback-widget>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl p-4 w-64 mb-2"
            >
              <h3 className="font-bold text-gray-900 mb-3">Feedback Tools</h3>
              <button
                onClick={startFeedbackMode}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <span className="text-xl">👁️</span>
                <div>
                  <div className="font-medium text-gray-900">Click to Comment</div>
                  <div className="text-xs text-gray-500">Mark a spot on the page</div>
                </div>
              </button>
              <a href="/feedback" className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3 mt-1">
                <span className="text-xl">📋</span>
                <div>
                  <div className="font-medium text-gray-900">View All Feedback</div>
                  <div className="text-xs text-gray-500">See collected comments</div>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#FDC500] rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#e6b200] transition-colors"
        >
          {isOpen ? "✕" : "👁️"}
        </motion.button>
      </div>
    </>
  );
}
