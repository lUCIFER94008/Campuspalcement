export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  details: {
    cgpaPassed: boolean;
    requiredCgpa: number;
    studentCgpa: number;
    backlogsPassed: boolean;
    allowedBacklogs: number;
    studentBacklogs: number;
    deptPassed: boolean;
    studentDept: string;
    batchPassed: boolean;
    studentBatch: string;
  };
}

export function checkEligibility(
  student: {
    cgpa: number;
    backlogs: number;
    department: string;
    batch: string;
  },
  job: {
    minCgpa: number;
    maxBacklogs: number;
    eligibleDepartments: string[];
    eligibleBatches: string[];
  }
): EligibilityResult {
  const cgpaPassed = student.cgpa >= job.minCgpa;
  const backlogsPassed = student.backlogs <= job.maxBacklogs;
  
  const deptPassed =
    !job.eligibleDepartments ||
    job.eligibleDepartments.length === 0 ||
    job.eligibleDepartments.some(d => d.toLowerCase() === student.department.toLowerCase() || d === 'ALL');
    
  const batchPassed =
    !job.eligibleBatches ||
    job.eligibleBatches.length === 0 ||
    job.eligibleBatches.includes(student.batch) ||
    job.eligibleBatches.includes('ALL');

  const reasons: string[] = [];

  if (!cgpaPassed) {
    reasons.push(`Minimum required CGPA is ${job.minCgpa} (Your CGPA: ${student.cgpa})`);
  }
  if (!backlogsPassed) {
    reasons.push(`Maximum allowed backlogs is ${job.maxBacklogs} (Your backlogs: ${student.backlogs})`);
  }
  if (!deptPassed) {
    reasons.push(`Your department (${student.department}) is not eligible for this role.`);
  }
  if (!batchPassed) {
    reasons.push(`Your batch (${student.batch}) is not eligible for this role.`);
  }

  return {
    isEligible: cgpaPassed && backlogsPassed && deptPassed && batchPassed,
    reasons,
    details: {
      cgpaPassed,
      requiredCgpa: job.minCgpa,
      studentCgpa: student.cgpa,
      backlogsPassed,
      allowedBacklogs: job.maxBacklogs,
      studentBacklogs: student.backlogs,
      deptPassed,
      studentDept: student.department,
      batchPassed,
      studentBatch: student.batch,
    },
  };
}
