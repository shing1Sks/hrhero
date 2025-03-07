"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export default function ResumeAnalyzer() {
  const [data, setData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedMail, setGeneratedMail] = useState(null);
  const [loadingMail, setLoadingMail] = useState(false);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/resumes_analysis`
      );
      setData(res.data.resumes_analysis);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleGenerateMail = async () => {
    if (!customPrompt.trim()) return alert("Please enter a prompt first.");
    setLoadingMail(true);
    setGeneratedMail(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/reachout`, {
        prompt:
          customPrompt +
          "candidate details are -" +
          JSON.stringify(selectedCandidate.candidate_details),
      });
      console.log(res.data);
      setGeneratedMail(res.data.mail[0]);
    } catch (error) {
      console.error("Failed to generate mail", error);
    } finally {
      setLoadingMail(false);
    }
  };

  const chartData = data.map((candidate) => ({
    name: candidate.candidate_details.name,
    experience: candidate.experiance_score,
    project: candidate.project_score,
    relevance: candidate.relevance_score,
    special: candidate.special_score,
  }));

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Result Analysis</h1>

      <Card>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              onClick={({ activePayload }) =>
                setSelectedCandidate(
                  data.find(
                    (c) =>
                      c.candidate_details.name === activePayload[0].payload.name
                  )
                )
              }
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="experience" fill="#8884d8" />
              <Bar dataKey="project" fill="#82ca9d" />
              <Bar dataKey="relevance" fill="#ffc658" />
              <Bar dataKey="special" fill="#ff7f50" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {selectedCandidate && (
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">
              {selectedCandidate.candidate_details.name}
            </h2>
            <p>
              <strong>Email:</strong>{" "}
              {selectedCandidate.candidate_details.email}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {selectedCandidate.candidate_details.contact}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {selectedCandidate.candidate_details.location}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              {selectedCandidate.candidate_details.linkedin}
            </p>
            <p>
              <strong>Academic:</strong> {selectedCandidate.academic.join(", ")}
            </p>
            <p>
              <strong>Skills:</strong> {selectedCandidate.skill_set.join(", ")}
            </p>

            <div className="flex gap-4 flex-wrap">
              {selectedCandidate?.candidate_details?.email ? (
                <>
                  <Button asChild>
                    <a
                      href={`mailto:${selectedCandidate.candidate_details.email}`}
                      rel="noopener noreferrer"
                    >
                      Reach Out via Email
                    </a>
                  </Button>

                  {generatedMail && (
                    <Button asChild variant="secondary">
                      <a
                        href={`mailto:${
                          selectedCandidate.candidate_details.email
                        }?subject=${encodeURIComponent(
                          generatedMail.subject
                        )}&body=${encodeURIComponent(generatedMail.body)}`}
                        rel="noopener noreferrer"
                      >
                        Send Mail Generated by AI
                      </a>
                    </Button>
                  )}
                </>
              ) : (
                <p>No email available for this candidate</p>
              )}
            </div>

            {/* ✨ Custom Prompt Section */}
            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-medium">Generate Mail by AI</h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe the job, candidate, and company..."
                className="w-full p-2 border rounded-md"
                rows={4}
              />
              <Button onClick={handleGenerateMail} disabled={loadingMail}>
                {loadingMail ? "Generating..." : "Generate Email"}
              </Button>
            </div>

            {generatedMail && (
              <div className="mt-4 p-4 border rounded-md bg-muted space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Subject:
                  </label>
                  <Input
                    value={generatedMail.subject}
                    onChange={(e) =>
                      setGeneratedMail({
                        ...generatedMail,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Body:
                  </label>
                  <Textarea
                    value={generatedMail.body}
                    onChange={(e) =>
                      setGeneratedMail({
                        ...generatedMail,
                        body: e.target.value,
                      })
                    }
                    placeholder="Enter email body"
                    rows={8}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
