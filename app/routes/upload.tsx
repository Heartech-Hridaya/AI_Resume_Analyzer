import { useState, type FormEvent } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { 
    LuScanLine, 
    LuBriefcase, 
    LuBuilding2, 
    LuFileText, 
    LuSparkles, 
    LuCircleCheck 
} from "react-icons/lu";

const Upload = () => {
    const { fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");

    const handleFileSelect = (file: File | null) => setFile(file);

    interface AnalyzeParams {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: AnalyzeParams) => {
        try {
            setIsProcessing(true);
            setStatusText("Uploading original document...");
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) throw new Error("Upload failed");

            setStatusText("Optimizing for AI vision...");
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) throw new Error("PDF conversion failed");

            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) throw new Error("Image upload failed");

            const uuid = generateUUID();
            setStatusText("Analyzing matching patterns...");

            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback) throw new Error("AI failed to generate response");

            const feedbackText =
                typeof feedback.message.content === "string"
                    ? feedback.message.content
                    : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Success! Redirecting...");
            setTimeout(() => navigate(`/resume/${uuid}`), 800);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setStatusText("Error: " + errorMessage);
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file || !companyName || !jobTitle || !jobDescription) {
            setStatusText("Please ensure all fields are filled.");
            return;
        }
        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <Navbar />

            <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left Column: Branding & Value Props */}
                    <div className="space-y-8 lg:sticky lg:top-32">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold tracking-wide uppercase">
                                <LuSparkles className="w-4 h-4" /> AI-Powered Intelligence
                            </span>
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                Optimized for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                    Career Growth.
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                                Don't let your resume get lost in the void. Our AI provides the exact feedback you need to bypass ATS filters and impress hiring managers.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "ATS Compatibility Analysis",
                                "Keyword & Skill Gap Mapping",
                                "Contextual Content Optimization"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <LuCircleCheck className="text-emerald-500 w-5 h-5" /> {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-8 border-t border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-${i+2}00 flex items-center justify-center text-[10px] font-bold bg-slate-200 text-slate-400`}>
                                            User
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500">
                                    Trusted by <span className="font-bold text-slate-900">5,000+</span> candidates worldwide.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interaction Card */}
                    <div className="relative">
                        {/* Decorative background glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-violet-100 rounded-[3rem] -z-10 blur-3xl opacity-60" />

                        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 lg:p-10">
                            {isProcessing ? (
                                <div className="py-20 flex flex-col items-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                            <LuScanLine className="w-12 h-12 text-indigo-600 animate-pulse" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900">Processing Document</h3>
                                        <p className="text-slate-500 font-medium">{statusText}</p>
                                    </div>
                                    <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full animate-[shimmer_2s_infinite] w-full" 
                                             style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <LuBuilding2 className="w-4 h-4 text-slate-400" /> Target Company
                                            </label>
                                            <input
                                                name="company-name"
                                                required
                                                placeholder="e.g. OpenAI"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <LuBriefcase className="w-4 h-4 text-slate-400" /> Target Role
                                            </label>
                                            <input
                                                name="job-title"
                                                required
                                                placeholder="e.g. Frontend Lead"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <LuFileText className="w-4 h-4 text-slate-400" /> Job Description
                                        </label>
                                        <textarea
                                            name="job-description"
                                            required
                                            rows={5}
                                            placeholder="Paste the full job description here..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none bg-slate-50/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Resume Upload</label>
                                        <div className="group relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-300" />
                                            <div className="relative bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-indigo-400 transition-colors">
                                                <FileUploader onFileSelect={handleFileSelect} />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Begin Analysis
                                    </button>
                                    
                                    {statusText && !isProcessing && (
                                        <p className="text-center text-sm text-red-500 font-semibold bg-red-50 py-2 rounded-lg">{statusText}</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Upload;