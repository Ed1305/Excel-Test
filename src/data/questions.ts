export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  isAdvanced?: boolean;
  section: string;
};

export const excelQuestions: Question[] = [
  // SECTION: Mathematical Operations (SUM, TOTAL, MATH)
  {
    id: 1, text: "What is the standard formula to mathematically add up all values in cells A1 through A10?", options: ["=ADD(A1:A10)", "=SUM(A1:A10)", "=TOTAL(A1:A10)", "=A1+A10"], correctAnswerIndex: 1, explanation: "SUM is the standard Excel function used to add a range of numbers together.", section: "Mathematical Operations"
  },
  {
    id: 2, text: "Which formula calculates the total mathematical revenue (Column C) ONLY for the 'Electronics' department (Column B)?", options: ["=SUM(B2:B100, \"Electronics\")", "=SUMIF(B2:B100, \"Electronics\", C2:C100)", "=TOTALIF(B2:B100=\"Electronics\", C2:C100)", "=FIND(\"Electronics\", SUM(C2:C100))"], correctAnswerIndex: 1, explanation: "SUMIF conditionally adds values using a criteria range, the criteria, and the sum range.", section: "Mathematical Operations"
  },
  {
    id: 3, text: "Which function multiplies corresponding components in given arrays and returns the sum of those products?", options: ["SUMMULTIPLY", "PRODUCTSUM", "SUMPRODUCT", "MULTIPLYADD"], correctAnswerIndex: 2, explanation: "SUMPRODUCT multiplies the corresponding items of arrays and sums the results mathematically.", section: "Mathematical Operations"
  },
  {
    id: 4, text: "Which function allows you to calculate a mathematical subtotal while automatically ignoring rows hidden by a filter?", options: ["SUBTOTAL", "SUMIFVISIBLE", "SUM", "TOTAL"], correctAnswerIndex: 0, explanation: "SUBTOTAL ignores rows that have been excluded by filtering.", section: "Mathematical Operations"
  },
  {
    id: 5, text: "Which formula rounds a specific total mathematically up to the nearest integer no matter the decimal?", options: ["=ROUND(A1, 0)", "=ROUNDUP(A1, 0)", "=CEILING(A1)", "=MATH.UP(A1)"], correctAnswerIndex: 1, explanation: "ROUNDUP mathematically forces a number to round outward from zero.", section: "Mathematical Operations"
  },

  // SECTION: Averages & Missing Values
  {
    id: 6, text: "A student has 5 test score cells (A1:A5), but one cell is completely blank. If you use =AVERAGE(A1:A5), what happens?", options: ["It treats the blank cell as a 0.", "It produces a #DIV/0! error.", "It ignores the blank cell entirely and calculates based on 4 scores.", "It halts calculation."], correctAnswerIndex: 2, explanation: "AVERAGE inherently skips blank cells mathematically.", section: "Averages & Missing Values"
  },
  {
    id: 7, text: "You want the mathematical average for daily expenses (B2:B31) only on days spending strictly more than $50. Which formula applies?", options: ["=AVERAGE(B2:B31, >50)", "=AVERAGEIF(B2:B31, \">50\")", "=SUMIF(B2:B31, \">50\")/30", "=MEANIF(B2:B31, >50)"], correctAnswerIndex: 1, explanation: "AVERAGEIF calculates the mean of all cells that strictly meet the requested mathematical criteria.", section: "Averages & Missing Values"
  },
  {
    id: 8, text: "Which mathematical function quickly calculates exactly how many cells are MISSING/EMPTY in the range D2:D101?", options: ["=COUNTA(D2:D101)", "=COUNTMISSING(D2:D101)", "=COUNTBLANK(D2:D101)", "=COUNT(D2:D101, \" \")"], correctAnswerIndex: 2, explanation: "COUNTBLANK explicitly counts how many mathematically empty cells exist within a range.", section: "Averages & Missing Values"
  },
  {
    id: 9, text: "You are checking for missing inventory in cell C2. Which formula returns 'Missing' if empty, and 'OK' if an amount exists?", options: ["=IF(C2=0, \"Missing\", \"OK\")", "=IF(ISBLANK(C2), \"Missing\", \"OK\")", "=FIND(BLANK, C2, \"Missing\", \"OK\")", "=CHECKBLANK(C2, \"Missing\", \"OK\")"], correctAnswerIndex: 1, explanation: "ISBLANK yields TRUE if a cell is empty. Nested in IF, it returns your custom status string.", section: "Averages & Missing Values"
  },
  {
    id: 10, text: "Which function tells you the exact highest mathematical value in a range to identify peak metrics?", options: ["TOP", "MAX", "HIGHEST", "PEAK"], correctAnswerIndex: 1, explanation: "The MAX function mathematically surveys the range and pulls the largest numeric value.", section: "Averages & Missing Values"
  },

  // SECTION: Graphing & Visualization
  {
    id: 11, text: "Which chart/graph type is best suited to draw a continuous mathematical timeline trend (e.g., total revenue over a 12-month period)?", options: ["Pie Chart", "Scatter Plot", "Line Chart", "Radar Chart"], correctAnswerIndex: 2, explanation: "Line charts connect continuous data points ideally to indicate trends linearly over an axis of time.", section: "Graphing & Visualization"
  },
  {
    id: 12, text: "Which graph intuitively draws the percentage breakdown of 5 different department budgets representing the total whole budget?", options: ["Line Chart", "Pie Chart", "Histogram", "Waterfall Chart"], correctAnswerIndex: 1, explanation: "A Pie chart fundamentally illustrates parts-to-a-whole percentage proportions.", section: "Graphing & Visualization"
  },
  {
    id: 13, text: "To compare the individual total mathematical performance of five distinct salespeople side-by-side, which graph is most robust?", options: ["Bar/Column Chart", "Area Chart", "Scatter Plot", "Donut Chart"], correctAnswerIndex: 0, explanation: "Bar or Column charts clearly illustrate standalone category quantities so visual size gaps are obvious.", section: "Graphing & Visualization"
  },
  {
    id: 14, text: "Which chart beautifully draws the cumulative mathematical differences bridging consecutive positive and negative values?", options: ["Waterfall Chart", "Stock Chart", "Surface Graph", "Tree Map"], correctAnswerIndex: 0, explanation: "Waterfall charts show a running total across increasing or decreasing intermediary step points visually bridging logic.", section: "Graphing & Visualization"
  },
  {
    id: 15, text: "Which feature mathematically highlights cells (e.g. coloring green) actively matching an internal value criteria natively without a chart?", options: ["Graph Logic", "Paint Bucket", "Conditional Formatting", "Cell Styles Tracker"], correctAnswerIndex: 2, explanation: "Conditional formatting dynamically alters the styling based on internal logic conditions holding true (like > 90%).", section: "Graphing & Visualization"
  },

  // SECTION: Logic & Reference
  {
    id: 16, text: "Which function is used to vertically find a value in the leftmost column of a table and return a corresponding value in the same row?", options: ["HLOOKUP", "VLOOKUP", "XMATCH", "INDEX"], correctAnswerIndex: 1, explanation: "VLOOKUP searches down the first column of a range and returns a value in the same row from a specified reference column.", section: "Logic & Reference"
  },
  {
    id: 17, text: "What does the symbol '$' mathematically accomplish inside reference cell formulas (like $A$1)?", options: ["Marks the cell as currency", "Creates an absolute reference that won't shift when copied", "Highlights the cell globally", "Specifies a macro property"], correctAnswerIndex: 1, explanation: "The '$' symbol locks axes stopping mathematical logic from migrating downward or horizontally upon formula drags.", section: "Logic & Reference"
  },
  {
    id: 18, text: "Which modern function supersedes both VLOOKUP and INDEX/MATCH efficiently?", options: ["SUPERLOOKUP", "YLOOKUP", "XLOOKUP", "SEARCHLOOK"], correctAnswerIndex: 2, explanation: "XLOOKUP efficiently looks both vertically and horizontally natively integrating error returning arguments directly.", isAdvanced: true, section: "Logic & Reference"
  },
  {
    id: 19, text: "Which function tests a logical evaluation and parses one outcome if TRUE mathematically, and a secondary action if FALSE?", options: ["WHILE()", "CHOOSE()", "IF()", "SWITCH()"], correctAnswerIndex: 2, explanation: "The structural IF() framework builds basic conditional boolean branching logic formulas dynamically.", section: "Logic & Reference"
  },
  {
    id: 20, text: "If you want an output to mathematically trigger strictly if BOTH condition A *and* condition B are structurally true, what function wraps the logic?", options: ["=IF(A:B)", "=BOTH(A, B)", "=AND(A, B)", "=MATCH(A, B)"], correctAnswerIndex: 2, explanation: "AND strictly requires every parameter tested structurally against boolean bounds to remain True.", section: "Logic & Reference"
  },

  // SECTION: Advanced Power Tools
  {
    id: 21, text: "In Power Query, which feature allows you to pivot/convert sprawling multiple columns back downward into tight row tables structurally for data modeling?", options: ["Transpose", "Unpivot Columns", "Merge Queries", "Group By"], correctAnswerIndex: 1, explanation: "Unpivot effectively normalizes matrix layout columns stacking identically repeated criteria dynamically into vertical row tracking tables.", isAdvanced: true, section: "Advanced Power Tools"
  },
  {
    id: 22, text: "What scripting programming language actively manages internal mathematical Macros for Microsoft Excel operations?", options: ["Python", "JavaScript", "C#", "Visual Basic for Applications (VBA)"], correctAnswerIndex: 3, explanation: "VBA remains natively embedded driving physical and mathematical algorithmic tasks structurally replacing clicking.", isAdvanced: true, section: "Advanced Power Tools"
  },
  {
    id: 23, text: "Inside the Data Model (Power Pivot), which feature structurally links table relationship frameworks leveraging unique identifier matching?", options: ["VLOOKUPs locally between tabs", "Drawing connections mapping Database Keys in Diagram View", "Data Validations matrices", "Unified consolidation"], correctAnswerIndex: 1, explanation: "Diagram views structure relationships securely defining strictly defined Keys integrating mathematical models globally representing relational databases.", isAdvanced: true, section: "Advanced Power Tools"
  },
  {
    id: 24, text: "Which mathematical simulation analysis specifically extrapolates backward indicating precisely what starting variable actively returns targeted completion totals natively?", options: ["Goal Seek", "Scenario Manager", "Data Table", "Solver"], correctAnswerIndex: 0, explanation: "Goal Seek natively solves reverse algebraic requirements iterating backwards until mathematical precision equals criteria matching exactly.", isAdvanced: true, section: "Advanced Power Tools"
  },
  {
    id: 25, text: "What massive data mathematical calculator swiftly summarizes thousands of distinct categories, allowing easy total aggregation structurally?", options: ["Matrix Chart", "Macro Consolidate", "Pivot Table", "SUMIFS Block Engine"], correctAnswerIndex: 2, explanation: "Pivot Tables remain widely leveraged executing dimensional aggregation mathematically tracking sprawling totals accurately instantly.", section: "Advanced Power Tools"
  }
];
