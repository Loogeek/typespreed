import "reflect-metadata";
import * as walkSync from "walk-sync";
import BeanFactory from "./bean-factory.class";
import LogFactory from "./factory/log-factory.class";

function app<T extends {new (...args: any[]): {}}>(constructor: T) {

    const srcDir = process.cwd() + "/src";
    const srcPaths = walkSync(srcDir, { globs: ['**/*.ts'] });

    const testDir = process.cwd() + "/test";
    const testPaths = walkSync(testDir, { globs: ['**/*.ts'] });

    (async () => {
        try {
            for(let p of srcPaths) {
               const moduleName = p.replace('.d.ts', '').replace('.ts', '')
               await import(srcDir + "/" + moduleName);
            }
        
            for(let p of testPaths) {
                const moduleName = p.replace('.d.ts', '').replace('.ts', '')
                await import(testDir + "/" + moduleName);    
            }                
        } catch (error) {
            console.error(error)
        }
        log('main start')
        const main = new constructor()
        main['main']()
    })()
}

function onClass<T extends { new(...args: any[]): {} }>(constructor: T) {
    log("decorator onClass: " + constructor.name);
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            //console.log("this.name");
        }
    };
}

function bean(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    let returnType = Reflect.getMetadata("design:returntype", target, propertyName);
    log("decorator bean, the return Type is: " + returnType.name);
    BeanFactory.putBean(returnType, target[propertyName]);
}

function autoware(target: any, propertyName: string): void {
    const type = Reflect.getMetadata('design:type', target, propertyName)
    Object.defineProperty(target, propertyName, {
        get: function MyProperty() {
            const beanFunction = BeanFactory.getBean(type)
            return beanFunction()
        }
    })
}


function inject(): any {
    console.log("decorator inject, outside the return.");
    return (target: any, propertyKey: string) => {
        console.log("decorator inject, in the return, propertyKey: " + propertyKey);
        let type = Reflect.getMetadata("design:type", target, propertyKey);
        console.log("decorator inject, in the return, type.name: " + type.name);
        return {
            get: function () {
                return "decorator inject, in the return get function";
            }
        };
    }
}

function log(message?: any, ...optionalParams: any[]) {
    const logBean = BeanFactory.getBean(LogFactory);
    if(logBean) {
        const logObject = logBean();
        logObject.log(message, ...optionalParams);
    }else{
        console.log(message, ...optionalParams);
    }
}

export { app, onClass, bean, autoware, inject, log };