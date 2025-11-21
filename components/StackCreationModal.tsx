"use client";

import { useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import EmptyState from "./EmptyState";
import { Book, mockBooks } from "../lib/mockData";
import { Search, Plus, Camera, Check } from "lucide-react";

interface StackCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (stack: { books: Book[]; caption: string; photo?: string }) => void;
}

type Step = "books" | "caption" | "photo" | "review";

export default function StackCreationModal({
  isOpen,
  onClose,
  onSubmit,
}: StackCreationModalProps) {
  const [step, setStep] = useState<Step>("books");
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [caption, setCaption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleBook = (book: Book) => {
    if (selectedBooks.find((b) => b.id === book.id)) {
      setSelectedBooks(selectedBooks.filter((b) => b.id !== book.id));
    } else {
      if (selectedBooks.length < 10) {
        setSelectedBooks([...selectedBooks, book]);
      }
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ books: selectedBooks, caption });
    }
    // Reset form
    setSelectedBooks([]);
    setCaption("");
    setStep("books");
    onClose();
  };

  const filteredBooks = searchQuery
    ? mockBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockBooks.slice(0, 8);

  const stepTitles = {
    books: "Add Books",
    caption: "Write Caption",
    photo: "Add Photo",
    review: "Review Stack",
  };

  const canProceed = {
    books: selectedBooks.length >= 2,
    caption: caption.trim().length > 0,
    photo: true,
    review: true,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stepTitles[step]}
      size="large"
    >
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex gap-2">
          {(["books", "caption", "photo", "review"] as Step[]).map((s, idx) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full border-[2px] border-light-border dark:border-dark-border ${
                step === s
                  ? "bg-accent-cyan"
                  : selectedBooks.length > 0 && idx < (["books", "caption", "photo", "review"] as Step[]).indexOf(step)
                  ? "bg-accent-teal"
                  : "bg-light-borderSecondary dark:bg-dark-borderSecondary"
              }`}
            />
          ))}
        </div>

        {/* Step: Books */}
        {step === "books" && (
          <div className="space-y-4">
            {/* Search */}
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Selected Books Counter */}
            <div className="flex items-center justify-between px-4 py-3 bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl">
              <p className="font-bold text-sm text-light-text dark:text-dark-text">
                Selected Books
              </p>
              <p className="font-black text-lg text-accent-cyan">
                {selectedBooks.length} / 10
              </p>
            </div>

            {/* Book Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {filteredBooks.map((book) => {
                  const isSelected = selectedBooks.find((b) => b.id === book.id);
                  return (
                    <button
                      key={book.id}
                      onClick={() => handleToggleBook(book)}
                      className={`relative bg-gradient-secondary border-[5px] rounded-[20px] shadow-brutal aspect-[2/3] flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-accent-cyan"
                          : "border-light-border dark:border-dark-border"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-accent-cyan border-[3px] border-white rounded-full flex items-center justify-center shadow-brutal-sm">
                          <Check className="w-5 h-5 stroke-[3] text-white" />
                        </div>
                      )}
                      <p className="text-white font-black text-xs text-center px-2">
                        {book.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No books found"
                description={`Try a different search term`}
                size="small"
                variant="info"
              />
            )}
          </div>
        )}

        {/* Step: Caption */}
        {step === "caption" && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
              Tell others what this stack is about! What's the vibe? Why these books?
            </p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Dark academia vibes for cozy fall reading..."
              className="w-full h-32 px-5 py-4 bg-light-secondary dark:bg-dark-secondary border-[2px] border-light-border dark:border-dark-border rounded-xl font-semibold text-light-text dark:text-dark-text placeholder:text-light-textTertiary dark:placeholder:text-dark-textTertiary focus:outline-none focus:border-accent-cyan focus:shadow-brutal-focus focus:-translate-x-[1px] focus:-translate-y-[1px] transition-all resize-none"
              maxLength={200}
            />
            <p className="text-xs font-bold text-light-textTertiary dark:text-dark-textTertiary text-right">
              {caption.length} / 200
            </p>
          </div>
        )}

        {/* Step: Photo */}
        {step === "photo" && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
              Add a photo to your stack (optional)
            </p>
            <button className="w-full aspect-square bg-light-primary dark:bg-dark-primary border-[5px] border-light-border dark:border-dark-border rounded-[20px] shadow-brutal flex flex-col items-center justify-center gap-3 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal-hover transition-all">
              <Camera className="w-12 h-12 stroke-[3] text-light-textSecondary dark:text-dark-textSecondary" />
              <p className="font-black text-sm uppercase text-light-textSecondary dark:text-dark-textSecondary">
                Upload Photo
              </p>
            </button>
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <div className="space-y-4">
            <div className="card-brutal p-4 space-y-4">
              <div>
                <h4 className="font-black text-xs uppercase text-light-textTertiary dark:text-dark-textTertiary mb-2">
                  Books ({selectedBooks.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="px-3 py-1 bg-accent-cyan border-[2px] border-light-border dark:border-dark-border rounded-lg"
                    >
                      <p className="text-white font-bold text-xs">{book.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-light-textTertiary dark:text-dark-textTertiary mb-2">
                  Caption
                </h4>
                <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                  {caption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4 border-t-[5px] border-light-border dark:border-dark-border">
          {step !== "books" && (
            <button
              onClick={() => {
                const steps: Step[] = ["books", "caption", "photo", "review"];
                const currentIdx = steps.indexOf(step);
                const prevStep = steps[currentIdx - 1];
                if (prevStep) setStep(prevStep);
              }}
              className="flex-1 btn-brutal bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step === "review") {
                handleSubmit();
              } else {
                const steps: Step[] = ["books", "caption", "photo", "review"];
                const currentIdx = steps.indexOf(step);
                const nextStep = steps[currentIdx + 1];
                if (nextStep) setStep(nextStep);
              }
            }}
            disabled={!canProceed[step]}
            className="flex-1 btn-brutal bg-accent-cyan text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === "review" ? "Publish Stack" : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
