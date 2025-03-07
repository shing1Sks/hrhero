"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function MonthlySurveyForm() {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [shareWithEmail, setShareWithEmail] = useState("");
  const [formLink, setFormLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateSurvey = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/monthly_survey`,
        {
          prompt,
          description,
          share_with_email: shareWithEmail,
        }
      );
      setFormLink(res.data.link);
    } catch (error) {
      console.error("Failed to create survey", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Monthly Sentiment Survey Rollout</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Prompt</Label>
            <div className="h-2"></div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt for the survey (e.g., ask for some recommendations)"
              rows={3}
            />
          </div>
          <div>
            <Label>Description</Label>
            <div className="h-2"></div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of the survey or details about the target audience"
              rows={6}
            />
          </div>
          <div>
            <Label>Share form edit access with (Email)</Label>
            <div className="h-2"></div>
            <Input
              type="email"
              value={shareWithEmail}
              onChange={(e) => setShareWithEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>
          <Button
            onClick={handleCreateSurvey}
            disabled={loading || !prompt || !description || !shareWithEmail}
          >
            {loading ? "Creating Survey..." : "Create Monthly Survey"}
          </Button>

          {formLink && (
            <div className="mt-6 p-4 border rounded-md bg-muted">
              <p className="text-sm">Survey Form Link:</p>
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium break-all"
              >
                {formLink}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
