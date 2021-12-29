import { Request, Response } from 'express';

import projectModel from '../models/project';
import userModel from '../models/user';

const getProjects = async (req: Request, res: Response) => {
    const projects = await projectModel.find({}).populate('userRef').exec();
    if (projects.length > 0) {
        res.status(200).json(projects);
    } else {
        res.status(200).json('projects not found');
    }
};

let workingTime = 0;
let timerTask: any;

const count = () => {
    workingTime += 1;
    console.log(workingTime);
};

const run = () => {
    timerTask = setInterval(count, 1000);
};

const stop = () => {
    clearInterval(timerTask);
    const total = new Date(workingTime * 1000).toUTCString().substring(17, 25);
    console.log('time here', total);
    console.log('timer stopped');
};

const startWork = async (req: Request, res: Response) => {
    const { username, description, startDate } = req.body;

    const user = await userModel.findOne({ username: username });

    const projects = await projectModel.find({ isStopped: false });

    if (!user) return res.status(200).json('user not found');
    if (projects.length > 0) return res.status(422).json(`please stop any not finished work`);

    try {
        const project = new projectModel({
            description: description,
            userRef: user._id
        });

        user.projectsRef.push(project._id);
        run();
        await project.save().then(async () => await user.save());

        res.status(201).json(project);
    } catch (error) {
        res.status(422).json(error);
    }

};

const stopWork = async (req: Request, res: Response) => {
    const { username, description } = req.body;

    const user = await userModel.findOne({ username: username });

    const project = await projectModel.findOne({ description: description, isStopped: false });

    if (!user) return res.status(200).json('user not found');
    if (!project) return res.status(200).json('project is not found or already stopped');

    try {
        stop();
        project.isStopped = true;
        project.finishDate = new Date().toUTCString();
        project.workingTime = workingTime;

        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(422).json(error);
    }

};

export { getProjects, startWork, stopWork };
