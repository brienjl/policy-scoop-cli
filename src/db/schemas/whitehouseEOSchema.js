// todo define data model for DB ==> data is sourced from WhiteHouse.gov/executive orders

import mongoose from "mongoose";

const executive_order = new mongoose.Schema({
    
    // DOCUMENT META DATA
    orderNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    signing_date: { type: Date, required: true },

    // DOCUMENT CONTENT
    original_text: { type: String, required: true },
});

export default mongoose.model('executive_order', executive_order);