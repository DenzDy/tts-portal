import { z, ZodType } from "zod";
import type { FormFields } from "./formTypes";
import { UploadFileTypes, fileSizeLimit, fileSizeLimitText } from "./formTypes";

export function buildZodField(def: FormFields): ZodType {
    let schema: ZodType;
    let errorMessage: string = def?.['Custom Error Message'] || "Invalid format";
    let options: string[] = def.Options?.split("; ").map(opt => opt.trim()).filter(Boolean) ?? [];

    switch (def.Type?.toLowerCase()) {
        case 'text':
        case 'textarea':
            schema = z.string();

            if (def?.Required?.toLowerCase() === "true") {
                schema = schema.min(1, { "message": "Required" });
            }

            if (def['Max Length']) {
                schema = (schema as z.ZodString).max(Number(def['Max Length']), { "message": "Exceeded character limit" });
            }
            if (def.Regex) {
                schema = (schema as z.ZodString).regex(new RegExp(def.Regex), { "message": errorMessage });
            }
            break;
        
        case 'email':
            let emailSchema = z.string().email();

            if (def['Max Length']) {
                emailSchema = emailSchema.max(Number(def['Max Length']), { "message": "Exceeded character limit" });
            }

            schema = emailSchema;
            break;
        
        case 'number':
            if (def.Regex) {
                schema = z.string().regex(new RegExp(def.Regex), { "message": errorMessage }).transform(Number);
                break;
            }

            schema = z.coerce.number();

			if (def['Min Value']) {
                const minVal = Number(def['Min Value'])
                schema = (schema as z.ZodNumber).min(minVal, { message: `Number should be minimum ${minVal}` });
            }

			if (def['Max Value']) {
                const maxVal = Number(def['Max Value'])
                schema = (schema as z.ZodNumber).max(maxVal, { message: `Number should be maximum ${maxVal}` });
            }

			break;

        case 'checkbox':
            if (options.length > 0) {
                const checkboxOptions = [...options];

                // Only add "None" if not already there
                if (!checkboxOptions.includes("None")) {
                    checkboxOptions.push("None");
                }

                if (checkboxOptions.length === 0) {
                    schema = z.array(z.string());
                } else {
                    schema = z.array(z.enum(checkboxOptions as [string, ...string[]])).min(1, {
                        message: "At least one option must be selected"
                    });
                }
            } else {
                // Single boolean checkbox (e.g. terms and conditions)
                schema = z.union([z.literal("on"), z.literal(true), z.literal(false)])
                    .transform(val => val === "on" || val === true);
            }
            break;

		case 'radio':
            if (options.length > 0) {
                schema = z.enum(options as [string, ...string[]], {
                    errorMap: () => ({ message: "Please select an option" })
                });
            } else {
                schema = z.string();
            }
            break;
        
        case 'select':
            if (options.length > 0) {
                const selectOptions = [...options];
                if (!selectOptions.includes("None")) selectOptions.push("None");

                schema = z.enum(selectOptions as [string, ...string[]], {
                    errorMap: () => ({ message: "Please select an option" })
                });
            } else {
                schema = z.string();
            }
            break;

        case 'multiselect':
            if (options.length > 0) {
                const msOptions = [...options];
                if (!msOptions.includes("None")) msOptions.push("None");

                schema = z.array(z.enum(msOptions as [string, ...string[]]), {
                    message: "At least one option must be selected"
                });
            } else {
                schema = z.array(z.string()); // fallback
            }
            break;
        
        case 'date':
            schema = z
                .string()
                .refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date" })
                .transform(val => val ? new Date(val) : undefined);
            break;

        case 'upload':
            schema = z.instanceof(File, { "message": "Please upload a file" })
                .refine(
                    (file) => UploadFileTypes.includes(file.type),
                    { message: "Invalid file type" }
                )
                .refine(
                    (file) => file.size <= fileSizeLimit,
                    { message: `File size should be less than ${fileSizeLimitText}` }
                );
            
            break;
        
        default:
            schema = z.string();
    }

    if (def?.Required?.toLowerCase() !== "true") {
        schema = schema.optional();
    }

    return schema;
}