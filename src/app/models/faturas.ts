const { Schema, model } = require('../../database');

const FaturaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  services: [{
    type: Object,
    required: true,
  }],
  totalValue: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Fatura = model('Fatura', FaturaSchema);

module.exports = Fatura;

export {}