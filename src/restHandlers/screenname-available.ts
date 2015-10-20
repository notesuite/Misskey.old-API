import * as express from 'express';
import User from '../models/user';

export default function(req: express.Request, res: express.Response): void {
	'use strict';
	
}

module.exports = (req, res) ->
	[screen-name] = get-express-params req, <[ screen-name ]>

	if empty screen-name
	then res.api-error 400 'screen-name parameter is required :('
	else exist-screenname screen-name .then res.api-render
