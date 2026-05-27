import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sportType: { type: String, required: true },
  format: { type: String, required: true },
  mode: { type: String, enum: ['online', 'offline'], required: true },
  venueDetails: String,
  location: String,
  googleMapsLink: String,
  rules: { type: String, required: true },
  registrationStartDate: { type: Date, required: true },
  registrationEndDate: { type: Date, required: true },
  tournamentDate: { type: Date, required: true },
  participantLimit: { type: Number, required: true, min: 1 },
  organizerContact: {
    email: { type: String, required: true },
    phone: String
  },
  bannerUrl: String,
  prizeDetails: String,
  description: String,
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'suspended', 'cancelled', 'completed'],
    default: 'pending_approval'
  },
  registrationClosed: { type: Boolean, default: false },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedRegistrations: { type: Number, default: 0 },
  rejectionReason: String,
  suspendedReason: String
}, { timestamps: true });

tournamentSchema.index({ title: 'text', sportType: 'text', location: 'text' });

export default mongoose.model('Tournament', tournamentSchema);
