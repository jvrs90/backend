import { Env } from '@Common/enums/env.enum';
import { GenericErrors } from '@Common/enums/generic-errors.enum';
import { ImageTypes } from '@Common/enums/image-types.enum';
import { BadRequestException } from '@nestjs/common';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { config } from 'dotenv';

config();

export const FOLDER_UPLOADS = join(
	__dirname,
	`../../..${process.env[Env.UPLOADS_STATICS_PATH]}`
);

/**
 * Filter upload image by file extension function
 *
 * @param  {Request} _req
 * @param  {any} file
 * @param  {(error:Error,acceptFile:boolean)=>void} cb
 */
export const fileFilter = (
	_req: Request,
	file: any,
	cb: (error: Error, acceptFile: boolean) => void
) => {
	const regExpImg = new RegExp(
		'\\.(' + Object.values(ImageTypes).join('|') + ')$'
	);
	if (!file.originalname.toLocaleLowerCase().match(regExpImg)) {
		return cb(new BadRequestException(GenericErrors.FILE_NOT_ALLOWED), false);
	}
	cb(null, true);
};

/**
 * Multer Storage config
 */
export const imageStorage = diskStorage({
	destination: FOLDER_UPLOADS,
	filename: (req, file, callback) => {
		const fileExtName = extname(file.originalname);
		callback(
			null,
			`user-${(req.user as IUserDoc)._id}-${Date.now()}${fileExtName}`
		);
	},
});

export const imageBook = diskStorage({
	destination: FOLDER_UPLOADS,
	filename: (req, file, callback) => {
		const fileExtName = extname(file.originalname);
		callback(null, `book-${req.params.id}-${Date.now()}${fileExtName}`);
	},
});

