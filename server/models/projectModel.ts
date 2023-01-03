import mongoose, { InferSchemaType } from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
}, {
  timestamps: true
});

export type ProjectType = InferSchemaType<typeof projectSchema>;
export default mongoose.model('Project', projectSchema);