import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    tenantId: { 
        type: String, 
        required: true 
    },
    email:{
        type: String,
        required: true
    },
    dbUri: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Tenant = mongoose.model('Tenant', tenantSchema)