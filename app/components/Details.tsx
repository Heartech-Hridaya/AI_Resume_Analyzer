import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ScoreBadge = ({ score }: { score: number }) => {
  const isHighParams = score > 69;
  const isMidParams = score > 39 && score <= 69;
  const isLowParams = score <= 39;

  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center px-3 py-1 rounded-[96px]",
        isHighParams
          ? "bg-badge-green"
          : isMidParams
            ? "bg-badge-yellow"
            : "bg-badge-red"
      )}
    >
      {isHighParams ? (
        <FaCheckCircle className="size-4 text-badge-green-text" />
      ) : (
        <FaExclamationTriangle className={cn("size-4", isMidParams ? "text-badge-yellow-text" : "text-badge-red-text")} />
      )}
      <p
        className={cn(
          "text-sm font-medium",
          isHighParams
            ? "text-badge-green-text"
            : isMidParams
              ? "text-badge-yellow-text"
              : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2 w-full justify-between pr-4">
      <p className="text-xl font-semibold text-gray-800">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full mt-4">
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-3 rounded-2xl p-5 border",
              tip.type === "good"
                ? "bg-badge-green border-badge-green"
                : "bg-badge-yellow border-badge-yellow"
            )}
          >
            <div className="flex flex-row gap-3 items-center">
              {tip.type === "good" ? (
                <FaCheckCircle className="size-5 text-badge-green-text shrink-0" />
              ) : (
                <FaExclamationTriangle className="size-5 text-badge-yellow-text shrink-0" />
              )}
              <p className={cn("text-lg font-semibold", tip.type === "good" ? "text-badge-green-text" : "text-badge-yellow-text")}>{tip.tip}</p>
            </div>
            <p className={cn("text-gray-700 leading-relaxed", tip.type === "good" ? "text-badge-green-text/80" : "text-badge-yellow-text/80")}>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
