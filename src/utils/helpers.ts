/**
 * Bloom — Date / age helpers
 */

export function getChildAge(birthDate: string): { years: number; months: number } {
  const birth = new Date(birthDate);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (now.getDate() < birth.getDate() && months > 0) {
    months -= 1;
  }

  return { years, months };
}

export function formatChildAge(birthDate: string): string {
  const { years, months } = getChildAge(birthDate);
  if (years === 0) return `${months}m old`;
  return `${years}y ${months}m old`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatTime(time: string): string {
  return time; // Already in HH:mm
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
