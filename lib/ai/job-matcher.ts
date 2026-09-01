export function calculateJobMatch(
  student: {
    skills: string[];
    cgpa: number;
    department: string;
  },
  job: {
    skills: string[];
    minCgpa: number;
    eligibleDepartments: string[];
  }
): { matchPercentage: number; matchingSkills: string[]; missingSkills: string[] } {
  const studentSkillsLower = student.skills.map(s => s.toLowerCase());
  const jobSkillsLower = job.skills.map(s => s.toLowerCase());

  const matchingSkills = job.skills.filter(s => studentSkillsLower.includes(s.toLowerCase()));
  const missingSkills = job.skills.filter(s => !studentSkillsLower.includes(s.toLowerCase()));

  // 1. Skill match ratio (50%)
  const skillRatio = job.skills.length > 0 ? matchingSkills.length / job.skills.length : 1;
  const skillScore = skillRatio * 50;

  // 2. CGPA surplus bonus (30%)
  const cgpaDiff = Math.max(0, student.cgpa - job.minCgpa);
  const cgpaScore = Math.min(30, (student.cgpa / 10) * 30 + (cgpaDiff > 1 ? 5 : 0));

  // 3. Department alignment (20%)
  const deptMatch =
    !job.eligibleDepartments ||
    job.eligibleDepartments.length === 0 ||
    job.eligibleDepartments.some(d => d.toLowerCase() === student.department.toLowerCase() || d === 'ALL');
  const deptScore = deptMatch ? 20 : 5;

  const matchPercentage = Math.round(Math.min(100, Math.max(25, skillScore + cgpaScore + deptScore)));

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
  };
}
