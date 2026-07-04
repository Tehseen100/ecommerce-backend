import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [120, 'Product name cannot exceed 120 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Product stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Establishes a relationship with our Category model
            required: [true, 'Product must belong to a category'],
        },
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to automatically generate slug from name
productSchema.pre('save', function () {
    if (!this.isModified('name')) return;

    this.slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove all non-word characters (except spaces and hyphens)
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
        .replace(/^-+|-+$/g, '');  // Trim hyphens from the start and end of the string
});

export const Product = mongoose.model('Product', productSchema);