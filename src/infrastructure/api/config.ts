export const API_CONFIG = {
    AIRTABLE_API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY || "",
    AIRTABLE_BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID || "",
    AIRTABLE_APPOINTMENTS_TABLE:
        import.meta.env.VITE_AIRTABLE_APPOINTMENTS_TABLE || "Appointments",
    AIRTABLE_AGENTS_TABLE: import.meta.env.VITE_AIRTABLE_AGENTS_TABLE ||
        "Agents",
    AIRTABLE_CONTACTS_TABLE: import.meta.env.VITE_AIRTABLE_CONTACTS_TABLE ||
        "Contacts",
    AIRTABLE_BASE_URL: "https://api.airtable.com/v0",
};

export const getAirtableHeaders = () => ({
    "Authorization": `Bearer ${API_CONFIG.AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
});
