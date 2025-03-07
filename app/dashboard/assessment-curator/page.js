"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function AssessmentCurator() {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [shareWithEmail, setShareWithEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/assessment_curator`,
        {
          prompt,
          description,
          share_with_email: shareWithEmail,
        }
      );
      setResult(response.data.link || "Assessment created successfully!");
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Curator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Prompt</Label>
            <div className="h-2"></div>
            <Textarea
              placeholder="Enter the assessment prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <div className="h-2"></div>
            <Textarea
              placeholder="Enter the jod description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Share With Email</Label>
            <div className="h-2"></div>
            <Input
              type="email"
              placeholder="Enter email to share the form link..."
              value={shareWithEmail}
              onChange={(e) => setShareWithEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate Assessment"}
          </Button>
          {result && (
            <div className="p-3 mt-4 rounded-md bg-gray-100 dark:bg-gray-800 text-sm">
              <a href={result} target="_blank">
                {result}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
