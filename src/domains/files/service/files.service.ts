import { injectable } from 'inversify';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import sharp from 'sharp';
import { FileResponseDto } from '../dto/file-response.dto';
import { IFilesService } from './files.service.interface';
import { FileEntity } from '../file.entity';

@injectable()
export class FilesService implements IFilesService {
  async upload(files: Express.Multer.File[]): Promise<FileResponseDto[]> {
    const dateFolder = format(new Date(), 'yyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    const result: FileResponseDto[] = [];

    await ensureDir(uploadFolder);

    for (const file of files) {
      let newFile = null;

      if (file.mimetype.includes('image')) {
        const buffer = await this.convertToWebP(file.buffer);

        newFile = new FileEntity({
          originalname: `${file.originalname.split('.')[0]}_${Date.now()}.webp`,
          buffer,
        });
      } else {
        newFile = new FileEntity(file);
      }

      await writeFile(`${uploadFolder}/${newFile.originalname}`, newFile.buffer);

      result.push({ url: `${dateFolder}/${newFile.originalname}`, name: newFile.originalname });
    }

    return result;
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return await sharp(file).webp().toBuffer();
  }
}
