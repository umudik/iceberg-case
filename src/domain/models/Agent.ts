export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    themeColor: string;
}

export const createAgent = (data: Partial<Agent>): Agent => ({
    id: data.id || "",
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    themeColor: data.themeColor || "#000000",
});
