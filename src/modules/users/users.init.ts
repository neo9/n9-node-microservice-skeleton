import { Container, N9Log } from 'n9-node-routing';

import { UsersService } from './users.service';

export default async (logger: N9Log): Promise<void> => {
	const log = logger.module('users');

	log.info('Ensuring email unique index');
	const usersService: UsersService = Container.get(UsersService);

	for (let i = 0; i < 1000; i += 1) {
		const email = `a+${i}@b.fr`;
		if (!(await usersService.getByEmail(email))) {
			await usersService.create(
				{
					email,
					firstName: 'firstName',
					lastName: 'lastName',
					password: 'azerty',
					someData: Array(1000).fill('something'),
				},
				'INIT',
			);
		}
	}
};
