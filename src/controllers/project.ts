import { Request, Response } from 'express';

import projectModel from '../models/project';
import userModel from '../models/user';

const getProjects = async (req: Request, res: Response) => {
    const projects = await projectModel.find({});
    if (projects.length > 0) {
        res.status(200).json(projects);
    } else {
        res.status(200).json('projects not found');
    }
};

const startWork = async (req: Request, res: Response) => {
    const { username, description, startDate } = req.body;

    const user = await userModel.findOne({ username: username });

    if (user) {
        try {
            const project = new projectModel({
                description: description,
                userRef: user._id
            });

            await project.save();

            res.status(201).json(project);
        } catch (error) {
            res.status(422).json(error);
        }

    } else {
        res.status(200).json('user not found');
    }

};

export { getProjects, startWork };

