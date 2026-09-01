export interface ResumeAnalysisResult {
  score: number; // e.g., 84
  grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  detectedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  strengths: string[];
}

export function analyzeResume(
  skills: string[],
  projectsCount: number,
  certificationsCount: number,
  cgpa: number,
  socialsCount: number
): ResumeAnalysisResult {
  let score = 40; // Base score

  // Skill weight
  if (skills.length >= 8) score += 25;
  else if (skills.length >= 4) score += 15;
  else score += 5;

  // Projects weight
  if (projectsCount >= 3) score += 15;
  else if (projectsCount >= 1) score += 8;

  // Certifications weight
  if (certificationsCount >= 2) score += 10;
  else if (certificationsCount >= 1) score += 5;

  // Academic weight
  if (cgpa >= 8.5) score += 10;
  else if (cgpa >= 7.5) score += 5;

  // Social profiles (GitHub/LinkedIn)
  if (socialsCount >= 2) score += 0; // capped at 100 overall
  score = Math.min(Math.max(score, 45), 98);

  const suggestions: string[] = [];
  if (skills.length < 6) suggestions.push('Add more core technical skills like Docker, TypeScript, or Cloud concepts.');
  if (projectsCount < 2) suggestions.push('Add at least 2 full-stack or domain-specific projects with GitHub & Live demo links.');
  if (certificationsCount === 0) suggestions.push('Earn industry recognized certifications (e.g. AWS, Meta Frontend, Google Cloud).');
  if (socialsCount < 2) suggestions.push('Link both GitHub and LinkedIn profiles to increase recruiter callback rate by 40%.');

  const strengths: string[] = [];
  if (cgpa >= 8.0) strengths.push('Strong academic performance (CGPA > 8.0)');
  if (skills.length >= 5) strengths.push(`Diverse skill portfolio (${skills.length} skills listed)`);
  if (projectsCount >= 2) strengths.push('Demonstrated practical project experience');

  const grade = score >= 85 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT';

  return {
    score,
    grade,
    detectedSkills: skills,
    missingSkills: ['TypeScript', 'Docker', 'GraphQL', 'System Design', 'Jest'].filter(s => !skills.includes(s)),
    suggestions,
    strengths,
  };
}
