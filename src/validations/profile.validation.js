import * as yup from "yup";

const profileSchema = yup.object({
    fullName: yup
        .string()
        .min(3, "Full name must be at least 3 characters.")
        .max(50, "Full name must not exceed 50 characters."),

    email: yup
        .string()
        .email("Invalid email format."),

    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits."),

    bio: yup
        .string()
        .max(500, "Bio must not exceed 500 characters."),

    active: yup.boolean().default(true),

    dateOfBirth: yup
        .date()
});

export { profileSchema };
