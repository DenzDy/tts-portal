export interface FormFields {
    Name: string;
    Order: string;
    "Section Order"?: string;
    Module?: string;
    View?: string;
    Label: string;
    Placeholder?: string;
    Helper?: string;
    "Additional Text"?: string;
    Type: "text" | "textarea" | "email" | "number" | "checkbox" | "radio" | "select" | "date" | "upload";
    Options?: string;
    "Max Length"?: string;
    "Min Value"?: string;
    "Max Value"?: string;
    Regex?: string;
    Validation?: string;
    "Custom Error Message"? : string;
    Required?: 'true' | 'false';
}

export const UploadFileTypes = [
    "application/pdf",
    "image/png",
    "img/jpeg",
    "img/jpg"
]

export const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
export const fileSizeLimitText = "5MB";