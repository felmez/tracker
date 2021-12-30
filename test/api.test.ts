import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/app';

chai.should();

chai.use(chaiHttp);

const user = {
    username: 'david'
};

const userWithoutUsernameField = {
    user: 'david'
};

const project = {
    username: 'david',
    description: 'database bug fix'
};

const projectWithoutDescriptionField = {
    username: 'david'
};


describe('tracking time API', () => {
    // get users
    describe('GET /api/users', () => {
        it('should return all users exist in db', (done) => {
            chai.request(app).get('/api/users').end((_, response) => {
                response.should.have.status(200);
                done();
            });
        });
        it('should return 404 on wrong endpoint', (done) => {
            chai.request(app).get('/user').end((_, response) => {
                response.should.have.status(404);
                done();
            });
        });
    });
    // create user
    describe('POST /api/users', () => {
        it('should create a new user', (done) => {
            chai.request(app).post('/api/users').send(user).end((_, response) => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('username').eq(user.username);
                response.body.should.have.property('projectsRef').that.is.a('array');
                done();
            });
        });
        it('should not create a new user with already used username', (done) => {
            chai.request(app).post('/api/users').send(user).end((_, response) => {
                response.should.have.status(422);
                done();
            });
        });
        it('should not create a new user with missing username field', (done) => {
            chai.request(app).post('/api/users').send(userWithoutUsernameField).end((_, response) => {
                response.should.have.status(422);
                done();
            });
        });
    });
    // get projects/work
    describe('GET /api/projects', () => {
        it('should return all projects exist in db', (done) => {
            chai.request(app).get('/api/projects').end((_, response) => {
                response.should.have.status(200);
                done();
            });
        });
        it('should return 404 on wrong endpoint', (done) => {
            chai.request(app).get('/project').end((_, response) => {
                response.should.have.status(404);
                done();
            });
        });
    });
    // create/start work with description
    describe('POST /api/projects/start', () => {
        it('should create a new work with description', (done) => {
            chai.request(app).post('/api/projects/start').send(project).end((_, response) => {
                response.should.have.status(201);
                response.body.should.have.property('startDate').eq(new Date().toUTCString());
                response.body.should.be.a('object');
                response.body.should.have.property('description').eq(project.description);
                response.body.should.have.property('isStopped').eq(false);
                response.body.should.have.property('workingTime').that.is.a('number');
                done();
            });
        });
        it('should not create a new project without stopping the previous one', (done) => {
            chai.request(app).post('/api/projects/start').send(project).end((_, response) => {
                response.should.have.status(422);
                response.body.should.be.eq('please stop any not finished work');
                done();
            });
        });
        it('should not create a new project with missing description field', (done) => {
            chai.request(app).post('/api/users').send(projectWithoutDescriptionField).end((_, response) => {
                response.should.have.status(422);
                done();
            });
        });
    });
    // stop work
    describe('POST /api/projects/stop', () => {
        it('should stop the current work', (done) => {
            chai.request(app).post('/api/projects/stop').send(project).end((_, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('description').eq(project.description);
                response.body.should.have.property('isStopped').eq(true);
                response.body.should.have.property('workingTime').that.is.a('number');
                response.body.should.have.property('finishDate').eq(new Date().toUTCString());
                done();
            });
        });
    });
    // export work sheet file
    describe('POST /api/projects/export', () => {
        it('should calculate total work and export file', (done) => {
            chai.request(app).post('/api/projects/export').send(user).end((_, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            });
        });
        it('should return user not found for not exist user', (done) => {
            chai.request(app).post('/api/projects/export').send({ username: 'unknownUser' }).end((_, response) => {
                response.should.have.status(200);
                response.body.should.be.eq('user not found');
                done();
            });
        });
    });
    // delete user
    describe('DELETE /api/users/:id', () => {
        let userID: any;
        chai.request(app).get('/api/users').end((_, response) => {
            userID = response.body[0]._id;
        });
        if (userID) {
            it('should delete user by id', (done) => {
                chai.request(app).delete(`/api/users/${userID}`).end((_, response) => {
                    response.should.have.status(200);
                    response.body.should.be.eq('user deleted successfully');
                    done();
                });
            });
        }
    });
    // delete work
    describe('DELETE /api/projects/:id', () => {
        let projectID: any;
        chai.request(app).get('/api/projects').end((_, response) => {
            projectID = response.body[0]._id;
        });
        if (projectID) {
            it('should delete work by id', (done) => {
                chai.request(app).delete(`/api/projects/${projectID}`).end((_, response) => {
                    response.should.have.status(200);
                    response.body.should.be.eq('work deleted successfully');
                    done();
                });
            });
        }
    });
});
