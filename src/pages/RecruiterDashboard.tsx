import React, { useState, useEffect } from "react";
import { Users, Clock, Award, BarChart3, FileDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../lib/supabase";

type Result = {
  id: string;
  name: string;
  score: number;
  total: number;
  answers: number[];
  submittedAt: string;
};

export default function RecruiterDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase
          .from('results')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase fetch error:", error);
        } else if (data) {
          // Normalize the 'created_at' to submittedAt to match our existing code
          setResults(data.map((item: any) => ({
             ...item,
             submittedAt: item.created_at || item.submittedAt || new Date().toISOString()
          })));
        }
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    
    // Fallback to polling instead of ws to ensure it works without realtime replication enabled
    const interval = setInterval(fetchResults, 4000);
    return () => clearInterval(interval);
  }, []);

  const averageScore = results.length > 0 
    ? Math.round((results.reduce((a, b) => a + (b.score / b.total), 0) / results.length) * 100) 
    : 0;

  const exportPDF = () => {
    const doc = new jsPDF();

    // Headers
    doc.setFontSize(20);
    doc.setTextColor(31, 41, 55); // #1f2937
    doc.text("Excel Skills Assessment Report", 14, 22);
    
    // Sub-header details
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128); // #6b7280
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Candidates: ${results.length} | Average Score: ${averageScore}%`, 14, 36);

    // Prepare table data
    const tableColumn = ["Candidate Name", "Score", "Percentage", "Status", "Submitted At"];
    const tableRows = results.map(r => {
      const percentage = Math.round((r.score / r.total) * 100);
      const passed = percentage >= 25;
      return [
        r.name,
        `${r.score}/${r.total}`,
        `${percentage}%`,
        passed ? "Pass" : "Review",
        new Date(r.submittedAt).toLocaleString()
      ];
    });

    // Generate Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: 'grid',
      styles: {
        fontSize: 10,
        font: 'helvetica',
        textColor: [31, 41, 55],
      },
      headStyles: {
        fillColor: [248, 250, 252], // #F8FAFC
        textColor: [107, 114, 128], // #6B7280
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // #f9fafb
      }
    });

    doc.save("SkillAssess_Candidates_Report.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-end">
        <div>
           <h1 className="text-2xl font-semibold text-[#1F2937]">Recruiter Dashboard</h1>
           <p className="text-[#6B7280] text-sm mt-1">Live monitoring of Excel Skills Assessment submissions.</p>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <div className="text-xs text-[#0284C7] bg-[#F0F9FF] border border-[#BAE6FD] px-3 py-1.5 rounded flex items-center gap-2 font-medium">
              <span className="animate-spin w-3 h-3 border-2 border-inherit border-t-transparent rounded-full" /> Syncing
            </div>
          )}
          <button
            onClick={exportPDF}
            disabled={results.length === 0}
            className="flex items-center gap-2 bg-[#107C41] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] hover:bg-[#0A5A30] text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            <FileDown size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow-sm border border-[#E5E7EB] p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#EFF6FF] text-[#2563EB] rounded flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Total Candidates</p>
            <p className="text-xl font-bold text-[#1F2937] leading-tight mt-0.5">{results.length}</p>
          </div>
        </div>
        <div className="bg-white rounded shadow-sm border border-[#E5E7EB] p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#ECFDF5] text-[#107C41] rounded flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Average Score</p>
            <p className="text-xl font-bold text-[#1F2937] leading-tight mt-0.5">{averageScore}%</p>
          </div>
        </div>
        <div className="bg-white rounded shadow-sm border border-[#E5E7EB] p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFFBEB] text-[#D97706] rounded flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Recent Submission</p>
            <p className="text-base font-bold text-[#1F2937] leading-tight mt-0.5 truncate">
              {results.length > 0 ? new Date(results[0].submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-[#E5E7EB] overflow-hidden">
        {results.length === 0 ? (
          <div className="p-10 text-center text-[#6B7280]">
            <Award className="w-10 h-10 mx-auto text-[#E5E7EB] mb-3" />
            <p className="font-medium">No assessments completed yet.</p>
            <p className="text-xs mt-1">Candidates will appear here in real-time as they finish.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Candidate Name</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Score</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {results.map((result, idx) => {
                  const percentage = Math.round((result.score / result.total) * 100);
                  const passed = percentage >= 25;

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={result.id} 
                      className="hover:bg-[#F9FAFB] transition-colors text-sm"
                    >
                      <td className="px-5 py-3.5 font-medium text-[#1F2937]">{result.name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1F2937]">{result.score}/{result.total}</span>
                          <span className="text-[#6B7280] text-xs">({percentage}%)</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase",
                          passed ? "bg-[#ECFDF5] text-[#107C41] border border-[#A7F3D0]" : "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                        )}>
                          {passed ? "Pass" : "Review"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280] text-[13px]">
                        {new Date(result.submittedAt).toLocaleString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
