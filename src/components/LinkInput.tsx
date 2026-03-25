import React, { useState } from "react";
import { Plus, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonLink } from "@/types/moduleTypes";

interface LinkInputProps {
  links: LessonLink[];
  onLinksChange: (links: LessonLink[]) => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

export const LinkInput: React.FC<LinkInputProps> = ({
  links,
  onLinksChange,
  isLoading = false,
  isReadOnly = false,
}) => {
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [error, setError] = useState("");

  const addLink = () => {
    setError("");

    if (!newLinkTitle.trim()) {
      setError("Please enter a link title");
      return;
    }

    if (!newLinkUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newLinkUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const link: LessonLink = {
      id: `temp-${Date.now()}`,
      title: newLinkTitle,
      url: newLinkUrl,
    };

    onLinksChange([...links, link]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setIsAddingLink(false);
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    onLinksChange(updatedLinks);
  };

  const updateLink = (index: number, field: "title" | "url", value: string) => {
    const updatedLinks = links.map((link, i) =>
      i === index
        ? {
            ...link,
            [field]: value,
          }
        : link
    );
    onLinksChange(updatedLinks);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    }
  };

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Links ({links.length})
          </h4>
          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200"
              >
                {isReadOnly ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{link.title}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-2" />
                      <input
                        type="text"
                        value={link.title}
                        onChange={(event) => updateLink(index, "title", event.target.value)}
                        placeholder="Link title"
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(index)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(event) => updateLink(index, "url", event.target.value)}
                      placeholder="https://example.com"
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isReadOnly && !isAddingLink ? (
        <Button
          type="button"
          variant="outline"
          className="w-full border-[#000080] text-[#000080] hover:bg-blue-50"
          onClick={() => setIsAddingLink(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      ) : !isReadOnly ? (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            placeholder="Link title (e.g., Documentation)"
            value={newLinkTitle}
            onChange={(e) => setNewLinkTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent"
          />
          <input
            type="url"
            placeholder="URL (e.g., https://example.com)"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button
              type="button"
              className="flex-1 bg-[#000080] hover:bg-[#000060]"
              onClick={addLink}
              disabled={isLoading}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAddingLink(false);
                setNewLinkTitle("");
                setNewLinkUrl("");
                setError("");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LinkInput;
