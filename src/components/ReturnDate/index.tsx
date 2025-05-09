
export default function returnDate(date: string) {
    const d = new Date(date);
  
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
  }
