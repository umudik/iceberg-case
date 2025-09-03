export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    fullName?: string;
}

export const createContact = (data: Partial<Contact>): Contact => ({
    id: data.id || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
});
