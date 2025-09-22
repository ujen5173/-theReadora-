"use client";

import {
  Bug,
  CheckCircle2,
  Heart,
  Lightbulb,
  MessageSquare,
  Send,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const feedbackCategories = [
  {
    id: "bug",
    label: "Bug Report",
    icon: Bug,
    color: "bg-red-50 border-red-200 text-red-700",
    description: "Something isn't working",
  },
  {
    id: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    description: "Suggest a new feature",
  },
  {
    id: "improvement",
    label: "Improvement",
    icon: Zap,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    description: "Enhance existing features",
  },
  {
    id: "praise",
    label: "Praise",
    icon: Heart,
    color: "bg-pink-50 border-pink-200 text-pink-700",
    description: "Share what you love",
  },
  {
    id: "general",
    label: "General",
    icon: MessageSquare,
    color: "bg-gray-50 border-gray-200 text-gray-700",
    description: "Other feedback",
  },
];

const priorityLevels = [
  { id: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { id: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { id: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

const FeedbackPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [selectedPriority, setSelectedPriority] = useState<string>("medium");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !formData.title || !formData.description) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 sm:p-12 text-center">
                <div className="mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Feedback Sent Successfully!
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Thank you for helping us improve Readora. We'll review your
                    feedback and get back to you soon.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedCategory("");
                    setFormData({ title: "", description: "" });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Send Another Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Share Your Feedback
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Help us improve Readora by sharing your thoughts and suggestions.
              Your feedback shapes the future of our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-8">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-red-50 p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 border border-red-200 rounded-lg">
                    <Star className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      What's on your mind?
                    </h2>
                    <p className="text-slate-600 mt-1">
                      Choose the type of feedback you'd like to share
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {feedbackCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                        selectedCategory === category.id
                          ? "border-blue-300 bg-blue-50 shadow-md scale-[1.02]"
                          : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "p-3 rounded-lg transition-all duration-200",
                            selectedCategory === category.id
                              ? "bg-blue-100 shadow-sm"
                              : "bg-slate-100 group-hover:bg-blue-100"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              selectedCategory === category.id
                                ? "text-blue-600"
                                : "text-slate-600 group-hover:text-blue-600"
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-lg mb-1">
                            {category.label}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Tell us more
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {selectedCategory
                        ? `Share your ${feedbackCategories
                            .find((c) => c.id === selectedCategory)
                            ?.label.toLowerCase()}`
                        : "Select a category to get started"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Priority Selection */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-slate-700">
                      Priority Level
                    </Label>
                    <div className="flex gap-3 flex-wrap">
                      {priorityLevels.map((priority) => (
                        <button
                          key={priority.id}
                          type="button"
                          onClick={() => setSelectedPriority(priority.id)}
                          className={cn(
                            "border border-border px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                            selectedPriority === priority.id
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm"
                          )}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Brief summary of your feedback"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="h-12 text-base"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Share the details of your feedback, suggestions, or experience..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="min-h-[140px] resize-none text-base"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={
                        !selectedCategory ||
                        !formData.title ||
                        !formData.description ||
                        isSubmitting
                      }
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      icon={isSubmitting ? undefined : Send}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Feedback"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
                    <Heart className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Your feedback matters to us
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Every piece of feedback helps us understand what creators
                      need most. We read every submission and use your insights
                      to prioritize new features, fix bugs, and improve the
                      overall experience for everyone in our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
