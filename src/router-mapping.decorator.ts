import * as express from 'express';

const routerMapper = {
    get: {},
    post: {},
    all: {}
}

function setRouter(app: express.Application) {
    for(const key in routerMapper['get']) {
        app.get(key, routerMapper['get'][key])
    }

    for(const key in routerMapper['post']) {
        app.post(key, routerMapper['post'][key])
    }

    for(const key in routerMapper['all']) {
        app.all(key, routerMapper['all'][key])
    }
}

function Get(value: string) {
    return function(target: any, propertyName: string) {
        routerMapper['get'][value] = target[propertyName]
    }
}

function Post(value:string) {
    return function(target: any, propertyName: string) {
        routerMapper['post'][value] = target[propertyName]
    }
}

function Request(value:string) {
    return function(target: any, propertyName: string) {
        routerMapper['all'][value] = target[propertyName]
    }
}

export {
    Get,
    Post,
    Request,
    setRouter
}