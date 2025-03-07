"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [weights, setWeights] = useState({
    experience: 1.0,
    project: 1.0,
    relevance: 1.0,
    special: 1.0,
  });
  const [analysis, setAnalysis] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("description", jobDescription);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST}/resume_analyzer`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(await response.data);
    const data = await response.data;
    setAnalysis(data.analysis);

    const total =
      ((data.analysis.experiance_score * weights.experience +
        data.analysis.project_score * weights.project +
        data.analysis.relevance_score * weights.relevance +
        data.analysis.special_score * weights.special) /
        (weights.experience +
          weights.project +
          weights.relevance +
          weights.special)) *
      10;
    setTotalScore(total.toFixed(2));
    setAnalyzing(false);
  };

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>Resume Analyzer</CardHeader>
        <CardContent className="space-y-4">
          <Label>Upload Resume (PDF)</Label>
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />

          <Label>Job Description</Label>
          <Input
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description"
          />

          <Label>Weights</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(weights).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Label className="capitalize">{key} Weight</Label>
                <Input
                  type="number"
                  value={weights[key]}
                  onChange={(e) =>
                    setWeights({ ...weights, [key]: Number(e.target.value) })
                  }
                  className="w-20"
                />
              </div>
            ))}
          </div>

          <Button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>Analysis Result</CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold">Candidate Details</h3>
              <p>{analysis.candidate_details.name}</p>
              <p>{analysis.candidate_details.email}</p>
              <p>{analysis.candidate_details.contact}</p>
              <p>{analysis.candidate_details.linkedin}</p>
              <p>{analysis.candidate_details.github}</p>
            </div>
            <div>
              <h3 className="font-bold">Skills</h3>
              <p>{analysis.skill_set.join(", ")}</p>
            </div>
            <div>
              <h3 className="font-bold">Academic Background</h3>
              <p>{analysis.academic.join(", ")}</p>
            </div>
            <div>
              <h3 className="font-bold">Scores</h3>
              <p>Experience Score: {analysis.experiance_score}</p>
              <p>Project Score: {analysis.project_score}</p>
              <p>Relevance Score: {analysis.relevance_score}</p>
              <p>Special Score: {analysis.special_score}</p>
              <p className="font-bold text-xl mt-2">
                Total Score: {totalScore}/100
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
