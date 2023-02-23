import { Container } from 'n9-node-routing';
import * as Mockito from 'ts-mockito';
import { Class } from 'type-fest';

export function inject<T extends Class[]>(
	...services: T
): {
	[K in keyof T]: T[K] extends Class ? InstanceType<T[K]> : never;
};
export function inject<T extends any[]>(...manyServiceClass: T): any[] {
	const args = manyServiceClass.map((serviceClass) => {
		return Container.get(serviceClass);
	});
	return args as any;
}

export const getMockedName = (serviceClass: Class): string => `__mock__${serviceClass.name}__`;

// override a service in the container
export function overrideService<T extends Class>(serviceClass: T, instance: any): void {
	Container.remove(serviceClass);
	Container.set(serviceClass, instance);
}

// mock a service, register the service instance and the mock, and return the mocked service class
export function mockService<T extends Class>(serviceClass: T): InstanceType<T> {
	const mockedServiceClass = Mockito.mock(serviceClass);
	Container.remove(serviceClass);
	Container.set(serviceClass, Mockito.instance(mockedServiceClass));
	Container.set(getMockedName(serviceClass), mockedServiceClass);
	return mockedServiceClass;
}
