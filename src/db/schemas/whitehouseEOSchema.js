// todo define data model for DB ==> data is sourced from WhiteHouse.gov/executive orders

import mongoose from "mongoose";

const wh_executive_order = new mongoose.Schema({
    
    // DOCUMENT META DATA
    orderNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    retrieved_date: { type: Date, required: true },
    signing_date: { type: Date, required: true, index: true },
    president: { type: String, required: true, index: true },

    // DOCUMENT CONTENT
    original_text: { type: String, required: true },
});

export default mongoose.model('wh_executive_order', wh_executive_order);