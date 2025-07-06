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
                // Add "None" option
                options.push("None");

				// Multi-select checkboxes => array of strings
				schema = z.array(z.enum(options as [string, ...string[]])).min(1, {
					message: "At least one option must be checked"
				});
			} else {
				// Single true/false checkbox
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
                options.push("None");

                schema = z.enum(options as [string, ...string[]], {
                    errorMap: () => ({ message: "Please select a valid option" })
                });
            } else {
                schema = z.string();
            }

            break;

        case 'multiselect':
            if (options.length > 0) {
                options.push("None");

                schema = z.array(z.enum(options as [string, ...string[]]), {
                    message: "At least one option must be selected"
                })
            } else {
                schema = z.string();
            }

            break;
        
        case 'date':
            // change back to datetime later
            schema = z.string().date().transform(val => new Date(val));
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
            schema = z.any();
    }

    if (def?.Required?.toLowerCase() !== "true") {
        schema = schema.optional();
    }

    return schema;
}