/**
 * Generates a consistent color based on a string (e.g., name)
 * This ensures the same name always gets the same color
 */
export function generateColorFromString(str: string): string {
    // Predefined vibrant color palette for better visual appearance
    const colors = [
        "#FF6B6B", // Coral Red
        "#4ECDC4", // Turquoise
        "#45B7D1", // Sky Blue
        "#96CEB4", // Mint Green
        "#FFEAA7", // Pastel Yellow
        "#DDA0DD", // Plum
        "#98D8C8", // Seafoam
        "#FFB6C1", // Light Pink
        "#87CEEB", // Sky Blue
        "#F4A460", // Sandy Brown
        "#9370DB", // Medium Purple
        "#20B2AA", // Light Sea Green
        "#FF8C00", // Dark Orange
        "#BA55D3", // Medium Orchid
        "#3CB371", // Medium Sea Green
        "#FF69B4", // Hot Pink
        "#4169E1", // Royal Blue
        "#DC143C", // Crimson
        "#00CED1", // Dark Turquoise
        "#FF1493", // Deep Pink
    ];

    // Generate a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Use the hash to select a color from the palette
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Gets the initials from a name
 * @param name Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
    if (!name) return "";

    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        // Single word: take first two characters
        return name.substring(0, 2).toUpperCase();
    }

    // Multiple words: take first letter of first two words
    const initials = words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return initials;
}

/**
 * Generates a lighter shade of a color for backgrounds
 * @param color Hex color
 * @param opacity Opacity level (0-1)
 */
export function getLighterShade(color: string, opacity: number = 0.1): string {
    // Convert hex to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
