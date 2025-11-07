"use client";

import { useState, useEffect } from "react";
import { User, Bell, Lock, Moon, Sun, LogOut, ChevronRight, Search, BookOpen } from "lucide-react";
import { currentUser } from "@/lib/mockData";
import { libraryDatabase, Library } from "@/lib/libraryDatabase";

type SettingSection = {
  title: string;
  icon: typeof User;
  items: SettingItem[];
};

type SettingItem = {
  label: string;
  value?: string;
  type: "toggle" | "nav" | "action";
  enabled?: boolean;
  action?: () => void;
};

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [showLibraryPicker, setShowLibraryPicker] = useState(false);

  useEffect(() => {
    // Load saved library
    const savedLibraryId = localStorage.getItem("userLibraryId");
    const savedLibraryName = localStorage.getItem("userLibrary");
    if (savedLibraryId) {
      const library = libraryDatabase.find(lib => lib.id === savedLibraryId);
      if (library) {
        setSelectedLibrary(library);
      }
    } else if (savedLibraryName) {
      // Backward compatibility: convert old library name to new format
      const library = libraryDatabase.find(lib => lib.name === savedLibraryName);
      if (library) {
        setSelectedLibrary(library);
        localStorage.setItem("userLibraryId", library.id);
      }
    }
  }, []);

  const handleLibrarySelect = (library: Library) => {
    setSelectedLibrary(library);
    localStorage.setItem("userLibraryId", library.id);
    localStorage.setItem("userLibrary", library.name);
    setShowLibraryPicker(false);
    setLibrarySearch("");
  };

  const filteredLibraries = librarySearch
    ? libraryDatabase.filter(lib =>
        lib.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
        lib.city.toLowerCase().includes(librarySearch.toLowerCase()) ||
        lib.state.toLowerCase().includes(librarySearch.toLowerCase())
      )
    : libraryDatabase;

  const sections: SettingSection[] = [
    {
      title: "Profile",
      icon: User,
      items: [
        { label: "Edit Profile", type: "nav" },
        { label: "Username", value: currentUser.username, type: "nav" },
        { label: "Bio", value: currentUser.bio, type: "nav" },
      ],
    },
    {
      title: "Preferences",
      icon: Bell,
      items: [
        {
          label: "Dark Mode",
          type: "toggle",
          enabled: darkMode,
          action: () => setDarkMode(!darkMode),
        },
        {
          label: "Push Notifications",
          type: "toggle",
          enabled: notifications,
          action: () => setNotifications(!notifications),
        },
      ],
    },
    {
      title: "Privacy",
      icon: Lock,
      items: [
        {
          label: "Private Account",
          type: "toggle",
          enabled: privateAccount,
          action: () => setPrivateAccount(!privateAccount),
        },
        { label: "Blocked Users", type: "nav" },
        { label: "Data & Privacy", type: "nav" },
      ],
    },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
    // TODO: Implement logout logic
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
        <div className="max-w-lg mx-auto px-4 py-6">
          <h1 className="font-black text-2xl uppercase tracking-tight text-light-text dark:text-dark-text">
            Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Library Selection */}
        <div className="card-brutal overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-info border-b-[5px] border-light-border dark:border-dark-border">
            <BookOpen className="w-5 h-5 stroke-[3] text-white" />
            <h2 className="font-black text-sm uppercase tracking-tight text-white">
              Your Library
            </h2>
          </div>

          {/* Current Library */}
          <div className="p-4">
            <p className="text-xs font-bold text-light-textSecondary dark:text-dark-textSecondary mb-3">
              Check book availability at your local library
            </p>

            <button
              onClick={() => setShowLibraryPicker(!showLibraryPicker)}
              className="w-full flex items-center justify-between p-4 bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl font-bold shadow-brutal-badge hover:shadow-brutal transition-all"
            >
              <span className="text-light-text dark:text-dark-text">
                {selectedLibrary ? selectedLibrary.name : "Select your library"}
              </span>
              <ChevronRight className={`w-5 h-5 stroke-[3] text-light-textSecondary dark:text-dark-textSecondary transition-transform ${showLibraryPicker ? 'rotate-90' : ''}`} />
            </button>

            {/* Library Picker */}
            {showLibraryPicker && (
              <div className="mt-4 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-textTertiary dark:text-dark-textTertiary"
                    size={20}
                    strokeWidth={3}
                  />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search for your library..."
                    className="w-full pl-12 pr-4 py-3 border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text shadow-brutal-badge focus:outline-none focus:shadow-brutal-input-focus focus:border-accent-cyan transition-all"
                  />
                </div>

                {/* Library List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredLibraries.map((library) => (
                    <button
                      key={library.id}
                      onClick={() => handleLibrarySelect(library)}
                      className={`w-full p-3 text-left border-[3px] rounded-xl font-bold transition-all ${
                        selectedLibrary?.id === library.id
                          ? "bg-accent-cyan text-white border-light-border dark:border-dark-border shadow-brutal-badge"
                          : "bg-light-secondary dark:bg-dark-secondary border-light-borderSecondary dark:border-dark-borderSecondary hover:border-light-border dark:hover:border-dark-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={selectedLibrary?.id === library.id ? "text-white" : "text-light-text dark:text-dark-text"}>
                            {library.name}
                          </div>
                          <div className={`text-xs ${selectedLibrary?.id === library.id ? "text-white/80" : "text-light-textSecondary dark:text-dark-textSecondary"}`}>
                            {library.city}, {library.state}
                          </div>
                        </div>
                        {selectedLibrary?.id === library.id && (
                          <span className="text-white">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Sections */}
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="card-brutal overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-primary border-b-[5px] border-light-border dark:border-dark-border">
                <SectionIcon className="w-5 h-5 stroke-[3] text-white" />
                <h2 className="font-black text-sm uppercase tracking-tight text-white">
                  {section.title}
                </h2>
              </div>

              {/* Section Items */}
              <div>
                {section.items.map((item, idx) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-4 py-4 ${
                      idx !== section.items.length - 1
                        ? "border-b-2 border-light-borderSecondary dark:border-dark-borderSecondary"
                        : ""
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-bold text-sm text-light-text dark:text-dark-text">
                        {item.label}
                      </p>
                      {item.value && (
                        <p className="text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary mt-1">
                          {item.value}
                        </p>
                      )}
                    </div>

                    {/* Toggle */}
                    {item.type === "toggle" && (
                      <button
                        onClick={item.action}
                        className={`relative w-14 h-8 rounded-[50px] border-[3px] border-light-border dark:border-dark-border transition-all ${
                          item.enabled ? "bg-accent-cyan" : "bg-light-borderSecondary dark:bg-dark-borderSecondary"
                        }`}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white border-[2px] border-light-border dark:border-dark-border shadow-brutal-sm transition-transform ${
                            item.enabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}

                    {/* Navigation */}
                    {item.type === "nav" && (
                      <ChevronRight className="w-5 h-5 stroke-[3] text-light-textSecondary dark:text-dark-textSecondary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-accent-coral border-[5px] border-light-border dark:border-dark-border shadow-brutal rounded-[20px] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal-hover transition-all"
        >
          <LogOut className="w-5 h-5 stroke-[3] text-white" />
          <span className="font-black text-sm uppercase tracking-tight text-white">
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}
