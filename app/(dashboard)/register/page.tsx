"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Registration() {
  const currentSubmission = useQuery(api.submission.getSubmission);
  const submit = useMutation(api.submission.createOrUpdateSubmission);

  const [formData, setFormData] = useState({
    projectName: "",
    members: [""],
    githubUrl: "",
    hostedSiteUrl: "",
    videoOverviewUrl: "",
    description: "",
    favoriteParts: "",
    status: "in-progress" as "in-progress" | "submitted",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when submission loads
  useEffect(() => {
    if (currentSubmission) {
      setFormData({
        projectName: currentSubmission.projectName || "",
        members: currentSubmission.members || [""],
        githubUrl: currentSubmission.githubUrl || "",
        hostedSiteUrl: currentSubmission.hostedSiteUrl || "",
        videoOverviewUrl: currentSubmission.videoOverviewUrl || "",
        description: currentSubmission.description || "",
        favoriteParts: currentSubmission.favoriteParts || "",
        status: currentSubmission.status || "in-progress",
      });
    }
  }, [currentSubmission]);

  const handleSubmit = async (
    e: React.FormEvent,
    status: "in-progress" | "submitted"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty members
      const filteredMembers = formData.members.filter(
        (member) => member.trim() !== ""
      );

      await submit({
        submission: {
          ...formData,
          members: filteredMembers,
          status,
        },
      });

      toast.success(
        status === "submitted"
          ? "Submission submitted successfully!"
          : "Draft saved successfully!"
      );
    } catch (error) {
      toast.error("Failed to save submission. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, ""],
    }));
  };

  const removeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const updateMember = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((member, i) => (i === index ? value : member)),
    }));
  };

  if (currentSubmission === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            T3 Chat Cloneathon Registration
          </h1>
          <p className="text-white/70 text-lg">
            Submit your T3 Chat clone and compete for prizes
          </p>
          {currentSubmission && (
            <Badge variant="secondary" className="mt-2">
              {currentSubmission.status === "submitted" ? "Submitted" : "Draft"}
            </Badge>
          )}
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Project Submission</CardTitle>
            <CardDescription className="text-white/70">
              Fill out the form below to register your project for the
              competition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => handleSubmit(e, "in-progress")}
              className="space-y-6"
            >
              {/* Project Name */}
              <div>
                <Label htmlFor="projectName" className="text-white">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectName: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="My Amazing T3 Chat Clone"
                  required
                />
              </div>

              {/* Team Members */}
              <div>
                <Label className="text-white">Team Members *</Label>
                <p className="text-sm text-white/60 mb-2">
                  Add team member names or handles (max 4 people per team)
                </p>
                <div className="space-y-2">
                  {formData.members.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={member}
                        onChange={(e) => updateMember(index, e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={`Team member ${index + 1}`}
                        required={index === 0}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeMember(index)}
                          className="border-white/20 text-white hover:bg-white/5"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {formData.members.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMember}
                      className="border-white/20 text-white hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  )}
                </div>
              </div>

              {/* GitHub URL */}
              <div>
                <Label htmlFor="githubUrl" className="text-white">
                  GitHub Repository URL *
                </Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="https://github.com/username/project"
                  required
                />
              </div>

              {/* Hosted Site URL */}
              <div>
                <Label htmlFor="hostedSiteUrl" className="text-white">
                  Hosted Site URL
                </Label>
                <Input
                  id="hostedSiteUrl"
                  type="url"
                  value={formData.hostedSiteUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hostedSiteUrl: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="https://your-project.vercel.app"
                />
              </div>

              {/* Video Overview URL */}
              <div>
                <Label htmlFor="videoOverviewUrl" className="text-white">
                  Video Overview URL
                </Label>
                <Input
                  id="videoOverviewUrl"
                  type="url"
                  value={formData.videoOverviewUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      videoOverviewUrl: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-white">
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24"
                  placeholder="Describe your project, key features, and what makes it unique..."
                />
              </div>

              {/* Favorite Parts */}
              <div>
                <Label htmlFor="favoriteParts" className="text-white">
                  What are your favorite parts of your implementation?
                </Label>
                <Textarea
                  id="favoriteParts"
                  value={formData.favoriteParts}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      favoriteParts: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24"
                  placeholder="Tell us about the features or implementation details you're most proud of..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  variant="outline"
                >
                  {isSubmitting ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "submitted")}
                  disabled={
                    isSubmitting ||
                    !formData.projectName ||
                    !formData.githubUrl ||
                    formData.members.filter((m) => m.trim()).length === 0
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Final Entry"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
