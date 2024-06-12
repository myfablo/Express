const mongoose = require('mongoose');
const { Schema } = mongoose;
const basicDetailsModel = require('./basicDetails.model.js')


const bankDetailsSchema = new Schema({
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'basicDetailsModel',
        required: true,
      },
      bankId:{
        type: String,
        required: true,
        unique:true
      },
      accountNumber: {
        type: Number,
        required: true,
        unique:true
      },
      accountHolder:{
        type: String,
        required: true
      },
      ifsc:{
         type: String,
         required: true
      },
      branchName: {
        type: String,
        required: true
      },
      bankName:{
        type: String,
        required: true
      },
      isActive:{
        type:Boolean,
        default:false
      },
      isDeleted:{
        type:Boolean,
        default:false
      }
},{timestamps:true})

const bankDetailsModel = mongoose.model('banks',bankDetailsSchema)

module.exports = {bankDetailsModel}