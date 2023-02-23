import * as stdMocks from 'std-mocks';

export const print = true;

interface CatchStdLogReturn<T> {
	stdout: string[];
	stderr: string[];
	error?: unknown;
	result: T;
}
export async function mockAndCatchStd<T>(fn: () => Promise<T>): Promise<CatchStdLogReturn<T>> {
	stdMocks.use({ print });
	let error: unknown;
	let result: T;
	try {
		result = await fn();
	} catch (e) {
		error = e;
	}
	const { stdout, stderr } = stdMocks.flush();
	stdMocks.restore();
	return { stdout, stderr, error, result };
}
