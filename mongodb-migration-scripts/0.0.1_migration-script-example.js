// documentation : https://github.com/neo9/n9-mongodb-migration#n9-mongodb-migration
async function up(db, log) {
	log.info('Log sample');
}

async function down(db, log) {
	log.info('Log sample on rollback');
}

module.exports = { up, down };
