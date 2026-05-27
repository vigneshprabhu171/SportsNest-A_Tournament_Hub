import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['individual', 'team'], default: 'individual' },
  teamName: String,
  teamMembers: [{ name: String, email: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  organizerNote: String
}, { timestamps: true });

registrationSchema.index({ tournament: 1, player: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
