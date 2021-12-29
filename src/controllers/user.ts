import { Request, Response } from 'express';

import userModel from '../models/user';

const getUsers = async (req: Request, res: Response) => {
    const users = await userModel.find({}).populate('projectsRef').exec();;
    if (users.length > 0) {
        res.status(200).json(users);
    } else {
        res.status(200).json('users not found');
    }
};

const createUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    try {
        const user = new userModel({
            username: username
        });

        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(422).json(error);
    }
};

export { getUsers, createUser };
