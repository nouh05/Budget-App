export function calculateInvestmentReturn(
    monthlyInvestment: number,
    age: number,
    targetAge: number,
    annualReturn: number = 0.08
  ): number {
    if (targetAge <= age) {
      throw new Error("The target retirement age must be greater than your current age");
    }
  
    const r = annualReturn / 12; // monthly return rate
    const n = (targetAge - age) * 12; // number of months invested
  
    const futureValue = monthlyInvestment * (((1 + r) ** n - 1) / r) * (1 + r);
  
    return Math.round(futureValue);
  }