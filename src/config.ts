export default require(`${process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']}/.misskey/api.json`);
