import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['registration_approved', 'registration_rejected', 'tournament_cancelled', 'registration_closing', 'tournament_starting', 'system'],
    default: 'system'
  },
  readAt: Date,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
