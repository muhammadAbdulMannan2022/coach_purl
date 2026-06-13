"use client";

import * as React from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";

type TabId = "terms" | "privacy" | "disclaimer" | "payment";

interface TabItem {
  id: TabId;
  label: string;
  header: string;
}

export default function LegalInfoPage() {
  const tabs: TabItem[] = [
    { id: "terms", label: "Terms & Condition", header: "Terms" },
    { id: "privacy", label: "Policy Policy", header: "Privacy Policy" },
    { id: "disclaimer", label: "Medical Disclaimer", header: "Medical Disclaimer" },
    { id: "payment", label: "Payment Terms", header: "Payment Terms" },
  ];

  const [activeTab, setActiveTab] = React.useState<TabId>("terms");
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempParagraphs, setTempParagraphs] = React.useState<string[]>([]);

  // Default Paragraphs Data for each section
  const [terms, setTerms] = React.useState<string[]>([
    "Lorem ipsum dolor sit amet consectetur. Massa imperdiet non diam morbi malesuada libero orci. Sit dolor orci neque dolor pulvinar elementum interdum vestibulum id. Luctus viverra sit nec massa odio nibh maecenas. Lacinia aliquam velit lectus amet. Aenean pulvinar adipiscing maecenas aliquam. Et ultrices enim dictumst fames vitae amet porta cursus urna. Euismod lectus consectetur mi bibendum. Mauris urna mauris diam diam sed. Vestibulum aliquet malesuada nisl sem nunc. Elementum lacus sed sit ac fermentum netus enim porta sit. In lorem tortor turpis sodales in id sed. Aliquet suspendisse tellus amet non turpis convallis urna egestas vitae.disse.",
    "Lorem ipsum dolor sit amet consectetur. Massa imperdiet non diam morbi malesuada libero orci. Sit dolor orci neque dolor pulvinar elementum interdum vestibulum id. Luctus viverra sit nec massa odio nibh maecenas. Lacinia aliquam velit lectus amet. Aenean pulvinar adipiscing maecenas aliquam. Et ultrices enim dictumst fames vitae amet porta cursus urna. Euismod lectus consectetur mi bibendum. Mauris urna mauris diam diam sed. Vestibulum aliquet malesuada nisl sem nunc. Elementum lacus sed sit ac fermentum netus enim porta sit. In lorem tortor turpis sodales in id sed. Aliquet suspendisse tellus amet non turpis convallis urna egestas vitae.disse.",
    "Lorem ipsum dolor sit amet consectetur. Massa imperdiet non diam morbi malesuada libero orci. Sit dolor orci neque dolor pulvinar elementum interdum vestibulum id. Luctus viverra sit nec massa odio nibh maecenas. Lacinia aliquam velit lectus amet. Aenean pulvinar adipiscing maecenas aliquam. Et ultrices enim dictumst fames vitae amet porta cursus urna. Euismod lectus consectetur mi bibendum. Mauris urna mauris diam diam sed. Vestibulum aliquet malesuada nisl sem nunc. Elementum lacus sed sit ac fermentum netus enim porta sit. In lorem tortor turpis sodales in id sed. Aliquet suspendisse tellus amet non turpis convallis urna egestas vitae.disse."
  ]);

  const [privacy, setPrivacy] = React.useState<string[]>([
    "We value your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and process your personal information when you use our platform services.",
    "We collect information you provide directly, such as your profile details, certifications, session logs, and messages. We use this data to facilitate matches between coaches and users, improve our platform features, and process payments securely.",
    "You have the right to request access to, correction of, or deletion of your personal data. You may contact us at any time to exercise these rights or to ask questions regarding our data practices."
  ]);

  const [disclaimer, setDisclaimer] = React.useState<string[]>([
    "The coaches on this platform provide mental health support, emotional guidance, and wellness coaching. However, their services do not constitute professional medical, psychiatric, or psychological diagnosis, therapy, or treatment.",
    "If you are experiencing a mental health emergency, severe depression, or thoughts of self-harm, please contact emergency services immediately or go to the nearest emergency room.",
    "Use of this platform does not establish a clinical therapist-patient relationship. Wellness coaching is intended as support and should not replace recommended professional treatment programs."
  ]);

  const [payment, setPayment] = React.useState<string[]>([
    "All subscription and session fees are processed securely through our verified payment gateway. Platform subscription charges are billed on a recurring monthly or yearly cycle depending on the plan selected.",
    "Coaches set their session rates independently. The platform deducts a standard commission percentage (as configured in settings) prior to releasing payments to the coach payouts ledger.",
    "Refund requests must be submitted within 24 hours of a disputed session. Disputes are subject to review by administrative moderators, and final decisions will be communicated via email alerts."
  ]);

  const getParagraphs = (tab: TabId) => {
    switch (tab) {
      case "terms": return terms;
      case "privacy": return privacy;
      case "disclaimer": return disclaimer;
      case "payment": return payment;
    }
  };

  const handleStartEdit = () => {
    setTempParagraphs([...getParagraphs(activeTab)]);
    setIsEditing(true);
  };

  const handleParagraphChange = (index: number, value: string) => {
    setTempParagraphs((prev) =>
      prev.map((text, idx) => (idx === index ? value : text))
    );
  };

  const handleRemoveParagraph = (index: number) => {
    setTempParagraphs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddParagraph = () => {
    setTempParagraphs((prev) => [...prev, ""]);
  };

  const handleSave = () => {
    const cleaned = tempParagraphs.map((t) => t.trim()).filter((t) => t.length > 0);
    switch (activeTab) {
      case "terms": setTerms(cleaned); break;
      case "privacy": setPrivacy(cleaned); break;
      case "disclaimer": setDisclaimer(cleaned); break;
      case "payment": setPayment(cleaned); break;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsEditing(false); // Discard unsaved changes on tab switch
  };

  const activeParagraphs = getParagraphs(activeTab);
  const currentTabInfo = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Custom Tabs Navigation bar */}
      <div className="bg-slate-100 p-1 rounded-xl gap-1 inline-flex max-w-full overflow-x-auto border border-border/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-sm"
                : "text-foreground hover:text-primary hover:bg-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Legal Document Card */}
      <div className="bg-white border border-border p-8 rounded-2xl shadow-sm flex flex-col transition-all duration-200 hover:shadow-md min-h-[400px]">
        {/* Document Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <h3 className="text-base font-extrabold text-slate-800 font-sans tracking-tight">
            {isEditing ? `Editing ${currentTabInfo.header}` : currentTabInfo.header}
          </h3>
          
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer group"
            >
              <MdEdit className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Document Content List */}
        {!isEditing ? (
          activeParagraphs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-20 border border-dashed border-border rounded-xl">
              <span className="text-xs text-slate-400 font-medium">
                No content added yet. Click "Edit" to add paragraphs.
              </span>
            </div>
          ) : (
            <ul className="space-y-5 list-disc list-outside pl-4 text-slate-500 text-xs leading-relaxed font-sans font-medium">
              {activeParagraphs.map((paragraph, index) => (
                <li key={index} className="pl-2 leading-relaxed">
                  {paragraph}
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="space-y-6">
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 pb-2">
              {tempParagraphs.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-xl">
                  <p className="text-xs text-slate-400 font-medium font-sans">
                    No paragraphs added yet. Click "Add Paragraph" below.
                  </p>
                </div>
              ) : (
                tempParagraphs.map((paragraph, index) => (
                  <div key={index} className="flex gap-4 items-start animate-in fade-in duration-150">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
                        Paragraph #{index + 1}
                      </label>
                      <textarea
                        required
                        value={paragraph}
                        onChange={(e) => handleParagraphChange(index, e.target.value)}
                        className="w-full bg-white border border-border rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-24 font-sans resize-none"
                        placeholder="Enter policy content..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(index)}
                      className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl border border-transparent hover:border-red-100 transition-all cursor-pointer shrink-0"
                      title="Delete paragraph"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Paragraph Trigger */}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddParagraph}
              className="w-full flex items-center justify-center gap-1.5 border border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-bold h-11"
            >
              <MdAdd className="w-4 h-4" />
              <span>Add Paragraph</span>
            </Button>

            {/* Inline Action Save/Cancel Buttons */}
            <div className="flex gap-4 justify-end pt-4 border-t border-border mt-6">
              <Button
                type="button"
                variant="outline"
                className="font-bold w-32 h-11"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="font-bold w-44 h-11"                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
