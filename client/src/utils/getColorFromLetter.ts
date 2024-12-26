// Function to get a color based on the first letter
export const getColorFromLetter = (letter: string): string => {
  const colors: { [key: string]: string } = {
    A: "#FF5733",
    B: "#33FF57",
    C: "#3357FF",
    D: "#F1C40F",
    E: "#8E44AD",
    F: "#E67E22",
    G: "#2ECC71",
    H: "#3498DB",
    I: "#9B59B6",
    J: "#1ABC9C",
    K: "#34495E",
    L: "#E74C3C",
    M: "#2C3E50",
    N: "#F39C12",
    O: "#D35400",
    P: "#C0392B",
    Q: "#7D3C98",
    R: "#2980B9",
    S: "#27AE60",
    T: "#8E44AD",
    U: "#F1C40F",
    V: "#D35400",
    W: "#2C3E50",
    X: "#E67E22",
    Y: "#F39C12",
    Z: "#3498DB",
  };

  // Normalize the letter to uppercase
  const upperLetter = letter.toUpperCase();
  return colors[upperLetter] || "#BDC3C7"; // Default color if letter not found
};
