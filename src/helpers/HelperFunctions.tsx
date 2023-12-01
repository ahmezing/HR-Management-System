export class HelperFunctions {
  static getAge = (date: Date): number => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate()))
      age--;
    return age;
  };

  static formatTimeAgo(date: string) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000); // Convert to seconds

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff <= 0) {
      return "Just now";
    } else if (diff < minute) {
      return `${diff === 0 ? "0" : diff} seconds ago`;
    } else if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return `${minutes === 1 ? "1 minute" : `${minutes} minutes`} ago`;
    } else if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours === 1 ? "1 hour" : `${hours} hours`} ago`;
    } else {
      const days = Math.floor(diff / day);
      return `${days === 1 ? "1 day" : `${days} days`} ago`;
    }
  }
}
