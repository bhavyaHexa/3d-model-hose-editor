import React, { useState } from "react";

interface DialogueBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackText: string) => void;
  isSubmitting: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [feedbackText, setFeedbackText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (feedbackText.trim()) {
      onSubmit(feedbackText);
      setFeedbackText(""); // Clear on submit
    }
  };

  return (
    <div className="dialogue-box">
      <h2 className="dialogue-title">Provide Feedback</h2>
      <textarea
        className="dialogue-textarea"
        placeholder="Comment your Feedback"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        rows={4}
      />
      <div className="dialogue-actions">
        <button
          type="button"
          className="dialogue-btn dialogue-btn-cancel"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="dialogue-btn dialogue-btn-submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !feedbackText.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
