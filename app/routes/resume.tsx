import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { LuArrowLeft, LuFileSearch, LuDownload, LuExternalLink, LuShieldCheck } from "react-icons/lu";

export const meta = () => ([
    { title: 'Analysis Report | Resumind' },
    { name: 'description', content: 'Detailed AI analysis of your professional profile' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            setResumeUrl(URL.createObjectURL(pdfBlob));

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            setImageUrl(URL.createObjectURL(imageBlob));

            setFeedback(data.feedback);
        }
        loadResume();
    }, [id]);

    return (
        <main className="min-h-screen bg-[#f8fafc]">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group text-slate-600 hover:text-indigo-600 transition-colors">
                        <LuArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold text-sm uppercase tracking-wider">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded uppercase">AI Analysis Complete</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto p-6">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Side: Document Preview (Fixed) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="lg:sticky lg:top-28 space-y-6">
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        className="p-3 bg-white/90 backdrop-blur shadow-xl rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all block"
                                    >
                                        <LuExternalLink className="w-5 h-5" />
                                    </a>
                                </div>

                                <div className="aspect-[1/1.414] bg-slate-50 overflow-y-auto scrollbar-hide">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            className="w-full h-auto object-cover animate-in fade-in duration-700"
                                            alt="Resume preview"
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                                            <LuFileSearch className="w-16 h-16 text-slate-200 animate-bounce" />
                                            <p className="text-slate-400 font-medium">Loading document view...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-indigo-900 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg shadow-indigo-200">
                                <div>
                                    <h4 className="font-bold text-lg leading-tight">Expert Review</h4>
                                    <p className="text-indigo-200 text-xs">Analysis generated by GPT-4 Vision</p>
                                </div>
                                <LuShieldCheck className="w-10 h-10 text-indigo-400 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Feedback Content (Scrollable) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        <header className="space-y-2">
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                Resume <span className="text-indigo-600">Intelligence Report</span>
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Prepared specifically for your application as a professional candidate.
                            </p>
                        </header>

                        {feedback ? (
                            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                                {/* ATS Card is high priority - give it special treatment */}
                                <section className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
                                    <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                    </div>
                                </section>

                                {/* Summary & Detailed Breakdown */}
                                <div className="grid gap-8">
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <Summary feedback={feedback} />
                                    </div>

                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <Details feedback={feedback} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 space-y-6 bg-white rounded-3xl border border-dashed border-slate-300">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                    <LuFileSearch className="absolute inset-0 m-auto w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-800">Compiling Feedback</h3>
                                    <p className="text-slate-500">Our AI is deep-scanning your document structure...</p>
                                </div>
                            </div>
                        )}

                        {/* Footer Action */}
                        <footer className="pt-12 pb-24 text-center">
                            <button className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200">
                                <LuDownload className="w-5 h-5" /> Download Report PDF
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Resume;