import mongoose from "mongoose";

const fr_executive_order = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    retrieved_date: { type: Date, required: true },
    signing_date: { type: Date, required: true, index: true },
    president: { type: String, required: true, index: true},

    original_text: { type: String, required: true },
});

export default mongoose.model('fr_executive_order', fr_executive_order);