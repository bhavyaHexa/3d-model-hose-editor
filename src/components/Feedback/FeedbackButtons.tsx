import React, { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";
import { DialogueBox } from "./DialogueBox";
import { Toast, type ToastMessage } from "./Toast";

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwJLhckcZcveIiRxTecnO6jTGewsGFE8VTO0k8szTVcBT2h2vLfVcjRpeE6nDMHvo1e/exec";

export const FeedbackButtons: React.FC = observer(() => {
  const { configuratorStore, feedbackManager } = useMainContext();

  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: "success" | "error" | "info", text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Fetch live sync on mount
  useEffect(() => {
    const fetchUrl = WEBHOOK_URL.includes("?")
      ? `${WEBHOOK_URL}&type=hose`
      : `${WEBHOOK_URL}?type=hose`;
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        feedbackManager.setInitialFeedbackState(
          data.approvedModels || [],
          data.rejectedModels || [],
        );
      })
      .catch((err) => {
        console.error(err);
        addToast("error", "Live Sync Failed. Is your Webhook URL correct and deployed?");
      })
      .finally(() => setIsCheckingStatus(false));
  }, [feedbackManager, addToast]);

  const series = configuratorStore.hoseData?.hoseSeries.find(
    (s: any) => s.id === configuratorStore.selectedSeriesId,
  );
  const braid = series?.braids?.find(
    (b: any) => b.id === configuratorStore.selectedBraidId,
  );
  const size = braid?.sizes?.find(
    (s: any) => s.id === configuratorStore.selectedSizeId,
  );

  const currentModelName =
    configuratorStore.activeModelName ||
    (braid?.name ? `${braid.name} (06)` : "PROGold PTFE Convoluted Hose");

  // Read from MobX Store
  const hasApproved = currentModelName
    ? feedbackManager.approvedModels.has(currentModelName)
    : false;
  const hasRejected = currentModelName
    ? feedbackManager.rejectedModels.has(currentModelName)
    : false;

  // Helper to extract the current state data
  const getPayload = (status: string, feedback: string = "") => {
    return {
      modelName: currentModelName || "Unknown Model",
      materialName: braid?.name || "Default",
      crimpName: size?.value || "06",
      feedback,
      status,
      isHose: true,
    };
  };

  const submitData = (payload: any) => {
    // Fire and forget fetch to avoid long no-cors redirect waits
    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    }).catch(console.error);
  };

  const handleApprove = () => {
    if (currentModelName) {
      feedbackManager.approveModel(currentModelName);
      submitData(getPayload("Approved"));
      addToast("success", "Approved successfully!");
    }
  };

  const handleReject = () => {
    if (currentModelName) {
      feedbackManager.rejectModel(currentModelName);
      submitData(getPayload("Rejected"));
      addToast("info", "Marked as Rejected");
    }
  };

  const handleFeedbackSubmit = (feedbackText: string) => {
    setIsSubmitting(true);
    submitData(getPayload("Feedback", feedbackText));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogueOpen(false);
      addToast("success", "Feedback sent successfully!");
    }, 500);
  };

  return (
    <div className="feedback-wrapper">
      <Toast toasts={toasts} />

      <div className="feedback-btn-group">
        {/* APPROVE BUTTON */}
        <button
          type="button"
          onClick={handleApprove}
          disabled={isCheckingStatus}
          className={`feedback-btn feedback-btn-approve ${
            hasApproved ? "active" : hasRejected ? "subdued" : ""
          }`}
        >
          {hasApproved ? "APPROVED" : "APPROVE"}
        </button>

        {/* REJECT BUTTON */}
        <button
          type="button"
          onClick={handleReject}
          disabled={isCheckingStatus}
          className={`feedback-btn feedback-btn-reject ${
            hasRejected ? "active" : hasApproved ? "subdued" : ""
          }`}
        >
          {hasRejected ? "REJECTED" : "REJECT"}
        </button>

        {/* FEEDBACK BUTTON */}
        <button
          type="button"
          onClick={() => setIsDialogueOpen(true)}
          disabled={isSubmitting}
          className="feedback-btn feedback-btn-feedback"
        >
          FEEDBACK
        </button>
      </div>

      <div className="dialogue-box-container">
        <DialogueBox
          isOpen={isDialogueOpen}
          onClose={() => setIsDialogueOpen(false)}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
});
