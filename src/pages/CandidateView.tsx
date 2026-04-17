import React, { useState, useEffect, useRef } from "react";
import { excelQuestions, Question } from "../data/questions";
import { cn } from "../lib/utils";
import { CheckCircle2, XCircle, ArrowRight, FileSpreadsheet, Timer, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";

type AssessmentState = "intro" | "quiz" | "results";

const OVERALL_TIME_LIMIT = 50 * 60; // 50 minutes
const QUESTION_TIME_LIMIT = 2 * 60; // 2 minutes

export default function CandidateView() {
  const [appState, setAppState] = useState<AssessmentState>("intro");
  const [candidateName, setCandidateName] = useState("");
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timers State
  const [overallTimeLeft, setOverallTimeLeft] = useState(OVERALL_TIME_LIMIT);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME_LIMIT);

  // Refs for timer interval to access latest state without dependency closures breaking intervals
  const userAnswersRef = useRef<number[]>(userAnswers);
  const currentIndexRef = useRef<number>(currentQuestionIndex);
  const appStateRef = useRef<AssessmentState>(appState);
  const isSubmittingRef = useRef<boolean>(isSubmitting);
  const overallTimeRef = useRef(OVERALL_TIME_LIMIT);
  const questionTimeRef = useRef(QUESTION_TIME_LIMIT);
  const questionsLengthRef = useRef(0);

  useEffect(() => { userAnswersRef.current = userAnswers; }, [userAnswers]);
  useEffect(() => { currentIndexRef.current = currentQuestionIndex; }, [currentQuestionIndex]);
  useEffect(() => { appStateRef.current = appState; }, [appState]);
  useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);
  useEffect(() => { questionsLengthRef.current = shuffledQuestions.length; }, [shuffledQuestions]);

  const currentQuestion: Question | undefined = shuffledQuestions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateName.trim()) {
      // Shuffle questions dynamically for each new start
      const shuffled = [...excelQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledQuestions(shuffled);
      setAppState("quiz");
    }
  };

  const doFinishQuiz = async (finalAnswers: number[]) => {
    setIsSubmitting(true);
    let score = 0;
    finalAnswers.forEach((answer, index) => {
      const q = shuffledQuestions[index];
      if (q && answer === q.correctAnswerIndex) {
        score += 1;
      }
    });

    try {
      const { error } = await supabase.from('results').insert([{
        name: candidateName,
        score,
        total: shuffledQuestions.length,
        answers: finalAnswers
      }]);

      if (error) {
        console.error("Supabase Insertion Error:", error);
      }
    } catch (e) {
      console.error("Failed to submit results", e);
    }

    setIsSubmitting(false);
    setAppState("results");
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const nextIdx = currentQuestionIndex + 1;
      const newAnswers = [...userAnswers, selectedOption];
      setUserAnswers(newAnswers);
      setSelectedOption(null);
      
      if (nextIdx < shuffledQuestions.length) {
        setCurrentQuestionIndex(nextIdx);
        // Reset question timer manually for explicitly clicking 'Next'
        questionTimeRef.current = QUESTION_TIME_LIMIT;
        setQuestionTimeLeft(QUESTION_TIME_LIMIT);
      } else {
        doFinishQuiz(newAnswers);
      }
    }
  };

  // Main Quiz Timer Loop
  useEffect(() => {
    if (appState !== "quiz") return;
    
    overallTimeRef.current = OVERALL_TIME_LIMIT;
    questionTimeRef.current = QUESTION_TIME_LIMIT;

    const timer = setInterval(() => {
      if (appStateRef.current !== "quiz" || isSubmittingRef.current || questionsLengthRef.current === 0) return;
      
      overallTimeRef.current -= 1;
      questionTimeRef.current -= 1;
      
      setOverallTimeLeft(overallTimeRef.current);
      setQuestionTimeLeft(questionTimeRef.current);
      
      // Handle overall test timeout
      if (overallTimeRef.current <= 0) {
        clearInterval(timer);
        const remaining = questionsLengthRef.current - userAnswersRef.current.length;
        const finalAns = [...userAnswersRef.current, ...Array(remaining).fill(-1)];
        setUserAnswers(finalAns);
        doFinishQuiz(finalAns);
        return;
      }
      
      // Handle individual question timeout
      if (questionTimeRef.current <= 0) {
        const nextIdx = currentIndexRef.current + 1;
        const finalAns = [...userAnswersRef.current, -1]; // -1 marks unanswered/timeout
        setUserAnswers(finalAns);
        setSelectedOption(null);
        
        if (nextIdx < questionsLengthRef.current) {
          setCurrentQuestionIndex(nextIdx);
          questionTimeRef.current = QUESTION_TIME_LIMIT;
          setQuestionTimeLeft(QUESTION_TIME_LIMIT);
        } else {
          clearInterval(timer);
          doFinishQuiz(finalAns);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [appState]);

  if (appState === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 bg-[#F3F4F6]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-[#E5E7EB] rounded shadow-sm p-8"
        >
          <div className="w-12 h-12 bg-[#107C41] text-white rounded flex items-center justify-center mx-auto mb-6">
            <FileSpreadsheet size={24} />
          </div>
          <h1 className="text-[22px] font-semibold text-[#1F2937] mb-2 text-center">Excel Skills Assessment</h1>
          <p className="text-[#6B7280] text-sm text-center mb-6">
            Complete this multiple-choice quiz to test your proficiency in Microsoft Excel. This includes Advanced Modules (VBA, Power Query, Data Modeling).
          </p>
          
          <div className="bg-[#FFFBEB] border border-[#FEF3C7] text-[#92400E] px-4 py-3 rounded text-sm mb-6 flex items-start gap-2.5">
             <Timer size={18} className="shrink-0 mt-0.5" />
             <p>This assessment is timed. You have <strong>50 minutes</strong> total to complete {excelQuestions.length} questions, and <strong>2 minutes</strong> per individual question.</p>
          </div>

          <form onSubmit={handleStart} className="space-y-5">
            <div className="text-left">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Applicant Profile</label>
              <input
                id="name"
                type="text"
                required
                placeholder="Full Name (e.g. Jane Doe)"
                className="w-full px-3 py-2 rounded border border-[#E5E7EB] focus:ring-1 focus:ring-[#107C41] focus:border-[#107C41] outline-none transition-colors text-[15px]"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#107C41] hover:bg-[#0A5A30] text-white font-semibold py-2.5 px-4 rounded transition-colors text-sm"
            >
              Start Assessment <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (appState === "quiz" && currentQuestion) {
    return (
      <div className="flex h-[calc(100vh-60px)] bg-[#E5E7EB] text-[#1F2937]">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white flex flex-col gap-6 p-5 shrink-0 border-r border-[#E5E7EB]">
          <div className="p-4 bg-[#F3F4F6] rounded border border-[#E5E7EB]">
            <p className="text-[10px] uppercase tracking-wider text-[#6B7280] mb-1.5">Applicant Profile</p>
            <h3 className="text-sm font-semibold truncate">{candidateName}</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-xs font-semibold mb-3 sticky top-0 bg-white z-10 pb-2">Question Navigator</p>
            <div className="grid grid-cols-5 gap-2">
              {shuffledQuestions.map((q, i) => {
                const isCompleted = i < currentQuestionIndex;
                const isActive = i === currentQuestionIndex;
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center border rounded text-[13px] font-semibold",
                      isActive ? "border-2 border-[#107C41] text-[#107C41]" :
                      isCompleted ? "bg-[#107C41] text-white border-[#107C41]" :
                      "border-[#E5E7EB] text-[#6B7280]"
                    )}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-[#E5E7EB] text-[11.5px] font-medium text-[#6B7280] space-y-2">
            <p className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#107C41]"></span> Answered: {currentQuestionIndex}/{shuffledQuestions.length}
            </p>
            <p className="flex items-center gap-2 text-[#EF4444]">
               <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Overall Time Left: {formatTime(overallTimeLeft)}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 bg-white p-10 flex flex-col overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 max-w-4xl"
            >
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[#107C41] font-bold uppercase tracking-[1px] text-xs">
                      Question {String(currentQuestionIndex + 1).padStart(2, '0')} of {shuffledQuestions.length}
                    </span>
                    <span className="bg-[#F3F4F6] border border-[#E5E7EB] text-[#4B5563] text-[9.5px] font-bold uppercase tracking-wider py-0.5 px-2 rounded">
                      Section: {currentQuestion.section}
                    </span>
                    {currentQuestion.isAdvanced && (
                       <span className="bg-[#FEFCE8] text-[#A16207] border border-[#FEF08A] text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0">Advanced</span>
                    )}
                  </div>
                  
                  <h2 className="text-[22px] leading-[1.4] font-medium text-[#1F2937]">
                    {currentQuestion.text}
                  </h2>
                </div>

                <div className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded border font-mono font-bold text-[15px] shrink-0",
                  questionTimeLeft <= 30 ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] animate-pulse" : "bg-[#F3F4F6] border-[#E5E7EB] text-[#4B5563]"
                )}>
                   <Timer size={18} />
                   <span>{formatTime(questionTimeLeft)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-5">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={cn(
                      "flex items-center p-4 border rounded-lg cursor-pointer transition-colors text-left",
                      selectedOption === index
                        ? "border-[#107C41] bg-[#ECFDF5]"
                        : "border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 border-2 rounded-full mr-4 relative shrink-0",
                      selectedOption === index ? "border-[#107C41]" : "border-[#E5E7EB]"
                    )}>
                      {selectedOption === index && (
                        <div className="absolute w-2.5 h-2.5 bg-[#107C41] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <footer className="mt-auto pt-6 flex items-center justify-between border-t border-[#E5E7EB]">
              <div className="text-xs text-[#6B7280]">
                 <span className="font-semibold text-[#1F2937]">Note:</span> You cannot return to previous questions.
              </div>
             <button
                onClick={handleNext}
                disabled={selectedOption === null || isSubmitting}
                className="flex items-center gap-2 bg-[#107C41] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] hover:bg-[#0A5A30] text-white font-semibold py-2.5 px-6 rounded transition-colors text-sm disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : currentQuestionIndex === shuffledQuestions.length - 1 ? "End Test" : "Next Question"}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
          </footer>
        </section>
      </div>
    );
  }

  // Results State
  const score = userAnswers.reduce((acc, ans, i) => {
    const q = shuffledQuestions[i];
    if (!q) return acc;
    return acc + (ans === q.correctAnswerIndex ? 1 : 0)
  }, 0);
  const percentage = Math.round((score / shuffledQuestions.length) * 100) || 0;
  const passed = percentage >= 25;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Sidebar Summary */}
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-white border border-[#E5E7EB] shadow-sm rounded-lg p-6 md:col-span-1 sticky top-6"
        >
           <h3 className="text-base font-semibold mb-4 text-center">Performance Summary</h3>
           <div className={cn(
             "w-20 h-20 border-[6px] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4",
             passed ? "border-[#107C41] text-[#107C41]" : "border-[#EF4444] text-[#EF4444]"
           )}>
             {percentage}%
           </div>
           <p className={cn(
             "text-center font-semibold mb-5 pb-5 border-b border-[#F3F4F6]",
             passed ? "text-[#107C41]" : "text-[#EF4444]"
           )}>
             {passed ? "Passed (Level: Competent)" : "Needs Review"}
           </p>

           <div className="space-y-0 text-[13px] text-[#1F2937]">
             <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
               <span className="text-[#6B7280]">Total Questions</span>
               <span className="font-semibold">{shuffledQuestions.length}</span>
             </div>
             <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
               <span className="text-[#6B7280]">Correct Answers</span>
               <span className="font-semibold text-[#107C41]">{score}</span>
             </div>
             <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
               <span className="text-[#6B7280]">Incorrect / Skipped</span>
               <span className="font-semibold text-[#EF4444]">{shuffledQuestions.length - score}</span>
             </div>
           </div>

           <div className="mt-5 p-3 bg-[#F3F4F6] rounded text-[11px]">
             <p className="font-bold mb-1 border-b border-gray-200 pb-1">Recruiter Status:</p>
             <p className="text-[#107C41] mt-2">✓ Results synced to hiring manager</p>
             <p className="text-[#6B7280] mt-1 break-all">ID: {candidateName.toLowerCase().replace(/\s+/g,'-')}-{Date.now().toString().slice(-4)}</p>
           </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <div className="md:col-span-2 space-y-4">
           {shuffledQuestions.map((q, i) => {
               const userAnswer = userAnswers[i];
               const isCorrect = userAnswer === q.correctAnswerIndex;
               const isSkipped = userAnswer === -1 || userAnswer === undefined;

               return (
                 <div key={q.id} className="p-5 bg-white rounded-lg border border-[#E5E7EB] flex gap-4 text-sm shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-current" style={{ color: isCorrect ? '#107C41' : '#EF4444' }}></div>

                   <div className="mt-0.5 shrink-0">
                     {isCorrect ? <CheckCircle2 className="text-[#107C41]" size={18} /> : <XCircle className="text-[#EF4444]" size={18} />}
                   </div>
                   <div className="flex-1 text-[#1F2937]">
                     <div className="flex flex-col mb-3">
                       <div className="flex flex-wrap items-center gap-2 mb-1.5">
                         <span className="bg-[#F3F4F6] border border-[#E5E7EB] text-[#4B5563] text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded shrink-0">
                           Section: {q.section}
                         </span>
                         {q.isAdvanced && (
                           <span className="bg-[#FEFCE8] text-[#A16207] border border-[#FEF08A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0">
                             Advanced
                           </span>
                         )}
                       </div>
                       <p className="font-medium text-[15px] leading-snug">Q{i + 1}. {q.text}</p>
                     </div>
                     
                     <div className="grid gap-2">
                       {!isCorrect && !isSkipped && (
                         <div className="px-3 py-2 bg-[#FEF2F2] border border-[#FECACA] rounded text-[#991B1B]">
                           <span className="font-semibold">Your Answer:</span> {q.options[userAnswer]}
                         </div>
                       )}
                       {isSkipped && (
                         <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                           <span className="font-semibold flex items-center gap-1.5"><AlertCircle size={15}/> Time Expired / Skipped</span>
                         </div>
                       )}
                       
                       <div className="px-3 py-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded text-[#065F46]">
                         <span className="font-semibold">Correct Answer:</span> {q.options[q.correctAnswerIndex]}
                       </div>
                       
                       <div className="mt-2 bg-[#F8FAFC] border-l-4 border-[#107C41] p-3 text-[13px] text-[#334155]">
                         <span className="font-semibold text-[#1F2937] block mb-1">Explanation</span>
                         {q.explanation}
                       </div>
                     </div>
                   </div>
                 </div>
               );
           })}
        </div>
      </div>
    </div>
  );
}
