export function generateColorFromString(str: string): string {
    const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FECA57",
        "#48C9B0",
        "#6C5CE7",
        "#FD79A8",
        "#A29BFE",
        "#00B894",
        "#FDCB6E",
        "#E17055",
        "#74B9FF",
        "#A0E7E5",
        "#FFB8B8",
        "#C7ECEE",
        "#DFE6E9",
        "#55A3FF",
        "#FD79A8",
        "#BADC58",
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

export function getInitials(name: string): string {
    if (!name) return "";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return name.substring(0, 2).toUpperCase();
    }

    const initials = words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return initials;
}

export function getLighterShade(
    hexColor: string,
    percent: number = 20,
): string {
    const num = parseInt(hexColor.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16)
        .slice(1)
        .toUpperCase();
}
