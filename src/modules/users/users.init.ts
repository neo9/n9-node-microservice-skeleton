import { N9Log } from '@neo9/n9-node-log';
import { UsersService } from './users.service';

export default async (logger: N9Log) => {
	const log = logger.module('users');

	log.info('Ensuring email unique index');
	const usersService = (await require('typedi').Container.get(UsersService)) as UsersService;

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
