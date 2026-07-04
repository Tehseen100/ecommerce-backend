import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            maxlength: [32, 'Category name cannot exceed 32 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// pre-save hook to generate slug automatically before saving
categorySchema.pre('save', function () {
    if (!this.isModified('name')) return;

    this.slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove all non-word characters (except spaces and hyphens)
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
        .replace(/^-+|-+$/g, '');  // Trim hyphens from the start and end of the string
});

export const Category = mongoose.model('Category', categorySchema);