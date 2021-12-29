import mongoose, { Schema, Types } from 'mongoose';

interface Project {
    description: string;
    startDate: Date;
    workingTime: number;
    finishDate: Date;
    userRef: object;
}

const ProjectSchema = new Schema<Project>({
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: new Date
    },
    workingTime: {
        type: Number,
        required: true,
        default: 0
    },
    finishDate: {
        type: Date
    },
    userRef: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true });

const Project = mongoose.model("projects", ProjectSchema);

export default Project;
