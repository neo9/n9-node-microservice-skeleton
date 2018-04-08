launch()
		.then(() => {
			(global.log || console).log('Launch SUCCESS !');
		})
		.catch((e) => {
			(global.log || console).error('Error on lauch', e);
		});