import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import {
    LuType,
    LuLayoutDashboard,
    LuFileJson,
    LuZap,
    LuChevronRight,
    LuInfo
} from "react-icons/lu";

interface CategoryProps {
    title: string;
    score: number;
    icon: React.ReactNode;
    description: string;
}

const Category = ({ title, score, icon, description }: CategoryProps) => {
    const isHigh = score > 69;
    const isMid = score > 49 && score <= 69;
    const scoreColorClass = isHigh ? 'text-emerald-600' : isMid ? 'text-amber-600' : 'text-rose-600';
    const bgColorClass = isHigh ? 'bg-emerald-50' : isMid ? 'bg-amber-50' : 'bg-rose-50';

    return (
        <div className="group relative flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${bgColorClass} flex items-center justify-center text-xl transition-transform group-hover:scale-110`}>
                    <span className={scoreColorClass}>{icon}</span>
                </div>
                <div>
                    <h4 className="text-slate-900 font-bold flex items-center gap-2">
                        {title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className={`text-xl font-black ${scoreColorClass}`}>
                        {score}<span className="text-[10px] text-slate-400 font-normal ml-0.5 uppercase tracking-tighter">/100</span>
                    </div>
                    <ScoreBadge score={score} />
                </div>
                <LuChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="w-full space-y-6">
            {/* Header / Hero Section of the Summary */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />

                <div className="relative shrink-0 bg-white/5 p-4 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
                    <ScoreGauge score={feedback.overallScore} />
                </div>

                <div className="relative space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                        <LuZap className="w-3 h-3" /> Performance Overview
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight leading-none">
                        Overall <span className="text-indigo-400">Analysis Score</span>
                    </h2>
                    <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                        Your resume was evaluated against industry standards and job-specific requirements. Here is how you rank.
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Category
                    title="Tone & Style"
                    score={feedback.toneAndStyle.score}
                    icon={<LuType />}
                    description="Professionalism, clarity, and voice."
                />
                <Category
                    title="Content Quality"
                    score={feedback.content.score}
                    icon={<LuFileJson />}
                    description="Impactful verbs and data-driven points."
                />
                <Category
                    title="Structural Flow"
                    score={feedback.structure.score}
                    icon={<LuLayoutDashboard />}
                    description="Visual hierarchy and layout logic."
                />
                <Category
                    title="Skills Mapping"
                    score={feedback.skills.score}
                    icon={<LuZap />}
                    description="Technical and soft skill alignment."
                />
            </div>

            {/* Quick Tip Footer */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <LuInfo className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900/70 leading-relaxed font-medium">
                    <span className="font-bold text-indigo-900">Pro Tip:</span> Aim for a score above 80 in "Content Quality" to significantly increase your chances of moving past the initial recruiter screening phase.
                </p>
            </div>
        </div>
    )
}

export default Summary;