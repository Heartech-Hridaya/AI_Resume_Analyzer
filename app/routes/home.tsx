import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { LuScanLine } from "react-icons/lu";

// ------------------ META ------------------
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

// ------------------ LOOPING TYPEWRITER ------------------
interface TypingTextProps {
  text: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 120 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

  // Typewriter logic (restarts every cycle change)
  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const typingInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index === text.length) {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, cycle]);

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Restart typing every 5 seconds
  useEffect(() => {
    const restartInterval = setInterval(() => {
      setCycle((c) => c + 1);
    }, 5000);

    return () => clearInterval(restartInterval);
  }, []);

  return (
    <span>
      {displayedText}
      <span
        className="inline-block w-1 bg-primary ml-1"
        style={{
          opacity: cursorVisible ? 1 : 0,
          height: "1em",
          transform: "translateY(2px)",
        }}
      ></span>
    </span>
  );
};

// ------------------ MAIN HOME COMPONENT ------------------
export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // redirect if not authenticated
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  // load resumes
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes =
        resumes?.map((resume) => JSON.parse(resume.value) as Resume) || [];

      setResumes(parsedResumes);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="">
      <Navbar />

      <section className="main-section">
        {/* PAGE HEADING */}
        <div className="page-heading py-16">
          <h1 className="text-5xl font-bold text-primary">
            Track Your Applications & Resume{" "}
            <TypingText text="Ratings" />
          </h1>

          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="text-2xl font-bold text-primary">
              No resumes found. Upload your first resume to get feedback.
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-primary">
              Review your submissions and check AI-powered feedback.
            </h2>
          )}
        </div>

        {/* LOADING */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-20">
            <LuScanLine className="w-24 h-24 text-primary animate-pulse" />
            <p className="text-gray-500 mt-4">Scanning your resumes...</p>
          </div>
        )}

        {/* LIST OF RESUMES */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
