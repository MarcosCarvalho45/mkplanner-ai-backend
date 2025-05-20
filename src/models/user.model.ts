import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  tenantId: string; // ID do tenant (empresa/cliente)
  subscription: 'free' | 'start' | 'platinum';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  tenantId: { type: String, required: true }, // Tenant obrigatório
  subscription: { type: String, enum: ['free', 'start', 'platinum'], default: 'free' },
});

export default mongoose.model<IUser>('User', UserSchema);
