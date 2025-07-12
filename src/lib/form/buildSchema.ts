import { z, ZodType } from "zod";
import type { FormFields } from "./formTypes";
import { UploadFileTypes, fileSizeLimit, fileSizeLimitText } from "./formTypes";

export function buildZodField(def: FormFields): ZodType {
    let schema: ZodType;
    let errorMessage: string = def?.['Custom Error Message']?.toLowerCase() || "invalid format";
    let options: string[] = def.Options?.split("; ").map(opt => opt.trim()).filter(Boolean) ?? [];

    switch (def.Type?.toLowerCase()) {
        case 'text':
        case 'textarea':
            schema = z.string();

            if (def?.Required?.toLowerCase() === "true") {
                schema = (schema as z.ZodString).min(1, { "message": "required" });
            }

            if (def['Max Length']) {
                schema = (schema as z.ZodString).max(Number(def['Max Length']), { "message": "exceeded character limit" });
            }
            if (def.Regex) {
                schema = (schema as z.ZodString).regex(new RegExp(def.Regex), { "message": errorMessage });
            }
            break;
        
        case 'email':
            let emailSchema = z.string().email({ message: errorMessage || "invalid email address" });

            if (def['Max Length']) {
                emailSchema = emailSchema.max(Number(def['Max Length']), { "message": "exceeded character limit" });
            }

            schema = emailSchema;
            break;
        
        case 'number':
            if (def.Regex) {
                let numSchema = z.string().regex(new RegExp(def.Regex), { "message": errorMessage });

                if (def?.Required?.toLowerCase() === "true") {
                    numSchema = (numSchema as z.ZodString).min(1, { "message": "required" });
                }

                schema = numSchema.transform(Number);
                
                if (def['Min Value']) {
                    const minVal = Number(def['Min Value']);
                    schema = (schema as z.ZodNumber).min(minVal, { message: `number should be minimum ${minVal}` });
                }
                if (def['Max Value']) {
                    const maxVal = Number(def['Max Value']);
                    schema = (schema as z.ZodNumber).max(maxVal, { message: `number should be maximum ${maxVal}` });
                }
                break;
            }

            // If no regex, use z.coerce.number directly
            schema = z.coerce.number({
                invalid_type_error: errorMessage || "must be a number",
            });

            if (def['Min Value']) {
                const minVal = Number(def['Min Value']);
                schema = (schema as z.ZodNumber).min(minVal, { message: `number should be minimum ${minVal}` });
            }

            if (def['Max Value']) {
                const maxVal = Number(def['Max Value']);
                schema = (schema as z.ZodNumber).max(maxVal, { message: `number should be maximum ${maxVal}` });
            }
            break;

        case 'checkbox':
            if (options.length > 0) {
                const checkboxOptions = [...options];
                if (!checkboxOptions.includes("None")) {
                    checkboxOptions.push("None");
                }

                let arraySchema = z.array(z.enum(checkboxOptions as [string, ...string[]]));

                // Apply 'min(1)' IF REQUIRED
                if (def?.Required?.toLowerCase() === "true") {
                    arraySchema = arraySchema.min(1, {
                        message: "at least one option must be selected"
                    });
                }

                // apply optional() and default([])
                schema = arraySchema.optional().default([]);

            } else {
                // Single boolean checkbox (e.g., terms and conditions)
                let booleanSchema = z.union([z.literal("on"), z.literal(true), z.literal(false), z.literal("")]).optional()
                    .transform(val => val === "on" || val === true);

                // If required, ensure it's true
                if (def?.Required?.toLowerCase() === "true") {
                    schema = (booleanSchema as z.ZodEffects<any, boolean>)
                        .refine(val => val === true, {
                            message: "this box must be checked."
                        });
                } else {
                    schema = booleanSchema;
                }
            }
            break;

		case 'radio':
            if (options.length > 0) {
                schema = z.enum(options as [string, ...string[]], {
                    errorMap: () => ({ message: "please select an option" })
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
                    errorMap: () => ({ message: "please select an option" })
                });
            } else {
                schema = z.string();
            }
            break;

        case 'multiselect':
            if (options.length > 0) {
                const msOptions = [...options];
                if (!msOptions.includes("None")) msOptions.push("None");

                schema = z.array(z.enum(msOptions as [string, ...string[]]));
                
                
                if (def?.Required?.toLowerCase() === "true") {
                    schema = (schema as z.ZodArray<z.ZodEnum<[string, ...string[]]>>).min(1, {
                        message: "at least one option must be selected"
                    });
                }
            } else {
                schema = z.array(z.string()); // Fallback for no options
                if (def?.Required?.toLowerCase() === "true") {
                    schema = (schema as z.ZodArray<z.ZodString>).min(1, {
                        message: "at least one option must be selected"
                    });
                }
            }
            break;
        
        case 'date':
            schema = z.coerce.date({
                required_error: "date is required.",
                invalid_type_error: "invalid date format"
            });
            break;

        case 'upload':
            schema = z.instanceof(File, { "message": "please upload a file" })
                .refine(
                    (file) => UploadFileTypes.includes(file.type),
                    { message: "invalid file type" }
                )
                .refine(
                    (file) => file.size <= fileSizeLimit,
                    { message: `file size should be less than ${fileSizeLimitText}` }
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