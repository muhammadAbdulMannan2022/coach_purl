"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { MdCloudUpload, MdCheck, MdAdd } from "react-icons/md";

interface NotificationRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsManagementPage() {
  // Toggle states for Active Rules
  const [rules, setRules] = React.useState<NotificationRule[]>([
    { id: "1", title: "Coach Message Received", description: "When a coach replies to a user", enabled: true },
    { id: "2", title: "Daily Wisdom Drop", description: "Morning motivational quote", enabled: true },
    { id: "3", title: "Missed Session Alert", description: "5 mins after scheduled start time", enabled: true },
    { id: "4", title: "Coach Bidding Alerts", description: "notifying coaches about new bid", enabled: true },
  ]);

  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Form states inside modal
  const [description, setDescription] = React.useState(
    "We believe this offer will provide you with the best value and meet your expectations. Please let us know if you would like to proceed or if you need any further information. Looking forward to your response."
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isSending, setIsSending] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Toggle single rule
  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  // Handle uploader click
  const handleUploaderClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file select change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Drag and drop events handlers
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Handle notification sending action
  const handleSendNotification = () => {
    if (!description.trim()) {
      alert("Please provide a description for the push notification.");
      return;
    }
    
    setIsSending(true);
    // Simulate network submission delay
    setTimeout(() => {
      alert("Push notification sent successfully!");
      setIsSending(false);
      setIsModalOpen(false);
      // Reset states
      setSelectedFile(null);
      setDescription(
        "We believe this offer will provide you with the best value and meet your expectations. Please let us know if you would like to proceed or if you need any further information. Looking forward to your response."
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Top action button row */}
      <div className="flex justify-end pr-1">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
        >
          <MdAdd className="w-4 h-4" />
          <span>Push Notification</span>
        </button>
      </div>

      {/* Rules Configuration List Card */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-6">
          Active Push Notification Rules
        </h3>

        <div className="divide-y divide-[#f1f5f1]">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className="flex items-center justify-between py-5 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-bold text-slate-800 font-sans">{rule.title}</p>
                <p className="text-xs text-[#6D6D6D] font-medium mt-0.5 font-sans">{rule.description}</p>
              </div>
              
              {/* Sliding switch toggle */}
              <button
                onClick={() => handleToggleRule(rule.id)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${rule.enabled ? "bg-[#0da34c]" : "bg-[#e2e8e2]"}`}
                aria-label={`Toggle ${rule.title}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${rule.enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Push Notification Preparation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showCloseButton={true}
        size="md"
      >
        <div className="font-sans text-left p-1 space-y-5">
          {/* Header Title */}
          <h3 className="text-[19px] font-bold text-slate-800 tracking-tight leading-snug">
            Push Notification Preparation
          </h3>

          {/* Dotted Uploader Block */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 mb-2">
              Notification Poster (Optional)
            </span>
            <div
              onClick={handleUploaderClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-40
                ${isDragOver ? "border-[#0da34c] bg-[#e8f5e9]/10" : "border-[#E2E8F0] bg-white"}
                ${selectedFile ? "border-solid border-[#0da34c]/50 bg-[#f8faf8]" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-[#0da34c]">
                    <MdCheck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate max-w-[280px]">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-[#6D6D6D]">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <MdCloudUpload className="w-10 h-10 text-slate-400" />
                  <div className="text-sm font-medium text-slate-700">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-slate-400">
                    PNG, JPG up to 10MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description text area */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-28 resize-none font-sans"
            />
          </div>

          {/* Modal Action buttons */}
          <div className="flex gap-4 justify-between pt-2">
            <button
              type="button"
              disabled={isSending}
              onClick={handleSendNotification}
              className="flex-1 bg-[#0da34c] hover:bg-[#0da34c]/95 disabled:opacity-50 text-white rounded-xl py-2.5 text-xs font-bold transition-all h-11 cursor-pointer shadow-sm font-sans flex items-center justify-center gap-1.5"
            >
              <MdCheck className="w-4 h-4" />
              {isSending ? "Sending..." : "Send Push Notification"}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border border-[#E2E8F0] text-slate-700 hover:bg-zinc-50 rounded-xl py-2.5 text-xs font-bold transition-all h-11 cursor-pointer font-sans bg-white"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
