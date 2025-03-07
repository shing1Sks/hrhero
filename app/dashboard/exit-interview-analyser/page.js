"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ExitInterview() {
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Start the exit interview?"
  );
  const [userResponse, setUserResponse] = useState("");
  const [finalReport, setFinalReport] = useState(null);

  const handleSendResponse = async () => {
    const updatedHistory = [
      ...history,
      { role: "user", content: userResponse },
    ];

    setHistory(updatedHistory);
    setUserResponse("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/exit_interview`,
        { history: updatedHistory }
      );

      console.log("Response:", res.data);

      const message = JSON.parse(res.data.message);

      if (message.response) {
        setCurrentQuestion(message.response);
      } else {
        setCurrentQuestion("Thank you for your response!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFinishInterview = async () => {
    const updatedHistory = [
      ...history,
      {
        role: "user",
        content:
          userResponse + "conclude the interview and generate the report",
      },
    ];

    setHistory(updatedHistory);
    setUserResponse("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/finish_interview`,
        {
          history: updatedHistory,
        }
      );
      console.log(res);
      console.log("Finish Interview Response:", res.data);
      const report = res.data.message;
      setCurrentQuestion(report.response);
      setFinalReport(report);

      // await axios.post(`${process.env.NEXT_PUBLIC_HOST}/save_report`, {
      //   report,
      // });
    } catch (error) {
      console.error("Error finishing interview:", error);
    }
  };

  return (
    <div className=" mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Exit Interview</h1>

      <Card>
        <CardContent className="space-y-4 p-4 max-h-[500px] overflow-auto">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                item.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <strong>{item.role === "user" ? "You" : "Interviewer"}:</strong>{" "}
              {item.content}
            </div>
          ))}

          {
            <div className="p-2 rounded bg-gray-100">
              <strong>Interviewer:</strong> {currentQuestion}
            </div>
          }
        </CardContent>
      </Card>

      {!finalReport ? (
        <div className="flex gap-2">
          <Input
            placeholder="Type your response..."
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
          />
          <Button onClick={handleSendResponse}>Send</Button>
          {history.length >= 10 && (
            <Button onClick={handleFinishInterview}>Finish Interview</Button>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">Exit Interview Summary</h2>
            <p>
              <strong>Exit Comment:</strong> {finalReport.exit_comment}
            </p>
            <p>
              <strong>Summary:</strong> {finalReport.summary_of_interview}
            </p>

            <div>
              <strong>Attrition Risks:</strong>
              <ul className="list-disc pl-5">
                {finalReport.analysis_report.attrition_risks.map(
                  (risk, idx) => (
                    <li key={idx}>{risk}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <strong>Engagement Recommendations:</strong>
              <ul className="list-disc pl-5">
                {finalReport.analysis_report.engagement_recommendations.map(
                  (rec, idx) => (
                    <li key={idx}>{rec}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <strong>Strategies:</strong>
              <ul className="list-disc pl-5">
                {finalReport.analysis_report.strategies.map((strat, idx) => (
                  <li key={idx}>{strat}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
