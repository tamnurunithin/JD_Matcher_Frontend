import { useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  ClipboardList,
  FileSearch,
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";

const API_URL = "https://jd-matcher-backend-1.onrender.com";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!resume || !jobDescription.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/match`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  const matchedSkills = result?.matched_skills || [];
  const missingSkills = result?.missing_skills || [];
  const grammarIssues = result?.grammar_issues || [];
  const suggestions = result?.improvement_suggestions || [];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
              <FileSearch size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-normal text-slate-950">
                Resume JD Matcher
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                AI-powered ATS scoring, skill gap analysis, and resume feedback.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Engine
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">Groq LLM</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Search
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">FAISS</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Stack
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">LangChain</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleAnalyze}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
        >
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-slate-950">
              Analyze Resume
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Upload a PDF/DOCX resume and paste the target job description.
            </p>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-800">
              Resume PDF/DOCX
            </span>
            <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(event) => setResume(event.target.files[0])}
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue-800"
              />
              {resume && (
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={16} />
                  {resume.name}
                </p>
              )}
            </div>
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-800">
              Job Description
            </span>
            <textarea
              rows="13"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-800 bg-blue-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-400"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing Resume
              </>
            ) : (
              <>
                <Upload size={18} />
                Analyze Resume
              </>
            )}
          </button>
        </form>

        <div className="space-y-6">
          {!result ? (
            <section className="flex min-h-[560px] items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-soft">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
                  <Brain size={34} />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                  Ready for analysis
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your ATS score, matched skills, missing skills, grammar issues,
                  and AI recommendations will appear here.
                </p>
              </div>
            </section>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-[220px_1fr]">
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                  <p className="text-sm font-bold text-slate-500">ATS Score</p>
                  <p className="mt-4 text-6xl font-black text-blue-700">
                    {result.ats_score}%
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Based on AI review and skill alignment.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-700" />
                    <h2 className="text-lg font-extrabold text-slate-950">
                      AI Summary
                    </h2>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    {result.summary || "No AI summary returned yet."}
                  </p>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <ResultCard
                  icon={<CheckCircle size={20} />}
                  title="Matched Skills"
                  items={matchedSkills}
                  emptyText="No matched skills found."
                  tone="green"
                />

                <ResultCard
                  icon={<AlertTriangle size={20} />}
                  title="Missing Skills"
                  items={missingSkills}
                  emptyText="No missing skills found."
                  tone="amber"
                />

                <ResultCard
                  icon={<ClipboardList size={20} />}
                  title="Improvement Suggestions"
                  items={suggestions}
                  emptyText="No suggestions returned yet."
                  tone="blue"
                />

                <ResultCard
                  icon={<AlertTriangle size={20} />}
                  title="Grammar Issues"
                  items={grammarIssues}
                  emptyText="No repeated words found."
                  tone="red"
                />
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-extrabold text-slate-950">
                  Tailored Resume Summary
                </h2>
                <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {result.tailored_resume_summary ||
                    "Tailored resume summary will appear here."}
                </p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-extrabold text-slate-950">
                  Resume Preview
                </h2>
                <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                  {result.resume_preview}
                </pre>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function ResultCard({ icon, title, items, emptyText, tone }) {
  const toneClasses = {
    green: "border-green-200 bg-green-50 text-green-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2 text-slate-900">
        <span className="text-blue-700">{icon}</span>
        <h3 className="text-base font-extrabold">{title}</h3>
      </div>

      {items.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${toneClasses[tone]}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">{emptyText}</p>
      )}
    </div>
  );
}

export default App;
