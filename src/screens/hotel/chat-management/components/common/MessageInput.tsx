import { useState, useRef } from "react";
import { Button } from "../../../../../components/ui";
import type { EmojiReaction } from "../types";

interface MessageInputProps {
  onSendMessage: (content: string, type: "text" | "file") => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickEmojis: EmojiReaction[] = [
    { emoji: "😊", label: "smile" },
    { emoji: "😂", label: "laugh" },
    { emoji: "❤️", label: "heart" },
    { emoji: "👍", label: "thumbs up" },
    { emoji: "👎", label: "thumbs down" },
    { emoji: "🔥", label: "fire" },
    { emoji: "💯", label: "hundred" },
    { emoji: "🎉", label: "party" },
  ];

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), "text");
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file and get a URL
      onSendMessage(`File: ${file.name}`, "file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative border-t border-gray-200 bg-white">
      {/* Quick Emoji Reactions */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 mb-2">
          <div className="flex flex-wrap gap-2">
            {quickEmojis.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleEmojiClick(reaction.emoji)}
                className="text-xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-end space-x-2">
          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </Button>

          {/* Emoji Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2C17.5,2 22,6.5 22,12C22,17.5 17.5,22 12,22C6.5,22 2,17.5 2,12C2,6.5 6.5,2 12,2M12,20C16.4,20 20,16.4 20,12C20,7.6 16.4,4 12,4C7.6,4 4,7.6 4,12C4,16.4 7.6,20 12,20M16.5,9C17.3,9 18,8.3 18,7.5C18,6.7 17.3,6 16.5,6C15.7,6 15,6.7 15,7.5C15,8.3 15.7,9 16.5,9M7.5,9C8.3,9 9,8.3 9,7.5C9,6.7 8.3,6 7.5,6C6.7,6 6,6.7 6,7.5C6,8.3 6.7,9 7.5,9M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
            </svg>
          </Button>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: "40px",
                maxHeight: "120px",
                resize: "none",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>

          {/* Send Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className="shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
