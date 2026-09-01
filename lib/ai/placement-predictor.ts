export interface PlacementPrediction {
  probabilityPercentage: number;
  readinessTier: 'TOP_TIER' | 'COMPETITIVE' | 'MODERATE' | 'NEEDS_PREPARATION';
  insights: string[];
  recommendedRoleTypes: string[];
}

export function predictPlacementReadiness(
  cgpa: number,
  backlogs: number,
  skillsCount: number,
  projectsCount: number
): PlacementPrediction {
  let score = 50;

  if (cgpa >= 8.5) score += 25;
  else if (cgpa >= 7.5) score += 15;
  else if (cgpa >= 6.5) score += 5;

  if (backlogs === 0) score += 15;
  else score -= backlogs * 10;

  score += Math.min(15, skillsCount * 2);
  score += Math.min(10, projectsCount * 3);

  const probabilityPercentage = Math.round(Math.min(96, Math.max(30, score)));

  let readinessTier: PlacementPrediction['readinessTier'] = 'MODERATE';
  if (probabilityPercentage >= 85) readinessTier = 'TOP_TIER';
  else if (probabilityPercentage >= 70) readinessTier = 'COMPETITIVE';
  else if (probabilityPercentage < 50) readinessTier = 'NEEDS_PREPARATION';

  const insights: string[] = [];
  if (cgpa >= 8.0 && backlogs === 0) {
    insights.push('Zero active backlogs and strong academic standing makes you eligible for Tier-1 Dream product companies.');
  }
  if (skillsCount >= 6) {
    insights.push('Broad technical stack increases interview shortlist rate by 3x across recruiters.');
  } else {
    insights.push('Adding 2-3 in-demand skills (React, Node, Python) will significantly boost shortlist odds.');
  }

  return {
    probabilityPercentage,
    readinessTier,
    insights,
    recommendedRoleTypes: ['Full Stack Engineer', 'Frontend Developer', 'Software Engineer', 'Data Analyst'],
  };
}
